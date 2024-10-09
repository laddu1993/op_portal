import { Component, Renderer2, Inject, Output, EventEmitter } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MasterService } from 'src/app/apiservice/master.service';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-clearconfirmation',
  templateUrl: './clearconfirmation.component.html',
  styleUrls: ['./clearconfirmation.component.css']
})
export class ClearconfirmationComponent {
    jsonData: any;
    @Output() addItemEvent = new EventEmitter<{ showBtn: boolean }>();
    assetUrl = environment.assetUrl;

    constructor(public dialogRef: DialogRef, private service: MasterService, private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) { }

    closePopup(){
      this.addItemEvent.emit({ showBtn: false });
      this.dialogRef.close();
    }

    getClear(){
      this.service.getClearOrder().subscribe(res => {
        this.jsonData = res;
        const flag: boolean = true; // Define the constant flag
        if(this.jsonData.status == "success"){
          // Select all elements with the class 'vl_order_qty'
          const inputs = document.querySelectorAll('.vl_order_qty');
          // Loop through each selected element and set its value to zero
          inputs.forEach(input => {
            if (input instanceof HTMLInputElement) {
              input.value = '0';
            }
          });
          const element2 = this.document.getElementById('msg_before_discount');
          if (element2) {
            this.renderer.setProperty(element2, 'textContent', '$0.00');
          }
          const element3 = this.document.getElementById('msg_after_discount');
          if (element3) {
            this.renderer.setProperty(element3, 'textContent',  '$0.00');
          }
          const element4 = this.document.getElementById('msg_ayp');
          if (element4) {
            this.renderer.setProperty(element4, 'textContent',  '$0.00');
          }
          // Ensure this.dialogRef is accessible and properly initialized
          if (this.dialogRef) {
            this.addItemEvent.emit({ showBtn: true });
            this.dialogRef.close();
          } else {
            console.error("DialogRef is not initialized");
          }
        }
      });
    }
}
