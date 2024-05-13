import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DealerPopupComponent } from '../popup/dealer-popup/dealer-popup.component';

export interface PeriodicElement {
  shipment: string;
  s1date: string;
  s2date: string;
  s3date: string;
  pnadate: string;
  s1: string;
  s2: string;
  s3: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {shipment:' ', s1date: 'S1', s2date: 'S2', s3date: 'S3', pnadate: 'P&A', s1: 'D1', s2:'D2', s3:'D3'},
  {shipment:'Handheld', s1date: '17,087.64', s2date: '39,887.04', s3date: '9,279.82	', pnadate: '2,599.95	', s1: '40,559.22', s2:'6,239.88', s3:'5,199.90'},
  {shipment:'Wheeled', s1date: '-', s2date: '-', s3date: '-', pnadate: '-', s1: '-', s2:'-', s3:'-'},
  {shipment:'P&A', s1date: '-', s2date: '-', s3date: '-', pnadate: '-', s1: '-', s2:'-', s3:'-'},
  {shipment:'Total', s1date: '17,087.64', s2date: '39,887.04', s3date: '9,279.82	', pnadate: '2,599.95	', s1: '40,559.22', s2:'6,239.88', s3:'5,199.90'},
];


@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
})

export class CustomerInfoComponent {

  displayedColumns: string[] = ['shipment', 's1date', 's2date', 's3date', 'pnadate', 's1', 's2', 's3'];
  dataSource = ELEMENT_DATA;

  constructor(private dialog: MatDialog) {}

  openPopup(): void {
    this.dialog.open(DealerPopupComponent);
  }

}


