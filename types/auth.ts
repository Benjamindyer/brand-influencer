export type UserRole = 'creator' | 'brand' | 'admin'

export interface UserProfile {
    id: string
    role: UserRole
    created_at: string
    updated_at: string
}

export interface Session {
    user: {
        id: string
        email?: string
        role?: UserRole
    }
    access_token: string
}

export interface AuthError {
    message: string
    status?: number
}

