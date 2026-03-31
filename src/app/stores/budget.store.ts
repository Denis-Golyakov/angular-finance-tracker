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
import { getUnixTime, parse } from 'date-fns';

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

    withComputed((store) => {
        const transactionStore = inject(TransactionStore);

        return {
            budgetTotals: computed(() => {
                return store.items()
                    .reduce((acc, budgetItem) => {
                        const dateRangeStart = getUnixTime(parse(budgetItem.daterange_start, 'yyyy-MM-dd', new Date()));
                        const dateRangeEnd = getUnixTime(parse(budgetItem.daterange_end, 'yyyy-MM-dd', new Date()));
                        const total = transactionStore.getTotalAmountPerCategoryWithinDateRange
                            (budgetItem.categoryId, dateRangeStart, dateRangeEnd);
                        acc[budgetItem.id] = total;
                        return acc;
                    }, {} as Record<string, number>);
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