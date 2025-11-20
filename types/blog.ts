export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image: string | null
  published: boolean
  created_at: string
  updated_at: string
  author_id: string
  category: string | null
  tags: string[] | null
  read_time: number | null
}

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: Profile
}

export interface Like {
  id: string
  post_id: string
  user_id: string
  created_at: string
}

export interface Category {
  name: string
  count: number
}

export interface Tag {
  name: string
  count: number
}

export interface BlogPostWithRelations extends BlogPost {
  author?: Profile
  comments?: Comment[]
  likes?: Like[]
  _count?: {
    comments: number
    likes: number
  }
}
