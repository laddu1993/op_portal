import { Component } from '@angular/core';


export interface Templates {
  name: string;
  created: string;
  updated: string;
  s1: string;
  s2: string;
  s3: string;
  pna: string;
  code: string;
}

const TEMP_DATA: Templates[] = [
  {name:'Template Name', created: 'xxxx-xx-xx', updated: 'xxxx-xx-xx', s1: '-', s2: '-', s3:'-', pna:'PSOSPRING', code:'x'}
];

@Component({
  selector: 'app-template-info',
  templateUrl: './template-info.component.html',
  styleUrls: ['./template-info.component.css']
})



export class TemplateInfoComponent {
  displayedColumns: string[] = ['name', 'created', 'updated', 's1', 's2', 's3', 'pna', 'code'];
  dataSource = TEMP_DATA;

}

