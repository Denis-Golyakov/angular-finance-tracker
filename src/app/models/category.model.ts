import { Color } from "./color.model";

export interface Category {
    readonly id: string;
    readonly isDefault: boolean;
    name: string;
    color: Color;
    icon?: string;
}