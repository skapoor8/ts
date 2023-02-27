import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { UserSelectorComponent } from '../../users/components/user-selector.component';

@Component({
  standalone: true,
  imports: [MatToolbarModule, UserSelectorComponent],
  selector: 'looper-shell-header',
  template: `
    <mat-toolbar class="flex-row content-center" color="primary">
      <span class="flex-1 text-white">looper</span>
      <looper-user-selector></looper-user-selector>
    </mat-toolbar>
  `,
  styles: [``],
})
export class ShellHeaderComponent {}
