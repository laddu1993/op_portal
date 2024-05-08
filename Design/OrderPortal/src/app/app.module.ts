import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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

@NgModule({
  declarations: [
    AppComponent,
    CustomerInfoComponent,
    DealerInfoComponent,
    HomeComponent,
    PopupComponent,
    MenubarComponent,
    TemplateInfoComponent,
    HeaderInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatTableModule,
    MatButtonToggleModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
