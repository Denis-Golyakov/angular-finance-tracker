export interface Transaction {
    readonly id: string
    categoryId: string
    date: string // Unix timestamp
    amount: number
    type: 'income' | 'expense'
    description: string
}