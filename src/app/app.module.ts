import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerInfoComponent } from './component/customer-info/customer-info.component';
import { DealerInfoComponent } from './component/dealer-info/dealer-info.component';
import { HomeComponent } from './component/home/home.component';
import { PopupComponent } from './component/popup/popup.component';
import { MenubarComponent } from './component/menubar/menubar.component';
import { TemplateInfoComponent } from './component/template-info/template-info.component';
import { HeaderInfoComponent } from './component/header-info/header-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { DealerPopupComponent } from './component/popup/dealer-popup/dealer-popup.component';
import { TemplatePopupComponent } from './component/popup/template-popup/template-popup.component';
import { DeleteTemplatePopupComponent } from './component/popup/delete-template-popup/delete-template-popup.component';
import { AddTemplatePopupComponent } from './component/popup/add-template-popup/add-template-popup.component';
import { PartsComponent } from './component/partsportal/parts/parts.component';
import { LegendsComponent } from './component/partsportal/popup/legends/legends.component';
import { AdditemComponent } from './component/partsportal/popup/additem/additem.component';
import { RemoveitemComponent } from './component/partsportal/popup/removeitem/removeitem.component';
import { ClearconfirmationComponent } from './component/partsportal/popup/clearconfirmation/clearconfirmation.component';
import { SuggestComponent } from './component/partsportal/popup/suggest/suggest.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { ImportorderComponent } from './component/partsportal/popup/importorder/importorder.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SubmitOrderComponent } from './component/partsportal/popup/submit-order/submit-order.component';
import { LoaderComponent } from './apiservice/loader/loader.component';
import { SubmitOutputMessageComponent } from './component/popup/submit-output-message/submit-output-message.component';
import { OutputMessageComponent } from './component/partsportal/popup/output-message/output-message.component';
import { ImportOutputMessageComponent } from './component/partsportal/popup/importorder/import-output-message/import-output-message.component';
import { GeneralOutputComponent } from './component/popup/general-output/general-output.component';
import { ProgramInformationComponent } from './component/popup/program-information/program-information.component';
import { AgGridAngular } from 'ag-grid-angular';
import { SkeletonLoaderComponent } from './component/skeleton-loader/skeleton-loader.component';
import { ProgressBarComponent } from './component/progress-bar/progress-bar.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { IsMaintenanceComponent } from './is-maintenance/is-maintenance.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ContactAdminComponent } from './component/contact-admin/contact-admin.component';
import { UnauthorizedComponent } from './component/unauthorized/unauthorized.component';
import { LoadHistoryComponent } from './component/partsportal/load-history/load-history.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    AppComponent,
    CustomerInfoComponent,
    DealerInfoComponent,
    HomeComponent,
    PopupComponent,
    MenubarComponent,
    TemplateInfoComponent,
    HeaderInfoComponent,
    DealerPopupComponent,
    TemplatePopupComponent,
    DeleteTemplatePopupComponent,
    AddTemplatePopupComponent,
    PartsComponent,
    LegendsComponent,
    AdditemComponent,
    RemoveitemComponent,
    ClearconfirmationComponent,
    SuggestComponent,
    ImportorderComponent,
    SubmitOrderComponent,
    LoaderComponent,
    SubmitOutputMessageComponent,
    OutputMessageComponent,
    ImportOutputMessageComponent,
    GeneralOutputComponent,
    ProgramInformationComponent,
    SkeletonLoaderComponent,
    ProgressBarComponent,
    NotFoundComponent,
    IsMaintenanceComponent,
    ContactAdminComponent,
    UnauthorizedComponent,
    LoadHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressBarModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridAngular,
    MatSnackBarModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
