import { Component } from '@angular/core';

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
}