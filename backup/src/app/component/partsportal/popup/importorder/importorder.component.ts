import { Component } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MasterService } from 'src/app/apiservice/master.service';
import { Router } from '@angular/router';
import { ImportOutputMessageComponent } from './import-output-message/import-output-message.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-importorder',
  templateUrl: './importorder.component.html',
  styleUrls: ['./importorder.component.css']
})
export class ImportorderComponent {

  file: File | null = null;
  errorMessage: string | null = null;
  assetUrl = environment.assetUrl;

  constructor(
    private dialog: MatDialog,
    public dialogRef: DialogRef,
    private service: MasterService,
    private router: Router
  ) { }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!this.isValidFileType(file)) {
        this.errorMessage = 'Invalid file type. Please upload an Excel file.';
        this.file = null; // Clear file input
        return;
      }
      if (!this.isValidFileSize(file)) {
        this.errorMessage = 'File size exceeds the limit of 5MB.';
        this.file = null; // Clear file input
        return;
      }
      this.errorMessage = null; // Clear any previous error message
      this.file = file;
    }
  }

  isValidFileType(file: File): boolean {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    return validTypes.includes(file.type);
  }  

  isValidFileSize(file: File): boolean {
    const maxSizeInMB = 5;
    return file.size <= maxSizeInMB * 1024 * 1024;
  }

  importOrder(): void {
    if (this.file) {
      this.service.importOrder(this.file).subscribe(
        res => {
          console.log('File uploaded successfully:', res);
          this.dialogRef.close();
          this.dialog.open(ImportOutputMessageComponent, {
            data: { message: res }
          });
        },
        error => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      this.errorMessage = 'Please select a valid file before importing.';
    }
  }

  closePopup(): void {
    this.dialogRef.close();
  }
}