import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideChartNoAxesColumn,
  LucideClock3,
  LucideLayoutDashboard,
  LucideFlaskConical,
  LucideLogOut,
  LucideMapPinned,
  LucideQuote,
  LucideReceiptText,
  LucideSparkles,
  LucideUsers,
  LucideWalletCards,
} from '@lucide/angular';

type MenuItem = {
  label: string;
  path: string;
  icon: string;
};

@Component({
  selector: 'app-shell',
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    LucideChartNoAxesColumn,
    LucideClock3,
    LucideLayoutDashboard,
    LucideFlaskConical,
    LucideLogOut,
    LucideMapPinned,
    LucideQuote,
    LucideReceiptText,
    LucideSparkles,
    LucideUsers,
    LucideWalletCards,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {
  protected readonly menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/app/dashboard', icon: 'dashboard' },
    { label: 'Customers', path: '/app/customers', icon: 'customers' },
    { label: 'Products', path: '/app/products', icon: 'products' },
    { label: 'Quotations', path: '/app/quotations', icon: 'quotations' },
    { label: 'Invoices', path: '/app/invoices', icon: 'invoices' },
    { label: 'Payments', path: '/app/payments', icon: 'payments' },
    { label: 'Audit Log', path: '/app/audit-log', icon: 'audit-log' },
    { label: 'Statement', path: '/app/statements', icon: 'reports' },
    { label: 'Region', path: '/app/regions', icon: 'regions' },
    { label: 'Ask AI', path: '/app/ask-ai', icon: 'ask-ai' },
  ];
}
