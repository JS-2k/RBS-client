import { Component, computed, signal } from '@angular/core';

import { DataGrid, DataGridColumn } from '../../../../shared/ui/data-grid/data-grid';

type InvoiceItem = {
  description: string;
  quantity: number;
  rate: number;
  per: string;
};

type InvoiceDraft = {
  gstin: string;
  phone: string;
  companyName: string;
  address: string;
  billTo: string;
  invoiceNo: string;
  invoiceDate: string;
  orderNo: string;
  orderDate: string;
  wayBillNo: string;
  wayBillDate: string;
  truckNo: string;
  transport: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  branch: string;
  cgstRate: number;
  sgstRate: number;
  roundOff: number;
};

type InvoiceRow = {
  invoiceNo: string;
  date: string;
  customer: string;
  city: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
};

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './invoice-create.html',
  styleUrl: './invoice-create.css',
})
export class InvoiceCreate {
  protected readonly view = signal<'list' | 'create'>('list');
  protected readonly previewOpen = signal(false);
  protected readonly search = signal('');
  protected readonly statusFilter = signal('All');
  protected readonly cityFilter = signal('All');

  protected readonly invoice = signal<InvoiceDraft>({
    gstin: '33BSVPG7383L1ZY',
    phone: '99436 90423',
    companyName: 'RBS Chemical',
    address: 'No. 172, Thiruchendur Main Road, Sonaganvillai, Thoothukudi Dist - 628 201.',
    billTo: 'PMV Dyeing Mills, SF No. 225, Aggaragara, Periyapalayam, Tiruppur',
    invoiceNo: '1042',
    invoiceDate: '2024-10-14',
    orderNo: 'Telephonic',
    orderDate: '2024-10-14',
    wayBillNo: '',
    wayBillDate: '',
    truckNo: 'TN 42',
    transport: 'BK 163742',
    bankName: 'Tamilnad Mercantile Bank Ltd.',
    accountNo: '068150050800202',
    ifscCode: 'TMBL0000068',
    branch: 'Sonaganvillai',
    cgstRate: 0,
    sgstRate: 0,
    roundOff: 0,
  });

  protected readonly items = signal<InvoiceItem[]>([
    {
      description: 'Salt CHSNSAC 25010000',
      quantity: 30,
      rate: 375,
      per: 'Bag',
    },
  ]);

  protected readonly subTotal = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity * item.rate, 0),
  );

  protected readonly cgstAmount = computed(() => (this.subTotal() * this.invoice().cgstRate) / 100);
  protected readonly sgstAmount = computed(() => (this.subTotal() * this.invoice().sgstRate) / 100);
  protected readonly grandTotal = computed(
    () => this.subTotal() + this.cgstAmount() + this.sgstAmount() + this.invoice().roundOff,
  );
  protected readonly invoiceRows: InvoiceRow[] = [
    {
      invoiceNo: '1042',
      date: '2024-10-14',
      customer: 'PMV Dyeing Mills',
      city: 'Tiruppur',
      amount: 11250,
      status: 'Pending',
    },
    {
      invoiceNo: '1041',
      date: '2024-10-11',
      customer: 'Lakshmi Agencies',
      city: 'Erode',
      amount: 2430000,
      status: 'Overdue',
    },
    {
      invoiceNo: '1040',
      date: '2024-10-08',
      customer: 'Cauvery Agencies',
      city: 'Thanjavur',
      amount: 980000,
      status: 'Paid',
    },
    {
      invoiceNo: '1039',
      date: '2024-10-04',
      customer: 'Anbu Traders',
      city: 'Tiruppur',
      amount: 6100000,
      status: 'Pending',
    },
  ];
  protected readonly cityOptions = ['All', ...new Set(this.invoiceRows.map((invoice) => invoice.city))];
  protected readonly statusOptions = ['All', 'Paid', 'Pending', 'Overdue'];
  protected readonly invoiceColumns: DataGridColumn[] = [
    { key: 'invoiceNo', label: 'Invoice', width: '120px', bold: true, secondary: [{ key: 'date' }] },
    { key: 'customer', label: 'Customer', width: 'minmax(220px, 1fr)', bold: true },
    { key: 'city', label: 'City', width: '150px' },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      width: '130px',
      badgeColors: { Paid: 'green', Pending: 'blue', Overdue: 'red' },
    },
    { key: 'amount', label: 'Amount', type: 'currency', align: 'right', width: '140px' },
  ];
  protected readonly filteredInvoices = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const city = this.cityFilter();

    return this.invoiceRows.filter((invoice) => {
      const matchesQuery =
        !query ||
        invoice.invoiceNo.toLowerCase().includes(query) ||
        invoice.customer.toLowerCase().includes(query) ||
        invoice.city.toLowerCase().includes(query);
      const matchesStatus = status === 'All' || invoice.status === status;
      const matchesCity = city === 'All' || invoice.city === city;

      return matchesQuery && matchesStatus && matchesCity;
    });
  });

  protected updateInvoice<K extends keyof InvoiceDraft>(field: K, value: InvoiceDraft[K]): void {
    this.invoice.update((invoice) => ({ ...invoice, [field]: value }));
  }

  protected updateNumber(field: 'cgstRate' | 'sgstRate' | 'roundOff', value: string): void {
    this.updateInvoice(field, Number(value) || 0);
  }

  protected updateItem(index: number, field: keyof InvoiceItem, value: string): void {
    this.items.update((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: field === 'quantity' || field === 'rate' ? Number(value) || 0 : value,
            }
          : item,
      ),
    );
  }

  protected openCreate(): void {
    this.view.set('create');
  }

  protected backToList(): void {
    this.previewOpen.set(false);
    this.view.set('list');
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

  protected addItem(): void {
    this.items.update((items) => [
      ...items,
      {
        description: '',
        quantity: 1,
        rate: 0,
        per: 'Bag',
      },
    ]);
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

  protected amountInWords(value: number): string {
    const rounded = Math.round(value);
    const ones = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const belowHundred = (num: number) =>
      num < 20 ? ones[num] : `${tens[Math.floor(num / 10)]} ${ones[num % 10]}`.trim();

    const belowThousand = (num: number) => {
      const hundred = Math.floor(num / 100);
      const rest = num % 100;
      return `${hundred ? `${ones[hundred]} Hundred` : ''} ${rest ? belowHundred(rest) : ''}`.trim();
    };

    if (!rounded) {
      return 'Zero Rupees Only';
    }

    const crore = Math.floor(rounded / 10000000);
    const lakh = Math.floor((rounded % 10000000) / 100000);
    const thousand = Math.floor((rounded % 100000) / 1000);
    const rest = rounded % 1000;
    const parts = [
      crore ? `${belowThousand(crore)} Crore` : '',
      lakh ? `${belowThousand(lakh)} Lakh` : '',
      thousand ? `${belowThousand(thousand)} Thousand` : '',
      rest ? belowThousand(rest) : '',
    ].filter(Boolean);

    return `${parts.join(' ')} Rupees Only`;
  }

  protected openPreview(): void {
    this.previewOpen.set(true);
  }

  protected closePreview(): void {
    this.previewOpen.set(false);
  }

  protected printFromForm(): void {
    const wasPreviewOpen = this.previewOpen();

    if (!wasPreviewOpen) {
      this.previewOpen.set(true);
      window.setTimeout(() => {
        this.printInvoice();
        window.setTimeout(() => this.previewOpen.set(false), 300);
      });
      return;
    }

    this.printInvoice();
  }

  protected printInvoice(): void {
    const invoiceSheet = document.getElementById('invoice-print-area');

    if (!invoiceSheet) {
      return;
    }

    document.getElementById('invoice-print-copy')?.remove();
    const printCopy = invoiceSheet.cloneNode(true) as HTMLElement;
    printCopy.id = 'invoice-print-copy';
    document.body.appendChild(printCopy);
    document.body.classList.add('invoice-printing');
    window.print();
    window.setTimeout(() => {
      document.body.classList.remove('invoice-printing');
      printCopy.remove();
    }, 250);
  }
}
