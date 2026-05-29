import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  LucideChartNoAxesColumn,
  LucideFlaskConical,
  LucideLogOut,
  LucideMapPinned,
  LucideQuote,
  LucideReceiptText,
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
    LucideFlaskConical,
    LucideLogOut,
    LucideMapPinned,
    LucideQuote,
    LucideReceiptText,
    LucideUsers,
    LucideWalletCards,
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
})
export class AppShell {
  protected readonly menuItems: MenuItem[] = [
    { label: 'Customers', path: '/app/customers', icon: 'customers' },
    { label: 'Region', path: '/app/regions', icon: 'regions' },
    { label: 'Invoices', path: '/app/invoices', icon: 'invoices' },
    { label: 'Quotations', path: '/app/quotations', icon: 'quotations' },
    { label: 'Products', path: '/app/products', icon: 'products' },
    { label: 'Payments', path: '/app/payments', icon: 'payments' },
    { label: 'Reports', path: '/app/reports', icon: 'reports' },
  ];
}
