export interface IUser {
    id: string | null
    createdAt: string | null
    updatedAt: string | null
    name: string | null
    email: string | null
    avatar: string | null
    occupation: string | null
    company: string | null
    date_birth: string | null
    twitter: string | null
    linkedin: string | null
    github: string | null
    facebook: string | null
    instagram: string | null
    phone_number: string | null
    description: string | null
    markdown: string | null
    username: string | null
    gender: string | null
    user_admin: IUserAdmin | null
}

export interface IUserAdmin {
    id: string | null
    user_admin_role: IUserAdminRole
}

export interface IUserAdminRole {
    id: string | null
    name: string | null
}

export interface IAuth {
    access_token: string | null
    refresh_token: string | null
    user: IUser | null
}