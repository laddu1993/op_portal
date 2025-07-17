import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerInfoComponent } from './component/customer-info/customer-info.component';
import { DealerInfoComponent } from './component/dealer-info/dealer-info.component';
import { HomeComponent } from './component/home/home.component';
import { PartsComponent } from './component/partsportal/parts/parts.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { IsMaintenanceComponent } from './is-maintenance/is-maintenance.component';
import { ContactAdminComponent } from './component/contact-admin/contact-admin.component';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';

const routes: Routes = [
  { path: 'customer-info', component: CustomerInfoComponent },
  { path: 'dealer-info', component: DealerInfoComponent },
  { path: 'home', component: HomeComponent },
  { path: 'parts', component: PartsComponent },
  { path: '', redirectTo: '/parts?acct=54321', pathMatch: 'full' }, // Default route
  // other routes
  { path: '404', component: NotFoundComponent },
  { path: 'isMaintenance', component: IsMaintenanceComponent }, // Add the route for maintenance
  //{ path: '**', redirectTo: '404' }, // Redirect any unknown path to the 404 page
  { path: 'contact-admin', component: ContactAdminComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  //{ path: '**', redirectTo: '' } // Wildcard route to handle any undefined routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
