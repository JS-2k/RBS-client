import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    title: 'RBS | Login',
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
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        title: 'RBS | Dashboard',
        loadComponent: () =>
          import('./features/dashboard/pages/dashboard-home/dashboard-home').then(
            (component) => component.DashboardHome,
          ),
      },
      {
        path: 'customers',
        title: 'RBS | Customers',
        loadComponent: () =>
          import('./features/customers/pages/customer-list/customer-list').then(
            (component) => component.CustomerList,
          ),
      },
      {
        path: 'regions',
        title: 'RBS | Region',
        loadComponent: () =>
          import('./features/customers/pages/customer-outstanding/customer-outstanding').then(
            (component) => component.CustomerOutstanding,
          ),
      },
      {
        path: 'invoices',
        title: 'RBS | Invoices',
        loadComponent: () =>
          import('./features/invoices/pages/invoice-create/invoice-create').then(
            (component) => component.InvoiceCreate,
          ),
      },
      {
        path: 'quotations',
        title: 'RBS | Quotations',
        loadComponent: () =>
          import('./features/quotations/pages/quotation-list/quotation-list').then(
            (component) => component.QuotationList,
          ),
      },
      {
        path: 'products',
        title: 'RBS | Products',
        loadComponent: () =>
          import('./features/products/pages/product-list/product-list').then(
            (component) => component.ProductList,
          ),
      },
      {
        path: 'payments',
        title: 'RBS | Payments',
        loadComponent: () =>
          import('./features/payments/pages/payment-list/payment-list').then(
            (component) => component.PaymentList,
          ),
      },
      {
        path: 'audit-log',
        title: 'RBS | Audit Log',
        loadComponent: () =>
          import('./features/audit-log/pages/audit-log-list/audit-log-list').then(
            (component) => component.AuditLogList,
          ),
      },
      {
        path: 'statements',
        title: 'RBS | Statement',
        loadComponent: () =>
          import('./features/statements/pages/statement-filter/statement-filter').then(
            (component) => component.StatementFilter,
          ),
      },
      {
        path: 'reports',
        redirectTo: 'statements',
        pathMatch: 'full',
      },
      {
        path: 'ask-ai',
        title: 'RBS | Ask AI',
        loadComponent: () =>
          import('./features/ask-ai/pages/ask-ai/ask-ai').then((component) => component.AskAi),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
