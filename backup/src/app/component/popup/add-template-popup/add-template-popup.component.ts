import { Component, Output, EventEmitter, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-template-popup',
  templateUrl: './add-template-popup.component.html',
  styleUrls: ['./add-template-popup.component.css']
})
export class AddTemplatePopupComponent {

  templateName: string = '';
  errorMessage: string | null = null;
  @Output() templateSaved: EventEmitter<string> = new EventEmitter<string>();
  assetUrl = environment.assetUrl;

  constructor(private dialog: MatDialog, public dialogRef: DialogRef) { }

  closePopup(): void{
    this.dialogRef.close();
  }

  saveOrder(): void{
    if (this.templateName) {
      this.templateSaved.emit(this.templateName);
      this.closePopup();
    } else {
      // Handle the case when the template name is not provided
      this.errorMessage = 'Please enter a template name';
    }
  }

}