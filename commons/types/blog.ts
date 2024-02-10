export type Blog = {
    id: number,
    createdAt: string,
    updatedAt: string,
    title: string,
    date: string,
    summary: string,
    image: string,
    image_alt: string,
    markdown: string,
    draft: boolean,
    views: number,
    slug: string,
    user_id: number | null,
    tags?: [] | undefined,
    user?: User
}

export type Tag = {
    id: number,
    createdAt: string,
    updatedAt: string,
    name: string,

}
export type User = {
    id: number,
    createdAt: string,
    updatedAt: string,
    name: string,
    email: string,
    avatar: string,
    occupation: string,
    company: string,
    date_birth: string,
    twitter: string,
    linkedin: string,
    github: string,
    facebook: string,
    instagram: string,
    phone_number: string,
    description: string,
}