import { Component, signal } from '@angular/core';

type StatementFormat = 'PDF' | 'Excel';

@Component({
  selector: 'app-statement-filter',
  standalone: true,
  templateUrl: './statement-filter.html',
  styleUrl: './statement-filter.css',
})
export class StatementFilter {
  protected readonly fromDate = signal('2024-10-01');
  protected readonly toDate = signal('2024-10-31');
  protected readonly format = signal<StatementFormat>('PDF');

  protected updateFromDate(event: Event): void {
    this.fromDate.set((event.target as HTMLInputElement).value);
  }

  protected updateToDate(event: Event): void {
    this.toDate.set((event.target as HTMLInputElement).value);
  }

  protected updateFormat(event: Event): void {
    this.format.set((event.target as HTMLSelectElement).value as StatementFormat);
  }

  protected viewStatement(): void {
    // Hook this to the statement export API when backend endpoints are available.
  }
}
