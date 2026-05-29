import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.html',
  styleUrl: './menu-page.css',
})
export class MenuPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly routeData = toSignal(this.route.data, {
    initialValue: {
      title: 'Workspace',
      description: 'Manage your daily business activity.',
    },
  });
}
