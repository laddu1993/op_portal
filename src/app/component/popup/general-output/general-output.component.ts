import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-general-output',
  templateUrl: './general-output.component.html',
  styleUrls: ['./general-output.component.css']
})
export class GeneralOutputComponent implements OnInit {
  
  // Define a variable to hold the data passed from saveTemplate()
  response: any;
  assetUrl = environment.assetUrl;

  constructor(
    public dialogRef: MatDialogRef<GeneralOutputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Assign the data passed through MAT_DIALOG_DATA to response
    this.response = data;
  }

  ngOnInit(): void {
    // OnInit lifecycle hook
    console.log('Received data:', this.response);
    if(this.response.reload !== false){
      setTimeout(this.reloadPage, 5000);
    }
    // You can perform any initialization logic here
  }

  closePopup(): void{
    this.dialogRef.close();
  }

  reloadPage(){
    location.reload();
  }

}
