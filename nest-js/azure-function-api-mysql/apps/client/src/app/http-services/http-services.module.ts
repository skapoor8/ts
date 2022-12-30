import { NgModule } from '@angular/core';
import { UsersHttpService } from './users.http-service';

@NgModule({
  providers: [UsersHttpService],
})
export class HttpServicesModule {}
