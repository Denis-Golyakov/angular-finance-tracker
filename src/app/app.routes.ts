import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'transactions',
        pathMatch: 'full'
    },
    {
        path: 'transactions',
        loadComponent: () => import('@/pages/transactions/transactions')
            .then(m => m.Transactions)
    },
    {
        path: 'settings',
        loadComponent: () => import('@/pages/settings/settings')
            .then(m => m.Settings)
    }
];
