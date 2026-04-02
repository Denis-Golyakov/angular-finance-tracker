import { withDevtools } from '@angular-architects/ngrx-toolkit';
import { computed, effect, inject, untracked } from '@angular/core';
import {
    patchState,
    signalStore,
    withComputed,
    withHooks,
    withMethods,
    withState
} from '@ngrx/signals';
import { endOfDay, endOfMonth, getUnixTime, isWithinInterval, parse, startOfMonth } from 'date-fns';

import { BudgetItem } from '@/models/budget.model';

import { StorageService } from '@/services/storage.service';
import { TransactionStore } from './transaction.store';

const STORAGE_BUDGET_KEY = 'budget';

export const BudgetStore = signalStore(
    { providedIn: 'root' },

    withDevtools('budget'),

    withState({
        items: [] as BudgetItem[],
        isLoading: false
    }),

    withMethods(() => ({
        getItemDateRange(item: BudgetItem): { start: Date, end: Date } {
            const startDate = parse(item.daterange_start, 'yyyy-MM-dd', new Date());
            const endDate = endOfDay(parse(item.daterange_end, 'yyyy-MM-dd', new Date()));
            return { start: startDate, end: endDate }
        }
    })),

    withComputed((store) => {
        const transactionStore = inject(TransactionStore);

        return {
            budgetTotals: computed(() => {
                return store.items()
                    .reduce((acc, budgetItem) => {
                        const dateRange = store.getItemDateRange(budgetItem);
                        const dateRangeStart = getUnixTime(dateRange.start);
                        const dateRangeEnd = getUnixTime(dateRange.end);

                        acc[budgetItem.id] = transactionStore.getTotalAmountPerCategoryWithinDateRange
                            (budgetItem.categoryId, dateRangeStart, dateRangeEnd);
                        return acc;
                    }, {} as Record<string, number>);
            })
        }
    }),

    withComputed((store) => {
        const transactionStore = inject(TransactionStore);

        return {
            currentMonthBudget: computed(() => {
                const today = new Date();
                const currentMonthStart = getUnixTime(startOfMonth(today));
                const currentMonthEnd = getUnixTime(endOfMonth(today));
                let monthBudget = {
                    total: 0,
                    transactions: 0,
                    available: 0
                };
                store.items().forEach((budgetItem) => {
                    const dateRange = store.getItemDateRange(budgetItem);

                    if (isWithinInterval(today, { start: dateRange.start, end: dateRange.end })) {
                        monthBudget.total += budgetItem.amount
                        monthBudget.transactions += transactionStore.getTotalAmountPerCategoryWithinDateRange
                            (budgetItem.categoryId, currentMonthStart, currentMonthEnd);
                    }
                });
                monthBudget.available = monthBudget.total > monthBudget.transactions
                    ? monthBudget.total - monthBudget.transactions : 0;

                return monthBudget;
            })
        }
    }),

    withMethods((store) => ({ // Common methods
        setLoading(status: boolean): void {
            patchState(store, { isLoading: status })
        },
        findById(id: string): BudgetItem | undefined {
            return store.items().find((item) => item.id === id)
        }
    })),

    withMethods((store) => ({
        add(budgetItemData: Omit<BudgetItem, 'id'>): void {
            const budgetItem: BudgetItem = {
                id: crypto.randomUUID(),
                ...budgetItemData
            }
            patchState(store, { items: [...store.items(), budgetItem] })
        },
        remove(id: string): boolean {
            const item = store.findById(id)
            if (typeof item === 'undefined') {
                return false;
            }

            patchState(store, { items: store.items().filter((item) => item.id !== id) })
            return true
        },
        update(id: string, changes: Partial<Omit<BudgetItem, 'id'>>): boolean {
            const item = store.findById(id)
            if (typeof item === 'undefined') {
                return false;
            }

            patchState(store, {
                items: store.items().map((budgetItem) => budgetItem.id === id ? { ...budgetItem, ...changes } : budgetItem)
            })
            return true
        }
    })),

    withHooks((store) => {
        const storage = inject(StorageService);

        return {
            onInit() {
                const savedBudgetItems = storage.getItem<BudgetItem[]>(STORAGE_BUDGET_KEY);
                if (savedBudgetItems) {
                    patchState(store, { items: savedBudgetItems })
                }

                effect(() => {
                    const items = store.items()

                    untracked(() => {
                        store.setLoading(true);
                        storage.setItem(STORAGE_BUDGET_KEY, items);
                        store.setLoading(false);
                    })
                });
            }
        }
    })
)