import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { ClearOrderPopupComponent } from '../popup/clear-order-popup/clear-order-popup.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private dialog: MatDialog) {}
  openClear(): void {
    //alert(321);
    this.dialog.open(ClearOrderPopupComponent);
  }
}
