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
import { ClearOrderPopupComponent } from './component/popup/clear-order-popup/clear-order-popup.component';
import { PartsComponent } from './component/partsportal/parts/parts.component';
import { LegendsComponent } from './component/partsportal/popup/legends/legends.component';
import { AdditemComponent } from './component/partsportal/popup/additem/additem.component';
import { RemoveitemComponent } from './component/partsportal/popup/removeitem/removeitem.component';
import { ClearconfirmationComponent } from './component/partsportal/popup/clearconfirmation/clearconfirmation.component';
import { SuggestComponent } from './component/partsportal/popup/suggest/suggest.component';



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
    ClearOrderPopupComponent,
    PartsComponent,
    LegendsComponent,
    AdditemComponent,
    RemoveitemComponent,
    ClearconfirmationComponent,
    SuggestComponent
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
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
