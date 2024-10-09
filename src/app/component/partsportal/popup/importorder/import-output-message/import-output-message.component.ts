import { Component, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-import-output-message',
  templateUrl: './import-output-message.component.html',
  styleUrls: ['./import-output-message.component.css']
})
export class ImportOutputMessageComponent {

  message: any;

  constructor(private dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: any) {}

  closePopup(): void {
    this.dialogRef.close();
    location.reload();
  }

}
