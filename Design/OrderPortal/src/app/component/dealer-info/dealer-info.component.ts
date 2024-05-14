import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TemplatePopupComponent } from '../popup/template-popup/template-popup.component';
import { AddTemplatePopupComponent } from '../popup/add-template-popup/add-template-popup.component';

export interface PeriodicElement {
  sku: string;
  model: string;
  description: string;
  history: string;
  s1: string;
  s2: string;
  s3: string;
  pna: string;
  d1: string;
  d2: string;
  d3: string;
  msrp: string;
  cost: string;
  ayp: string;
  ext: string;  
}



const ELEMENT_DATA: PeriodicElement[] = [
  {sku:'966428694', model: '365', description: '365 24" 50GA 3/8 KIT', history: '-', s1: '-', s2: '-', s3:'-', pna:'-', d1:'-', d2:'-', d3:'-', msrp:'1,039.99', cost:'831.99', ayp:'831.99', ext:'1'},
  {sku:'966428694', model: '365', description: '365 24" 50GA 3/8 KIT', history: '-', s1: '-', s2: '-', s3:'-', pna:'-', d1:'-', d2:'-', d3:'-', msrp:'1,039.99', cost:'831.99', ayp:'831.99', ext:'1'},
  {sku:'966428694', model: '365', description: '365 24" 50GA 3/8 KIT', history: '-', s1: '-', s2: '-', s3:'-', pna:'-', d1:'-', d2:'-', d3:'-', msrp:'1,039.99', cost:'831.99', ayp:'831.99', ext:'1'},
  {sku:'966428694', model: '365', description: '365 24" 50GA 3/8 KIT', history: '-', s1: '-', s2: '-', s3:'-', pna:'-', d1:'-', d2:'-', d3:'-', msrp:'1,039.99', cost:'831.99', ayp:'831.99', ext:'1'},
  {sku:'966428694', model: '365', description: '365 24" 50GA 3/8 KIT', history: '-', s1: '-', s2: '-', s3:'-', pna:'-', d1:'-', d2:'-', d3:'-', msrp:'1,039.99', cost:'831.99', ayp:'831.99', ext:'1'},
  {sku:'966428694', model: '365', description: '365 24" 50GA 3/8 KIT', history: '-', s1: '-', s2: '-', s3:'-', pna:'-', d1:'-', d2:'-', d3:'-', msrp:'1,039.99', cost:'831.99', ayp:'831.99', ext:'1'},
  {sku:'966428694', model: '365', description: '365 24" 50GA 3/8 KIT', history: '-', s1: '-', s2: '-', s3:'-', pna:'-', d1:'-', d2:'-', d3:'-', msrp:'1,039.99', cost:'831.99', ayp:'831.99', ext:'1'},

];


@Component({
  selector: 'app-dealer-info',
  templateUrl: './dealer-info.component.html',
  styleUrls: ['./dealer-info.component.scss']
})


export class DealerInfoComponent  {
  displayedColumns: string[] = ['sku', 'model', 'description', 'history', 's1', 's2', 's3', 'pna', 'd1', 'd2', 'd3', 'msrp', 'cost', 'ayp', 'ext'];
  dataSource = ELEMENT_DATA;

  constructor(private dialog: MatDialog) {}

  openTemplatePopup(): void {
    this.dialog.open(TemplatePopupComponent);
  }

  openAddTemplatePopup(): void{
    this.dialog.open(AddTemplatePopupComponent);
  }

}







