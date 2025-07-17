import { Component, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-output-message',
  templateUrl: './output-message.component.html',
  styleUrls: ['./output-message.component.css']
})
export class OutputMessageComponent {

  orderID: any;
  assetUrl = environment.assetUrl;

  constructor(private dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: any) {}

  closePopup(): void {
    this.dialogRef.close();
    //location.reload();
  }

}
