import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'settings',
        pathMatch: 'full'
    },
    {
        path: 'settings',
        loadComponent: () => import('@/pages/settings/settings')
            .then(m => m.Settings)
    }
];
