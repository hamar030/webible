/**
 * Gist
 */
export type Gist = {
    url: string
    forks_url: string
    commits_url: string
    id: string
    node_id: string
    git_pull_url: string
    git_push_url: string
    html_url: string
    files: {
      [k: string]: {
        filename?: string
        type?: string
        language?: string
        raw_url?: string
        size?: number
        [k: string]: unknown
      }
    }
    public: boolean
    created_at: string
    updated_at: string
    description: string | null
    comments: number
    user: null | SimpleUser1
    comments_url: string
    owner?: null | SimpleUser2
    truncated?: boolean
    forks?: unknown[]
    history?: unknown[]
    [k: string]: unknown
  } | null
  
  /**
   * Gist Simple
   */
  export interface GistSimple {
    forks?:
      | {
          id?: string
          url?: string
          user?: PublicUser
          created_at?: string
          updated_at?: string
          [k: string]: unknown
        }[]
      | null
    history?: GistHistory[] | null
    fork_of?: Gist
    url?: string
    forks_url?: string
    commits_url?: string
    id?: string
    node_id?: string
    git_pull_url?: string
    git_push_url?: string
    html_url?: string
    files?: {
      [k: string]: {
        filename?: string
        type?: string
        language?: string
        raw_url?: string
        size?: number
        truncated?: boolean
        content?: string
        [k: string]: unknown
      } | null
    }
    public?: boolean
    created_at?: string
    updated_at?: string
    description?: string | null
    comments?: number
    user?: string | null
    comments_url?: string
    owner?: SimpleUser3
    truncated?: boolean
    [k: string]: unknown
  }
  /**
   * Public User
   */
  export interface PublicUser {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string | null
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
    name: string | null
    company: string | null
    blog: string | null
    location: string | null
    email: string | null
    hireable: boolean | null
    bio: string | null
    twitter_username?: string | null
    public_repos: number
    public_gists: number
    followers: number
    following: number
    created_at: string
    updated_at: string
    plan?: {
      collaborators: number
      name: string
      space: number
      private_repos: number
      [k: string]: unknown
    }
    suspended_at?: string | null
    private_gists?: number
    total_private_repos?: number
    owned_private_repos?: number
    disk_usage?: number
    collaborators?: number
  }
  /**
   * Gist History
   */
  export interface GistHistory {
    user?: null | SimpleUser
    version?: string
    committed_at?: string
    change_status?: {
      total?: number
      additions?: number
      deletions?: number
      [k: string]: unknown
    }
    url?: string
    [k: string]: unknown
  }
  /**
   * A GitHub user.
   */
  export interface SimpleUser {
    name?: string | null
    email?: string | null
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string | null
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
    starred_at?: string
    [k: string]: unknown
  }
  /**
   * A GitHub user.
   */
  export interface SimpleUser1 {
    name?: string | null
    email?: string | null
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string | null
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
    starred_at?: string
    [k: string]: unknown
  }
  /**
   * A GitHub user.
   */
  export interface SimpleUser2 {
    name?: string | null
    email?: string | null
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string | null
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
    starred_at?: string
    [k: string]: unknown
  }
  /**
   * A GitHub user.
   */
  export interface SimpleUser3 {
    name?: string | null
    email?: string | null
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string | null
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
    starred_at?: string
    [k: string]: unknown
  }
  