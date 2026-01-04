-- Drop functions and indexes that depend on tables first
-- Note: Drop functions before dropping tables to avoid dependency issues
DROP FUNCTION IF EXISTS search_blog_posts(TEXT, INTEGER, INTEGER) CASCADE;
DROP FUNCTION IF EXISTS blog_posts_search_vector(blog_posts) CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS handle_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.delete_user() CASCADE;

-- Drop triggers before dropping tables
DROP TRIGGER IF EXISTS handle_blog_posts_updated_at ON blog_posts;
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS handle_comments_updated_at ON comments;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop indexes
DROP INDEX IF EXISTS blog_posts_search_idx;
DROP INDEX IF EXISTS blog_posts_published_idx;
DROP INDEX IF EXISTS blog_posts_category_idx;
DROP INDEX IF EXISTS blog_posts_published_at_idx;
DROP INDEX IF EXISTS comments_post_id_idx;
DROP INDEX IF EXISTS likes_post_id_idx;

-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[],
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create profiles table for user profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT,
  bio TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
DROP INDEX IF EXISTS blog_posts_published_idx;
CREATE INDEX blog_posts_published_idx ON blog_posts(published);

DROP INDEX IF EXISTS blog_posts_category_idx;
CREATE INDEX blog_posts_category_idx ON blog_posts(category);

DROP INDEX IF EXISTS blog_posts_published_at_idx;
CREATE INDEX blog_posts_published_at_idx ON blog_posts(published_at DESC);

DROP INDEX IF EXISTS comments_post_id_idx;
CREATE INDEX comments_post_id_idx ON comments(post_id);

DROP INDEX IF EXISTS likes_post_id_idx;
CREATE INDEX likes_post_id_idx ON likes(post_id);

-- Full-text search support
-- Create a function to generate search vector from title, excerpt, content, and tags
CREATE OR REPLACE FUNCTION blog_posts_search_vector(blog_posts)
RETURNS tsvector AS $$
BEGIN
  RETURN 
    setweight(to_tsvector('simple', COALESCE($1.title, '')), 'A') ||
    setweight(to_tsvector('simple', COALESCE($1.excerpt, '')), 'B') ||
    setweight(to_tsvector('simple', COALESCE($1.content, '')), 'C') ||
    setweight(to_tsvector('simple', COALESCE(array_to_string($1.tags, ' '), '')), 'B');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create GIN index for full-text search (using expression index)
DROP INDEX IF EXISTS blog_posts_search_idx;
CREATE INDEX blog_posts_search_idx ON blog_posts 
USING GIN (blog_posts_search_vector(blog_posts.*));

-- Create a search function for blog posts
CREATE OR REPLACE FUNCTION search_blog_posts(
  search_query TEXT,
  result_limit INTEGER DEFAULT 20,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  category TEXT,
  tags TEXT[],
  published BOOLEAN,
  author_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bp.id,
    bp.title,
    bp.slug,
    bp.excerpt,
    bp.content,
    bp.cover_image,
    bp.category,
    bp.tags,
    bp.published,
    bp.author_id,
    bp.created_at,
    bp.updated_at,
    bp.published_at,
    ts_rank_cd(blog_posts_search_vector(bp.*), plainto_tsquery('simple', search_query)) AS rank
  FROM blog_posts bp
  WHERE 
    blog_posts_search_vector(bp.*) @@ plainto_tsquery('simple', search_query)
    AND bp.published = true
  ORDER BY rank DESC, bp.published_at DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Policies for blog_posts
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

DROP POLICY IF EXISTS "Users can view their own draft posts" ON blog_posts;
CREATE POLICY "Users can view their own draft posts" ON blog_posts
  FOR SELECT USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can view all posts" ON blog_posts;
CREATE POLICY "Admins can view all posts" ON blog_posts
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Users can insert their own posts" ON blog_posts;
CREATE POLICY "Users can insert their own posts" ON blog_posts
  FOR INSERT WITH CHECK (auth.uid() = author_id);

DROP POLICY IF EXISTS "Users can update their own posts" ON blog_posts;
CREATE POLICY "Users can update their own posts" ON blog_posts
  FOR UPDATE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can update any posts" ON blog_posts;
CREATE POLICY "Admins can update any posts" ON blog_posts
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Users can delete their own posts" ON blog_posts;
CREATE POLICY "Users can delete their own posts" ON blog_posts
  FOR DELETE USING (auth.uid() = author_id);

DROP POLICY IF EXISTS "Admins can delete any posts" ON blog_posts;
CREATE POLICY "Admins can delete any posts" ON blog_posts
  FOR DELETE USING (public.is_admin());

-- Policies for profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
CREATE POLICY "Admins can update any profile" ON profiles
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Users can delete their own profile" ON profiles;
CREATE POLICY "Users can delete their own profile" ON profiles
  FOR DELETE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can delete any profile" ON profiles;
CREATE POLICY "Admins can delete any profile" ON profiles
  FOR DELETE USING (public.is_admin());

-- Policies for comments
DROP POLICY IF EXISTS "Anyone can view comments" ON comments;
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update their own comments" ON comments;
CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update any comments" ON comments;
CREATE POLICY "Admins can update any comments" ON comments
  FOR UPDATE USING (public.is_admin());

DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;
CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete any comments" ON comments;
CREATE POLICY "Admins can delete any comments" ON comments
  FOR DELETE USING (public.is_admin());

-- Policies for likes
DROP POLICY IF EXISTS "Anyone can view likes" ON likes;
CREATE POLICY "Anyone can view likes" ON likes
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert likes" ON likes;
CREATE POLICY "Authenticated users can insert likes" ON likes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can delete their own likes" ON likes;
CREATE POLICY "Users can delete their own likes" ON likes
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can delete any likes" ON likes;
CREATE POLICY "Admins can delete any likes" ON likes
  FOR DELETE USING (public.is_admin());

-- Policies for contact_messages
-- Allow anyone (including anonymous users) to insert contact messages
-- Note: This policy allows both authenticated and anonymous users to insert
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON contact_messages;
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT 
  TO anon, authenticated
  WITH CHECK (true);

-- Only admins can view contact messages
DROP POLICY IF EXISTS "Admins can view all contact messages" ON contact_messages;
CREATE POLICY "Admins can view all contact messages" ON contact_messages
  FOR SELECT 
  USING (public.is_admin());

-- Only admins can update contact messages
DROP POLICY IF EXISTS "Admins can update contact messages" ON contact_messages;
CREATE POLICY "Admins can update contact messages" ON contact_messages
  FOR UPDATE 
  USING (public.is_admin());

-- Only admins can delete contact messages
DROP POLICY IF EXISTS "Admins can delete contact messages" ON contact_messages;
CREATE POLICY "Admins can delete contact messages" ON contact_messages
  FOR DELETE 
  USING (public.is_admin());

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS handle_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER handle_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_comments_updated_at ON comments;
CREATE TRIGGER handle_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'preferred_username',
      SPLIT_PART(new.email, '@', 1),
      'user'
    ),
    COALESCE(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      ''
    ),
    COALESCE(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture',
      ''
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to delete a user
CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT (id) DO NOTHING;

-- Policies for avatar storage
-- Anyone can view all avatars (public bucket, needed for displaying user avatars in posts/comments)
DROP POLICY IF EXISTS "Anyone can view all avatars" ON storage.objects;
CREATE POLICY "Anyone can view all avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatar
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.role() = 'authenticated' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can update their own avatar
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Authenticated users can delete their own avatar
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can upload any avatar
DROP POLICY IF EXISTS "Admins can upload any avatar" ON storage.objects;
CREATE POLICY "Admins can upload any avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND 
    public.is_admin()
  );

-- Admins can update any avatar
DROP POLICY IF EXISTS "Admins can update any avatar" ON storage.objects;
CREATE POLICY "Admins can update any avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' AND 
    public.is_admin()
  );

-- Admins can delete any avatar
DROP POLICY IF EXISTS "Admins can delete any avatar" ON storage.objects;
CREATE POLICY "Admins can delete any avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' AND 
    public.is_admin()
  );

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true) ON CONFLICT (id) DO NOTHING;

-- Policies for blog images storage
-- Anyone can view blog images (public bucket)
DROP POLICY IF EXISTS "Anyone can view blog images" ON storage.objects;
CREATE POLICY "Anyone can view blog images" ON storage.objects
  FOR SELECT USING (bucket_id = 'blog-images');

-- Authenticated users can upload blog images
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'blog-images' AND 
    auth.role() = 'authenticated'
  );

-- Users can delete their own blog images (based on folder structure: {user_id}/...)
DROP POLICY IF EXISTS "Users can delete their own blog images" ON storage.objects;
CREATE POLICY "Users can delete their own blog images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-images' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can delete any blog images
DROP POLICY IF EXISTS "Admins can delete any blog images" ON storage.objects;
CREATE POLICY "Admins can delete any blog images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'blog-images' AND 
    public.is_admin()
  );