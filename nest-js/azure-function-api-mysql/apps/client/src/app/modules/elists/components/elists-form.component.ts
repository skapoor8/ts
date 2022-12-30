import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ElistsPresenter } from '../presenters';

@Component({
  standalone: true,
  imports: [MatButtonModule],
  providers: [ElistsPresenter],
  selector: 'looper-elists-form',
  template: `
    <!-- title + actions -->
    <div class="flex flex-row items-center pb-2 border-b">
      <span class="uppercase font-semibold flex-1 text-gray-500"
        >Add Elist</span
      >
      <button mat-raised-button color="primary">Save</button>
    </div>
  `,
  host: {
    class: 'flex flex-col flex-1 gap-2 w-full p-4 bg-slate-100',
  },
})
export class ElistsFormComponent {}
