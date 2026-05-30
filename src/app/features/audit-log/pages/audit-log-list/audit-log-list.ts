import { Component, computed, signal } from '@angular/core';

import { DataGrid, DataGridColumn } from '../../../../shared/ui/data-grid/data-grid';

type AuditAction = 'Created' | 'Updated' | 'Paid';
type AuditModule = 'Invoice' | 'Payment' | 'Customer' | 'Product';

type AuditEntry = {
  time: string;
  user: string;
  module: AuditModule;
  action: AuditAction;
  reference: string;
  activity: string;
};

@Component({
  selector: 'app-audit-log-list',
  standalone: true,
  imports: [DataGrid],
  templateUrl: './audit-log-list.html',
  styleUrl: './audit-log-list.css',
})
export class AuditLogList {
  protected readonly search = signal('');
  protected readonly userFilter = signal('All');
  protected readonly moduleFilter = signal('All');
  protected readonly actionFilter = signal('All');

  protected readonly auditEntries: AuditEntry[] = [
    {
      time: '10:15 AM',
      user: 'User A',
      module: 'Invoice',
      action: 'Created',
      reference: 'INV-101',
      activity: 'User A created Invoice INV-101',
    },
    {
      time: '10:30 AM',
      user: 'User B',
      module: 'Invoice',
      action: 'Updated',
      reference: 'INV-101',
      activity: 'User B changed amount from Rs.50,000 to Rs.75,000',
    },
    {
      time: '11:00 AM',
      user: 'User C',
      module: 'Invoice',
      action: 'Paid',
      reference: 'INV-101',
      activity: 'User C marked Invoice INV-101 paid',
    },
    {
      time: '11:20 AM',
      user: 'Admin',
      module: 'Customer',
      action: 'Updated',
      reference: 'CUS-014',
      activity: 'Admin updated Lakshmi Agencies phone number',
    },
    {
      time: '12:05 PM',
      user: 'Store User',
      module: 'Product',
      action: 'Updated',
      reference: 'PRD-008',
      activity: 'Store User changed Salt stock from 60 Bag to 82 Bag',
    },
    {
      time: '12:40 PM',
      user: 'User B',
      module: 'Payment',
      action: 'Created',
      reference: 'RCT-1020',
      activity: 'User B recorded payment RCT-1020 for Invoice INV-101',
    },
  ];

  protected readonly userOptions = ['All', ...new Set(this.auditEntries.map((entry) => entry.user))];
  protected readonly moduleOptions = ['All', 'Invoice', 'Payment', 'Customer', 'Product'];
  protected readonly actionOptions = ['All', 'Created', 'Updated', 'Paid'];
  protected readonly auditColumns: DataGridColumn[] = [
    { key: 'time', label: 'Time', width: '110px', bold: true },
    { key: 'user', label: 'User', width: '130px' },
    {
      key: 'module',
      label: 'Module',
      type: 'badge',
      width: '120px',
      badgeColors: { Invoice: 'blue', Payment: 'green', Customer: 'slate', Product: 'amber' },
    },
    {
      key: 'action',
      label: 'Action',
      type: 'badge',
      width: '120px',
      badgeColors: { Created: 'green', Updated: 'amber', Paid: 'blue' },
    },
    { key: 'activity', label: 'Activity', width: 'minmax(320px, 1fr)', bold: true, secondary: [{ key: 'reference' }] },
  ];

  protected readonly filteredEntries = computed(() => {
    const query = this.search().trim().toLowerCase();
    const user = this.userFilter();
    const module = this.moduleFilter();
    const action = this.actionFilter();

    return this.auditEntries.filter((entry) => {
      const matchesQuery =
        !query ||
        entry.time.toLowerCase().includes(query) ||
        entry.user.toLowerCase().includes(query) ||
        entry.reference.toLowerCase().includes(query) ||
        entry.activity.toLowerCase().includes(query);
      const matchesUser = user === 'All' || entry.user === user;
      const matchesModule = module === 'All' || entry.module === module;
      const matchesAction = action === 'All' || entry.action === action;

      return matchesQuery && matchesUser && matchesModule && matchesAction;
    });
  });

  protected updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  protected updateUserFilter(event: Event): void {
    this.userFilter.set((event.target as HTMLSelectElement).value);
  }

  protected updateModuleFilter(event: Event): void {
    this.moduleFilter.set((event.target as HTMLSelectElement).value);
  }

  protected updateActionFilter(event: Event): void {
    this.actionFilter.set((event.target as HTMLSelectElement).value);
  }
}
