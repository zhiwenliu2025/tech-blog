import { type ImportAdapter, BaseAdapter } from './base'

// Register platform-specific adapters here (P1)
// import { CSDNAdapter } from './csdn'
// import { JuejinAdapter } from './juejin'

const adapters: ImportAdapter[] = [
  // Platform-specific adapters will be added here in P1
  // new CSDNAdapter(),
  // new JuejinAdapter(),
]

/**
 * Select the best adapter based on URL.
 * Falls back to BaseAdapter (Readability) if no specific adapter matches.
 */
export function getAdapter(url: string): ImportAdapter {
  return adapters.find(a => a.match(url)) ?? new BaseAdapter()
}
