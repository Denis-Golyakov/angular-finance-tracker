export interface Category {
    readonly id: string;
    readonly isDefault: boolean;
    name: string;
    color: string;
    icon?: string;
}