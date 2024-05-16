import { Component } from '@angular/core';
import { ClearconfirmationComponent } from '../popup/clearconfirmation/clearconfirmation.component';
import { LegendsComponent } from '../popup/legends/legends.component';
import { MatDialog } from '@angular/material/dialog';
import { AdditemComponent } from '../popup/additem/additem.component';
import { SuggestComponent } from '../popup/suggest/suggest.component';
import { ImportorderComponent } from '../popup/importorder/importorder.component';

export interface PartsTable {
  sku: string;
  description: string;
  price: string;
  y2024: string;
  y2023: string;
  r12: string;
  order: string;
}

const PARTS_DATA: PartsTable[] = [
  {sku:'530069599', description: 'KIT-LINE(FUEL)', price: '3.89', y2024: '0', y2023: '0', r12: '0', order:'-'},
  {sku:'530069599', description: 'KIT-LINE(FUEL)', price: '3.89', y2024: '0', y2023: '0', r12: '0', order:'-'},
  {sku:'530069599', description: 'KIT-LINE(FUEL)', price: '3.89', y2024: '0', y2023: '0', r12: '0', order:'-'},
  {sku:'530069599', description: 'KIT-LINE(FUEL)', price: '3.89', y2024: '0', y2023: '0', r12: '0', order:'-'},
  {sku:'530069599', description: 'KIT-LINE(FUEL)', price: '3.89', y2024: '0', y2023: '0', r12: '0', order:'-'}

];

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})


export class PartsComponent {  
  displayedColumns: string[] = ['sku', 'description', 'price', 'y2024', 'y2023', 'r12', 'order'];
  dataSource = PARTS_DATA;

  constructor(private dialog: MatDialog) {}

  openClearconfirmation(): void {
    this.dialog.open(ClearconfirmationComponent);
  }
  openLegends(): void {
    this.dialog.open(LegendsComponent);
  }
  openSuggest(): void {
    this.dialog.open(SuggestComponent);
  }
  openAdditem(): void {
    this.dialog.open(AdditemComponent);
  }  
  openImportorder(): void {
    this.dialog.open(ImportorderComponent);
  }  
}