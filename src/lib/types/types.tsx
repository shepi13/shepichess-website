/**
 * General types
 */

export type NextSearchParams = {
    [key: string]: string | string[] | undefined
}

export interface PGNButtonSettings {
    onClick: () => void,
    disabled?: boolean,
    children: React.ReactNode,
}