import { Component } from '@angular/core';


export interface Templates {
  account: string;
  name: string;
  dc: string;
  discount: string;
  ytd: string;
  ly: string;
}

const DEALER_LIST: Templates[] = [
  {account:'98549', name: 'John A. Thompson', dc: 'DR', discount: 'Direct Robotics', ytd: '7,299.75', ly:'0.15'},
  {account:'98549', name: 'John A. Thompson', dc: 'DR', discount: 'Direct Robotics', ytd: '7,299.75', ly:'0.15'},
  {account:'98549', name: 'John A. Thompson', dc: 'DR', discount: 'Direct Robotics', ytd: '7,299.75', ly:'0.15'},
  {account:'98549', name: 'John A. Thompson', dc: 'DR', discount: 'Direct Robotics', ytd: '7,299.75', ly:'0.15'},
  {account:'98549', name: 'John A. Thompson', dc: 'DR', discount: 'Direct Robotics', ytd: '7,299.75', ly:'0.15'},
  {account:'98549', name: 'John A. Thompson', dc: 'DR', discount: 'Direct Robotics', ytd: '7,299.75', ly:'0.15'}
  
];


@Component({
  selector: 'app-dealer-popup',
  templateUrl: './dealer-popup.component.html',
  styleUrls: ['./dealer-popup.component.scss']
})

export class DealerPopupComponent {
  displayedColumns: string[] = ['account', 'name', 'dc', 'discount', 'ytd', 'ly'];
  dataSource = DEALER_LIST;
}
