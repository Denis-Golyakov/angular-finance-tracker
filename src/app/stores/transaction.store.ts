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

import { format, fromUnixTime } from 'date-fns';

import { Transaction, TransactionView } from '@/models/transaction.model';
import { CategoryStore } from './category.store';

import { StorageService } from '@/services/storage.service';

const STORAGE_TRANSACTION_KEY = 'transactions';

interface MonthlyBreakdownItem {
    id: string,
    month: string,
    value: number
}

export const TransactionStore = signalStore(
    { providedIn: 'root' },

    withDevtools('transactions'),

    withState({
        items: [] as Transaction[],
        isLoading: false
    }),

    withMethods(() => ({
        getMonthlyBreakdown(items: Transaction[]): MonthlyBreakdownItem[] {
            let monthlyBreakdown = {} as Record<string, MonthlyBreakdownItem>;
            let months = [] as string[];
            let result = [] as MonthlyBreakdownItem[];

            items.forEach((item) => {
                const date = fromUnixTime(parseInt(item.date));
                const monthId = format(date, 'yyyyMM');
                const month = format(date, 'MMMM, yyyy');
                if (Object.hasOwn(monthlyBreakdown, monthId)) {
                    monthlyBreakdown[monthId].value += item.amount
                } else {
                    months.push(monthId);
                    monthlyBreakdown[monthId] = { id: monthId, month: month, value: item.amount }
                }
            });

            months.sort((a, b) => {
                return parseInt(b) - parseInt(a);
            });

            months.forEach((monthId) => {
                result.push(monthlyBreakdown[monthId]);
            });

            return result;
        }
    })),

    withComputed((store) => ({
        totalCount: computed(() => store.items().length),
        totalIncome: computed(() => {
            return store.items()
                .filter((item) => item.type === 'income')
                .reduce((acc, item) => acc + item.amount, 0);
        }),
        totalExpenses: computed(() => {
            return store.items()
                .filter((item) => item.type === 'expense')
                .reduce((acc, item) => acc + item.amount, 0);
        }),
        monthlyIncome: computed(() =>
            store.getMonthlyBreakdown(store.items().filter((item) => item.type === 'income'))
        ),
        monthlyExpenses: computed(() =>
            store.getMonthlyBreakdown(store.items().filter((item) => item.type === 'expense'))
        )
    })),

    withComputed((store) => ({
        currentBalance: computed(() => store.totalIncome() - store.totalExpenses())
    })),

    withMethods((store) => ({ // Common methods
        setLoading(status: boolean): void {
            patchState(store, { isLoading: status })
        },
        findById(id: string): Transaction | undefined {
            return store.items().find((item) => item.id === id)
        }
    })),

    withMethods((store) => ({
        add(transactionData: Omit<Transaction, 'id'>): void {
            const transaction: Transaction = {
                id: crypto.randomUUID(),
                ...transactionData
            }
            patchState(store, { items: [...store.items(), transaction] })
        },
        remove(id: string): boolean {
            const item = store.findById(id)
            if (typeof item === 'undefined') {
                return false;
            }

            patchState(store, { items: store.items().filter((item) => item.id !== id) })
            return true
        },
        update(id: string, changes: Partial<Omit<Transaction, 'id'>>): boolean {
            const item = store.findById(id)
            if (typeof item === 'undefined') {
                return false;
            }

            patchState(store, {
                items: store.items().map((transaction) => transaction.id === id ? { ...transaction, ...changes } : transaction)
            })
            return true
        }
    })),

    withMethods((store) => ({
        getTotalAmountPerCategoryWithinDateRange(categoryId: string, startDate: number, endDate: number): number {
            const items = store.items()
                .filter((item) => item.categoryId === categoryId)
                .filter((item) => parseInt(item.date) >= startDate && parseInt(item.date) <= endDate);

            let total = 0;

            items.forEach((item) => {
                if (item.type === 'expense') {
                    total += item.amount;
                } else {
                    total -= item.amount;
                }
            });

            return total;
        }
    })),

    withMethods((store) => {
        const categoryStore = inject(CategoryStore);

        return {
            getFormattedItems(
                direction: 'asc' | 'desc' = 'asc',
                filterByType: 'all' | string = 'all',
                filterByDescription: string = '',
                limit: null | number = null
            ): TransactionView[] {
                let items = [...store.items()]
                    .filter((item) =>
                        filterByType === 'all' || item.type === filterByType
                    )
                    .filter((item) =>
                        filterByDescription === '' || item.description.toLowerCase().includes(filterByDescription.toLowerCase())
                    )
                    .sort((a, b) => {
                        if (direction === 'asc') {
                            return Number(a.date) - Number(b.date);
                        } else {
                            return Number(b.date) - Number(a.date);
                        }
                    })
                    .map((item) => ({
                        ...item,
                        category: categoryStore.findById(item.categoryId),
                        date: format(fromUnixTime(Number(item.date)), 'dd MMM yyyy')
                    }));

                if (limit) {
                    items = items.slice(0, limit);
                }

                return items;
            }
        }
    }),

    withHooks((store) => {
        const storage = inject(StorageService);

        return {
            onInit() {
                const savedTransactions = storage.getItem<Transaction[]>(STORAGE_TRANSACTION_KEY);
                if (savedTransactions) {
                    patchState(store, { items: savedTransactions })
                }

                effect(() => {
                    const items = store.items()

                    untracked(() => {
                        store.setLoading(true);
                        storage.setItem(STORAGE_TRANSACTION_KEY, items);
                        store.setLoading(false);
                    })
                });
            }
        }
    })
)