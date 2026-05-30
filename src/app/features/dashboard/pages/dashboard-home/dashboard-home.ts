import { Component } from '@angular/core';

type Metric = {
  label: string;
  value: string;
  note: string;
};

type Activity = {
  label: string;
  value: string;
  status: string;
};

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  templateUrl: './dashboard-home.html',
  styleUrl: './dashboard-home.css',
})
export class DashboardHome {
  protected readonly metrics: Metric[] = [
    { label: 'Today sales', value: '1,24,500', note: '8 invoices' },
    { label: 'Collections', value: '86,000', note: '5 receipts' },
    { label: 'Outstanding', value: '68.5L', note: '18 customers' },
    { label: 'Low stock', value: '3', note: 'products need reorder' },
  ];

  protected readonly activities: Activity[] = [
    { label: 'PMV Dyeing Mills', value: 'Invoice 1042 · 11,250', status: 'Pending' },
    { label: 'Lakshmi Agencies', value: 'Payment received · 10,00,000', status: 'Partial' },
    { label: 'Soda Ash Light', value: 'Current stock · 8 Bag', status: 'Low stock' },
    { label: 'Cauvery Agencies', value: 'Quotation QTN-1024', status: 'Draft' },
  ];
}
