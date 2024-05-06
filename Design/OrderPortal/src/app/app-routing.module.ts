import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerInfoComponent } from './component/customer-info/customer-info.component';
import { DealerInfoComponent } from './component/dealer-info/dealer-info.component';

const routes: Routes = [
  { path: 'customer-info', component: CustomerInfoComponent },
  { path: 'dealer-info', component: DealerInfoComponent },
  { path: '', redirectTo: '/customer-info', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
