import { Component, Output, EventEmitter } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-suggest',
  templateUrl: './suggest.component.html',
  styleUrls: ['./suggest.component.css']
})
export class SuggestComponent {

  @Output() addItemEvent = new EventEmitter<{ showBtn: boolean }>();
  suggestForm: FormGroup;
  currentYear: any;
  previousYear: any;
  selectedProduct: string = '';
  showBtn: boolean = true;
  errorMessage: string | null = null;
  assetUrl = environment.assetUrl;

  constructor(private fb: FormBuilder, private dialogRef: DialogRef) { 
    const date = new Date();
    this.currentYear = date.getFullYear();
    this.previousYear = this.currentYear - 1;
    this.suggestForm = this.fb.group({
      selectedPercentage: [''],
      selectedHistory: ['']
    });
  }

  closePopup(): void {
    this.addItemEvent.emit({ showBtn: false });
    this.dialogRef.close();
  }

  suggest(): void {
    this.addItemEvent.emit({ showBtn: true });
    this.dialogRef.close();
  }

}
