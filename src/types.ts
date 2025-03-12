export type Department = "android" | "ios" | "design" | "management" | "qa" | "back_office" | "frontend" | "hr" | "pr" | "backend" | "support" | "analytics"

export type User = {
    id: string
    avatarUrl: string
    firstName: string
    lastName: string
    userTag: string
    department: Department
    position: string
    birthday: string
    phone: string
}

export type DisplayedUser = {
    id: string
    avatarUrl: string
    firstName: string
    lastName: string
    userTag: string
    department: string
    position: string
    birthday: string
    phone: string
    firstNextYear: boolean
}

export type Users = {
    items: User[]
}

export type QueryParams = {
    __example?: Department
    __dynamic?: boolean
    __code?: number
}
