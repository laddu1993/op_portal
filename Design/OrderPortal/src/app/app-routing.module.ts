import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerInfoComponent } from './component/customer-info/customer-info.component';
import { DealerInfoComponent } from './component/dealer-info/dealer-info.component';
import { HomeComponent } from './component/home/home.component';
import { PartsComponent } from './component/partsportal/parts/parts.component';


const routes: Routes = [
  { path: 'customer-info', component: CustomerInfoComponent },
  { path: 'dealer-info', component: DealerInfoComponent },
  { path: 'home', component: HomeComponent },
  { path: 'parts', component: PartsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Default route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
