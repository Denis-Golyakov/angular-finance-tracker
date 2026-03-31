import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'budget',
        pathMatch: 'full'
    },
    {
        path: 'transactions',
        loadComponent: () => import('@/pages/transactions/transactions')
            .then(m => m.Transactions)
    },
    {
        path: 'budget',
        loadComponent: () => import('@/pages/budget/budget')
            .then(m => m.Budget)
    },
    {
        path: 'settings',
        loadComponent: () => import('@/pages/settings/settings')
            .then(m => m.Settings)
    }
];
