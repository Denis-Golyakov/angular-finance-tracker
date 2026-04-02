import { Category } from "./category.model";

export interface Transaction {
    readonly id: string
    categoryId: string
    date: string // Unix timestamp
    amount: number
    type: 'income' | 'expense'
    description: string
}

export interface TransactionView extends Transaction {
    category: Category | undefined
    date: string
}