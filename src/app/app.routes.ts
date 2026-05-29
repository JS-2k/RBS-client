import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login').then((component) => component.Login),
  },
  {
    path: 'app',
    loadComponent: () =>
      import('./layouts/app-shell/app-shell').then((component) => component.AppShell),
    children: [
      {
        path: '',
        redirectTo: 'customers',
        pathMatch: 'full',
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/workspace/pages/menu-page/menu-page').then(
            (component) => component.MenuPage,
          ),
        data: {
          title: 'Customers',
          description: 'Manage customer profiles, contact details, and account status.',
          showStats: false,
        },
      },
      {
        path: 'regions',
        loadComponent: () =>
          import('./features/customers/pages/customer-outstanding/customer-outstanding').then(
            (component) => component.CustomerOutstanding,
          ),
      },
      {
        path: 'invoices',
        loadComponent: () =>
          import('./features/invoices/pages/invoice-create/invoice-create').then(
            (component) => component.InvoiceCreate,
          ),
      },
      {
        path: 'quotations',
        loadComponent: () =>
          import('./features/workspace/pages/menu-page/menu-page').then(
            (component) => component.MenuPage,
          ),
        data: {
          title: 'Quotations',
          description: 'Prepare quotes and follow up on pending approvals.',
        },
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/workspace/pages/menu-page/menu-page').then(
            (component) => component.MenuPage,
          ),
        data: {
          title: 'Products',
          description: 'Keep product and chemical catalog information organized.',
        },
      },
      {
        path: 'payments',
        loadComponent: () =>
          import('./features/workspace/pages/menu-page/menu-page').then(
            (component) => component.MenuPage,
          ),
        data: {
          title: 'Payments',
          description: 'Review collections, outstanding balances, and receipts.',
        },
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/workspace/pages/menu-page/menu-page').then(
            (component) => component.MenuPage,
          ),
        data: {
          title: 'Reports',
          description: 'View compact summaries for daily business decisions.',
        },
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
