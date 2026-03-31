import { computed, effect, inject, untracked } from '@angular/core';
import {
    patchState,
    signalStore,
    withComputed,
    withHooks,
    withMethods,
    withState
} from '@ngrx/signals';
import { Transaction } from '@/models/transaction.model';
import { StorageService } from '@/services/storage.service';
import { withDevtools } from '@angular-architects/ngrx-toolkit';

const STORAGE_TRANSACTION_KEY = 'transactions';

export const TransactionStore = signalStore(
    { providedIn: 'root' },

    withDevtools('transactions'),

    withState({
        items: [] as Transaction[],
        isLoading: false
    }),

    withComputed((store) => ({
        totalCount: computed(() => store.items().length)
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