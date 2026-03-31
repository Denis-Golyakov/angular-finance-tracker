export interface BudgetItem {
    readonly id: string
    categoryId: string
    name: string
    daterange_start: string
    daterange_end: string
    amount: number
}