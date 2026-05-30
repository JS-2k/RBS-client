import { Component, computed, signal } from '@angular/core';

import { DataGrid, DataGridColumn } from '../../../../shared/ui/data-grid/data-grid';

type QuotationStatus = 'Draft' | 'Sent' | 'Approved' | 'Rejected';

type QuotationRow = {
  quoteNo: string;
  date: string;
  validUntil: string;
  customer: string;
  city: string;
  amount: number;
  status: QuotationStatus;
};

type QuotationItem = {
  description: string;
  quantity: number;
  rate: number;
  per: string;
};

type QuotationDraft = {
  quoteNo: string;
  quoteDate: string;
  validUntil: string;
  customerName: string;
  customerAddress: string;
  phone: string;
  gstin: string;
  paymentTerms: string;
  deliveryTerms: string;
  notes: string;
  cgstRate: number;
  sgstRate: number;
};

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './quotation-list.html',
  styleUrl: './quotation-list.css',
})
export class QuotationList {
  protected readonly view = signal<'list' | 'create'>('list');
  protected readonly previewOpen = signal(false);
  protected readonly search = signal('');
  protected readonly statusFilter = signal('All');
  protected readonly cityFilter = signal('All');

  protected readonly quotation = signal<QuotationDraft>({
    quoteNo: 'QTN-1027',
    quoteDate: '2024-10-16',
    validUntil: '2024-10-31',
    customerName: 'PMV Dyeing Mills',
    customerAddress: 'SF No. 225, Aggaragara, Periyapalayam, Tiruppur',
    phone: '99436 90423',
    gstin: '33BSVPG7383L1ZY',
    paymentTerms: '30 Days',
    deliveryTerms: 'Ex-stock subject to availability',
    notes: 'Rates are subject to market changes and applicable taxes.',
    cgstRate: 0,
    sgstRate: 0,
  });

  protected readonly items = signal<QuotationItem[]>([
    { description: 'Salt CHSNSAC 25010000', quantity: 30, rate: 375, per: 'Bag' },
  ]);

  protected readonly quotationRows: QuotationRow[] = [
    {
      quoteNo: 'QTN-1026',
      date: '2024-10-14',
      validUntil: '2024-10-30',
      customer: 'PMV Dyeing Mills',
      city: 'Tiruppur',
      amount: 11250,
      status: 'Sent',
    },
    {
      quoteNo: 'QTN-1025',
      date: '2024-10-11',
      validUntil: '2024-10-25',
      customer: 'Lakshmi Agencies',
      city: 'Erode',
      amount: 2430000,
      status: 'Approved',
    },
    {
      quoteNo: 'QTN-1024',
      date: '2024-10-09',
      validUntil: '2024-10-23',
      customer: 'Cauvery Agencies',
      city: 'Thanjavur',
      amount: 980000,
      status: 'Draft',
    },
    {
      quoteNo: 'QTN-1023',
      date: '2024-10-05',
      validUntil: '2024-10-20',
      customer: 'Anbu Traders',
      city: 'Tiruppur',
      amount: 6100000,
      status: 'Rejected',
    },
  ];

  protected readonly cityOptions = ['All', ...new Set(this.quotationRows.map((quote) => quote.city))];
  protected readonly statusOptions = ['All', 'Draft', 'Sent', 'Approved', 'Rejected'];
  protected readonly quotationColumns: DataGridColumn[] = [
    { key: 'quoteNo', label: 'Quotation', width: '120px', bold: true, secondary: [{ key: 'date' }] },
    { key: 'customer', label: 'Customer', width: 'minmax(220px, 1fr)', bold: true },
    { key: 'city', label: 'City', width: '130px' },
    { key: 'validUntil', label: 'Valid until', width: '130px' },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      width: '110px',
      badgeColors: { Draft: 'slate', Sent: 'blue', Approved: 'green', Rejected: 'red' },
    },
    { key: 'amount', label: 'Amount', type: 'currency', align: 'right', width: '140px' },
  ];
  protected readonly subTotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity * item.rate, 0),
  );
  protected readonly cgstAmount = computed(() => (this.subTotal() * this.quotation().cgstRate) / 100);
  protected readonly sgstAmount = computed(() => (this.subTotal() * this.quotation().sgstRate) / 100);
  protected readonly grandTotal = computed(() => this.subTotal() + this.cgstAmount() + this.sgstAmount());
  protected readonly filteredQuotations = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const city = this.cityFilter();

    return this.quotationRows.filter((quote) => {
      const matchesQuery =
        !query ||
        quote.quoteNo.toLowerCase().includes(query) ||
        quote.customer.toLowerCase().includes(query) ||
        quote.city.toLowerCase().includes(query);
      const matchesStatus = status === 'All' || quote.status === status;
      const matchesCity = city === 'All' || quote.city === city;

      return matchesQuery && matchesStatus && matchesCity;
    });
  });

  protected openCreate(): void {
    this.view.set('create');
  }

  protected backToList(): void {
    this.previewOpen.set(false);
    this.view.set('list');
  }

  protected openPreview(): void {
    this.previewOpen.set(true);
  }

  protected closePreview(): void {
    this.previewOpen.set(false);
  }

  protected updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected updateStatusFilter(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value);
  }

  protected updateCityFilter(event: Event): void {
    this.cityFilter.set((event.target as HTMLSelectElement).value);
  }

  protected updateQuotation<K extends keyof QuotationDraft>(field: K, value: QuotationDraft[K]): void {
    this.quotation.update((quotation) => ({ ...quotation, [field]: value }));
  }

  protected updateNumber(field: 'cgstRate' | 'sgstRate', value: string): void {
    this.updateQuotation(field, Number(value) || 0);
  }

  protected updateItem(index: number, field: keyof QuotationItem, value: string): void {
    this.items.update((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index
          ? { ...item, [field]: field === 'quantity' || field === 'rate' ? Number(value) || 0 : value }
          : item,
      ),
    );
  }

  protected addItem(): void {
    this.items.update((items) => [...items, { description: '', quantity: 1, rate: 0, per: 'Bag' }]);
  }

  protected removeItem(index: number): void {
    this.items.update((items) => items.filter((_, itemIndex) => itemIndex !== index));
  }

  protected formatCurrency(value: number): string {
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: value % 1 ? 2 : 0,
    });
  }
}
