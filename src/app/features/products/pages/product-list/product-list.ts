import { Component, computed, signal } from '@angular/core';

import { DataGrid, DataGridColumn } from '../../../../shared/ui/data-grid/data-grid';

type ProductStatus = 'Active' | 'Low stock' | 'Inactive';

type ProductRow = {
  code: string;
  name: string;
  category: string;
  hsn: string;
  unit: string;
  stock: number;
  rate: number;
  status: ProductStatus;
};

type ProductDraft = {
  code: string;
  name: string;
  category: string;
  hsn: string;
  unit: string;
  rate: number;
  stock: number;
  reorderLevel: number;
  taxRate: number;
  supplier: string;
  description: string;
  status: ProductStatus;
};

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  protected readonly view = signal<'list' | 'create'>('list');
  protected readonly search = signal('');
  protected readonly categoryFilter = signal('All');
  protected readonly statusFilter = signal('All');
  protected readonly product = signal<ProductDraft>({
    code: 'PRD-1022',
    name: '',
    category: 'Chemical',
    hsn: '',
    unit: 'Bag',
    rate: 0,
    stock: 0,
    reorderLevel: 10,
    taxRate: 0,
    supplier: '',
    description: '',
    status: 'Active',
  });

  protected readonly products: ProductRow[] = [
    {
      code: 'PRD-1001',
      name: 'Salt CHSNSAC 25010000',
      category: 'Chemical',
      hsn: '25010000',
      unit: 'Bag',
      stock: 82,
      rate: 375,
      status: 'Active',
    },
    {
      code: 'PRD-1002',
      name: 'Soda Ash Light',
      category: 'Chemical',
      hsn: '28362020',
      unit: 'Bag',
      stock: 8,
      rate: 1480,
      status: 'Low stock',
    },
    {
      code: 'PRD-1003',
      name: 'Caustic Soda Flakes',
      category: 'Chemical',
      hsn: '28151110',
      unit: 'Kg',
      stock: 126,
      rate: 62,
      status: 'Active',
    },
    {
      code: 'PRD-1004',
      name: 'Bleaching Powder',
      category: 'Cleaning',
      hsn: '28289011',
      unit: 'Bag',
      stock: 0,
      rate: 920,
      status: 'Inactive',
    },
  ];

  protected readonly categoryOptions = ['All', ...new Set(this.products.map((product) => product.category))];
  protected readonly statusOptions = ['All', 'Active', 'Low stock', 'Inactive'];
  protected readonly productColumns: DataGridColumn[] = [
    { key: 'code', label: 'Code', width: '110px', bold: true },
    {
      key: 'name',
      label: 'Product',
      width: 'minmax(260px, 1fr)',
      bold: true,
      secondary: [
        { key: 'hsn', prefix: 'HSN ' },
        { key: 'unit' },
      ],
    },
    { key: 'category', label: 'Category', width: '140px' },
    { key: 'stock', label: 'Stock', type: 'number', width: '120px', secondary: [{ key: 'unit' }] },
    {
      key: 'status',
      label: 'Status',
      type: 'badge',
      width: '120px',
      badgeColors: { Active: 'green', 'Low stock': 'amber', Inactive: 'red' },
    },
    { key: 'rate', label: 'Rate', type: 'currency', align: 'right', width: '120px' },
  ];
  protected readonly filteredProducts = computed(() => {
    const query = this.search().trim().toLowerCase();
    const category = this.categoryFilter();
    const status = this.statusFilter();

    return this.products.filter((product) => {
      const matchesQuery =
        !query ||
        product.code.toLowerCase().includes(query) ||
        product.name.toLowerCase().includes(query) ||
        product.hsn.toLowerCase().includes(query);
      const matchesCategory = category === 'All' || product.category === category;
      const matchesStatus = status === 'All' || product.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
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

  protected updateCategoryFilter(event: Event): void {
    this.categoryFilter.set((event.target as HTMLSelectElement).value);
  }

  protected updateStatusFilter(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value);
  }

  protected updateProduct<K extends keyof ProductDraft>(field: K, value: ProductDraft[K]): void {
    this.product.update((product) => ({ ...product, [field]: value }));
  }

  protected updateNumber(
    field: 'rate' | 'stock' | 'reorderLevel' | 'taxRate',
    value: string,
  ): void {
    this.updateProduct(field, Number(value) || 0);
  }

  protected formatCurrency(value: number): string {
    return value.toLocaleString('en-IN', {
      maximumFractionDigits: 2,
      minimumFractionDigits: value % 1 ? 2 : 0,
    });
  }
}
