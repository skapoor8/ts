import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'elists',
    loadChildren: () =>
      import('./modules/elists/elist.routes').then((mod) => mod.routes),
  },
];
