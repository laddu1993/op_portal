import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';



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

export interface SummaryTable {
  shipment: string;
  s1date: string;
  s2date: string;
  s3date: string;
  pnadate: string;
  s1n: string;
  s2n: string;
  s3n: string;
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

const SUMMARY_DATA: SummaryTable[] = [
  {shipment:' ', s1date: 'S1', s2date: 'S2', s3date: 'S3', pnadate: 'P&A', s1n: 'D1', s2n:'D2', s3n:'D3'},
  {shipment:'Handheld', s1date: '17,087.64', s2date: '39,887.04', s3date: '9,279.82	', pnadate: '2,599.95	', s1n: '40,559.22', s2n:'6,239.88', s3n:'5,199.90'},
  {shipment:'Wheeled', s1date: '-', s2date: '-', s3date: '-', pnadate: '-', s1n: '-', s2n:'-', s3n:'-'},
  {shipment:'P&A', s1date: '-', s2date: '-', s3date: '-', pnadate: '-', s1n: '-', s2n:'-', s3n:'-'},
  {shipment:'Total', s1date: '17,087.64', s2date: '39,887.04', s3date: '9,279.82	', pnadate: '2,599.95	', s1n: '40,559.22', s2n:'6,239.88', s3n:'5,199.90'},
];


@Component({
  selector: 'app-dealer-info',
  templateUrl: './dealer-info.component.html',
  styleUrls: ['./dealer-info.component.scss']
})


export class DealerInfoComponent  {
  displayedColumns: string[] = ['sku', 'model', 'description', 'history', 's1', 's2', 's3', 'pna', 'd1', 'd2', 'd3', 'msrp', 'cost', 'ayp', 'ext'];
  dataSource = ELEMENT_DATA;
}

export class SummaryTablecl  {
displayedColumns: string[] = ['shipment', 's1date', 's2date', 's3date', 'pnadate', 's1n', 's2n', 's3n'];
dataSource = SUMMARY_DATA;
}






