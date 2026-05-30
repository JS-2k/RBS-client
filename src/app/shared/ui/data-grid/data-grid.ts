import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input({ required: true }) rows: readonly unknown[] = [];
  @Input() emptyText = 'No records found.';

  @Output() rowSelected = new EventEmitter<unknown>();

  protected gridTemplate(): string {
    return this.columns.map((column) => column.width ?? 'minmax(120px, 1fr)').join(' ');
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
