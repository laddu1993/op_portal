import { Component } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-legends',
  templateUrl: './legends.component.html',
  styleUrls: ['./legends.component.css']
})
export class LegendsComponent {

  assetUrl = environment.assetUrl;

  constructor(public dialogRef: DialogRef) { }

  closePopUp(){
    this.dialogRef.close();
  }

}
