export enum Role {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
}

export enum RoleName {
    SUPER_ADMIN = "SUPER ADMIN",
    ADMIN = "ADMIN",
}

export function getUserRoleName(type: string): string | undefined {
    if (type === Role.SUPER_ADMIN)
        return RoleName.SUPER_ADMIN;
    else if (type === Role.ADMIN)
        return RoleName.ADMIN;
}