declare module 'turndown-plugin-gfm' {
  import TurndownService from 'turndown'

  export interface GfmOptions {
    strikethrough?: boolean
    tables?: boolean
    taskListItems?: boolean
  }

  export function gfm(service: TurndownService): void
  export function strikethrough(service: TurndownService): void
  export function tables(service: TurndownService): void
  export function taskListItems(service: TurndownService): void
}
