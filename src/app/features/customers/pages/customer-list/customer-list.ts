import { Component, computed, signal } from '@angular/core';

type CustomerStatus = 'Active' | 'Hold' | 'Inactive';

type CustomerRow = {
  code: string;
  name: string;
  city: string;
  district: string;
  phone: string;
  gstin: string;
  outstanding: number;
  status: CustomerStatus;
};

type CustomerDraft = {
  code: string;
  name: string;
  phone: string;
  email: string;
  gstin: string;
  city: string;
  district: string;
  address: string;
  contactPerson: string;
  creditLimit: number;
  paymentTerms: string;
  status: CustomerStatus;
};

@Component({
  selector: 'app-customer-list',
  standalone: true,
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList {
  protected readonly view = signal<'list' | 'create'>('list');
  protected readonly search = signal('');
  protected readonly statusFilter = signal('All');
  protected readonly cityFilter = signal('All');
  protected readonly customer = signal<CustomerDraft>({
    code: 'CUS-1025',
    name: '',
    phone: '',
    email: '',
    gstin: '',
    city: '',
    district: '',
    address: '',
    contactPerson: '',
    creditLimit: 0,
    paymentTerms: '30 Days',
    status: 'Active',
  });

  protected readonly customers: CustomerRow[] = [
    {
      code: 'CUS-1001',
      name: 'PMV Dyeing Mills',
      city: 'Tiruppur',
      district: 'Tiruppur',
      phone: '99436 90423',
      gstin: '33BSVPG7383L1ZY',
      outstanding: 11250,
      status: 'Active',
    },
    {
      code: 'CUS-1002',
      name: 'Lakshmi Agencies',
      city: 'Erode',
      district: 'Erode',
      phone: '98422 41008',
      gstin: '33AAECL7788F1Z6',
      outstanding: 2430000,
      status: 'Hold',
    },
    {
      code: 'CUS-1003',
      name: 'Cauvery Agencies',
      city: 'Thanjavur',
      district: 'Thanjavur',
      phone: '97903 11842',
      gstin: '33AALFC1122K1Z9',
      outstanding: 980000,
      status: 'Active',
    },
    {
      code: 'CUS-1004',
      name: 'Anbu Traders',
      city: 'Tiruppur',
      district: 'Tiruppur',
      phone: '94431 22014',
      gstin: '33ABCPA9912A1Z8',
      outstanding: 6100000,
      status: 'Inactive',
    },
  ];
  protected readonly cityOptions = ['All', ...new Set(this.customers.map((customer) => customer.city))];
  protected readonly statusOptions = ['All', 'Active', 'Hold', 'Inactive'];
  protected readonly filteredCustomers = computed(() => {
    const query = this.search().trim().toLowerCase();
    const status = this.statusFilter();
    const city = this.cityFilter();

    return this.customers.filter((customer) => {
      const matchesQuery =
        !query ||
        customer.code.toLowerCase().includes(query) ||
        customer.name.toLowerCase().includes(query) ||
        customer.city.toLowerCase().includes(query) ||
        customer.gstin.toLowerCase().includes(query);
      const matchesStatus = status === 'All' || customer.status === status;
      const matchesCity = city === 'All' || customer.city === city;

      return matchesQuery && matchesStatus && matchesCity;
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

  protected updateCityFilter(event: Event): void {
    this.cityFilter.set((event.target as HTMLSelectElement).value);
  }

  protected updateCustomer<K extends keyof CustomerDraft>(field: K, value: CustomerDraft[K]): void {
    this.customer.update((customer) => ({ ...customer, [field]: value }));
  }

  protected updateCreditLimit(value: string): void {
    this.updateCustomer('creditLimit', Number(value) || 0);
  }

  protected formatCurrency(value: number): string {
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: value % 1 ? 2 : 0,
    });
  }
}
