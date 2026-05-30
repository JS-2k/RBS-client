import { Component, computed, signal } from '@angular/core';

import { DataGrid, DataGridColumn } from '../../../../shared/ui/data-grid/data-grid';

type PaymentStatus = 'Paid' | 'Partial' | 'Pending';
type PaymentMode = 'Cash' | 'Bank' | 'UPI' | 'Cheque';

type PaymentRow = {
  receiptNo: string;
  date: string;
  customer: string;
  invoiceNo: string;
  invoiceAmount: number;
  receivedAmount: number;
  mode: PaymentMode;
  status: PaymentStatus;
};

type PaymentDraft = {
  receiptNo: string;
  date: string;
  customer: string;
  invoiceNo: string;
  invoiceAmount: number;
  receivedAmount: number;
  mode: PaymentMode;
  referenceNo: string;
  remarks: string;
};

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './payment-list.html',
  styleUrl: './payment-list.css',
})
export class PaymentList {
  protected readonly view = signal<'list' | 'create'>('list');
  protected readonly search = signal('');
  protected readonly statusFilter = signal('All');
  protected readonly modeFilter = signal('All');
  protected readonly payment = signal<PaymentDraft>({
    receiptNo: 'RCT-1021',
    date: '2024-10-16',
    customer: 'PMV Dyeing Mills',
    invoiceNo: '1042',
    invoiceAmount: 11250,
    receivedAmount: 0,
    mode: 'Bank',
    referenceNo: '',
    remarks: '',
  });

  protected readonly payments: PaymentRow[] = [
    {
      receiptNo: 'RCT-1020',
      date: '2024-10-14',
      customer: 'PMV Dyeing Mills',
      invoiceNo: '1042',
      invoiceAmount: 11250,
      receivedAmount: 11250,
      mode: 'Bank',
      status: 'Paid',
    },
    {
      receiptNo: 'RCT-1019',
      date: '2024-10-12',
      customer: 'Lakshmi Agencies',
      invoiceNo: '1041',
      invoiceAmount: 2430000,
      receivedAmount: 1000000,
      mode: 'Cheque',
      status: 'Partial',
    },
    {
      receiptNo: 'RCT-1018',
      date: '2024-10-09',
      customer: 'Cauvery Agencies',
      invoiceNo: '1040',
      invoiceAmount: 980000,
      receivedAmount: 0,
      mode: 'UPI',
      status: 'Pending',
    },
    {
      receiptNo: 'RCT-1017',
      date: '2024-10-05',
      customer: 'Anbu Traders',
      invoiceNo: '1039',
      invoiceAmount: 6100000,
      receivedAmount: 3500000,
      mode: 'Cash',
      status: 'Partial',
    },
  ];

  protected readonly statusOptions = ['All', 'Paid', 'Partial', 'Pending'];
  protected readonly modeOptions = ['All', 'Cash', 'Bank', 'UPI', 'Cheque'];
  protected readonly paymentColumns: DataGridColumn[] = [
    { key: 'receiptNo', label: 'Receipt', width: '120px', bold: true, secondary: [{ key: 'date' }] },
    { key: 'customer', label: 'Customer', width: 'minmax(220px, 1fr)', bold: true },
    { key: 'invoiceNo', label: 'Invoice', width: '110px' },
    { key: 'mode', label: 'Mode', width: '100px' },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      width: '110px',
      badgeColors: { Paid: 'green', Partial: 'amber', Pending: 'red' },
    },
    {
      key: 'receivedAmount',
      label: 'Received',
      type: 'currency',
      align: 'right',
      width: '130px',
    },
    {
      key: 'balance',
      label: 'Balance',
      type: 'currency',
      align: 'right',
      width: '130px',
    },
  ];
  protected readonly paymentRows = computed(() =>
    this.filteredPayments().map((payment) => ({
      ...payment,
      balance: payment.invoiceAmount - payment.receivedAmount,
    })),
  );
  protected readonly balanceAmount = computed(() =>
    Math.max(this.payment().invoiceAmount - this.payment().receivedAmount, 0),
  );
  protected readonly filteredPayments = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const mode = this.modeFilter();

    return this.payments.filter((payment) => {
      const matchesQuery =
        !query ||
        payment.receiptNo.toLowerCase().includes(query) ||
        payment.invoiceNo.toLowerCase().includes(query) ||
        payment.customer.toLowerCase().includes(query);
      const matchesStatus = status === 'All' || payment.status === status;
      const matchesMode = mode === 'All' || payment.mode === mode;

      return matchesQuery && matchesStatus && matchesMode;
    });
  });

  protected openCreate(): void {
    this.view.set('create');
  }

  protected backToList(): void {
    this.view.set('list');
  }

  protected updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected updateStatusFilter(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value);
  }

  protected updateModeFilter(event: Event): void {
    this.modeFilter.set((event.target as HTMLSelectElement).value);
  }

  protected updatePayment<K extends keyof PaymentDraft>(field: K, value: PaymentDraft[K]): void {
    this.payment.update((payment) => ({ ...payment, [field]: value }));
  }

  protected updateNumber(field: 'invoiceAmount' | 'receivedAmount', value: string): void {
    this.updatePayment(field, Number(value) || 0);
  }

  protected formatCurrency(value: number): string {
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: value % 1 ? 2 : 0,
    });
  }
}
