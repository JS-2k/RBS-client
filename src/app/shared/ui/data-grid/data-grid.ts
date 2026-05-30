import { Component, EventEmitter, Input, Output, computed, signal } from '@angular/core';

export type DataGridColumn = {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'currency' | 'number' | 'badge';
  align?: 'left' | 'right';
  width?: string;
  bold?: boolean;
  secondary?: Array<{
    key: string;
    prefix?: string;
    suffix?: string;
  }>;
  badgeColors?: Record<string, 'blue' | 'green' | 'amber' | 'red' | 'slate'>;
};

export type DataGridRow = Record<string, unknown>;

@Component({
  selector: 'app-data-grid',
  standalone: true,
  templateUrl: './data-grid.html',
  styleUrl: './data-grid.css',
})
export class DataGrid {
  @Input({ required: true }) columns: DataGridColumn[] = [];
  @Input({ required: true }) set rows(value: readonly unknown[]) {
    this.rowsSignal.set(value ?? []);
    this.currentPage.set(1);
  }

  @Input() emptyText = 'No records found.';

  @Output() rowSelected = new EventEmitter<unknown>();

  protected readonly pageSize = 5;
  protected readonly currentPage = signal(1);
  private readonly rowsSignal = signal<readonly unknown[]>([]);

  protected readonly totalRecords = computed(() => this.rowsSignal().length);
  protected readonly totalPages = computed(() => Math.max(Math.ceil(this.totalRecords() / this.pageSize), 1));
  protected readonly pagedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.rowsSignal().slice(start, start + this.pageSize);
  });
  protected readonly pageStart = computed(() =>
    this.totalRecords() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize + 1,
  );
  protected readonly pageEnd = computed(() => Math.min(this.currentPage() * this.pageSize, this.totalRecords()));
  protected readonly pageNumbers = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  protected gridTemplate(): string {
    return this.columns.map((column) => column.width ?? 'minmax(120px, 1fr)').join(' ');
  }

  protected previousPage(): void {
    this.currentPage.update((page) => Math.max(page - 1, 1));
  }

  protected nextPage(): void {
    this.currentPage.update((page) => Math.min(page + 1, this.totalPages()));
  }

  protected goToPage(page: number): void {
    this.currentPage.set(page);
  }

  protected value(row: unknown, key: string): unknown {
    return (row as DataGridRow)[key];
  }

  protected secondaryText(row: unknown, column: DataGridColumn): string {
    return (column.secondary ?? [])
      .map((item) => {
        const value = this.value(row, item.key);
        return value === undefined || value === null || value === ''
          ? ''
          : `${item.prefix ?? ''}${value}${item.suffix ?? ''}`;
      })
      .filter(Boolean)
      .join(' · ');
  }

  protected displayValue(row: unknown, column: DataGridColumn): string {
    const value = this.value(row, column.key);

    if (value === undefined || value === null || value === '') {
      return '-';
    }

    if (column.type === 'currency' && typeof value === 'number') {
      return value.toLocaleString('en-IN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: value % 1 ? 2 : 0,
      });
    }

    return String(value);
  }

  protected badgeClass(row: unknown, column: DataGridColumn): string {
    const value = this.displayValue(row, column);
    const color = column.badgeColors?.[value] ?? 'blue';
    return `badge badge-${color}`;
  }
}
