import { Component, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { MasterService } from 'src/app/apiservice/master.service';
import { AddNewItem } from 'src/app/Model/UserObject';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css']
})
export class AdditemComponent {

  @Output() addItemEvent = new EventEmitter<{ blank: string, sku: number, desc: string, price: number, quantity: number }>();
  sku: number | null = null;
  products: AddNewItem[] | any;
  jsonData: any;
  quantity: number = 1; // Default quantity
  errorMessage: string | null = null; // Add this property to your component
  assetUrl = environment.assetUrl;
  @ViewChild('skuInput') skuInput!: ElementRef;

  constructor(private dialog: MatDialog,
    private service: MasterService,
    private cdr: ChangeDetectorRef,
    public dialogRef: DialogRef<any>
  ) { }

  // Focus on SKU input when the component is initialized
  ngAfterViewChecked() {
    if (!this.products) {  // Focus on skuInput only if product is not yet found
      this.skuInput.nativeElement.focus();
    }
  }

  closePopUp(){
    this.dialogRef.close();
  }
  
  searchSKU(): void {
    // Reset the error message before performing the search
    this.errorMessage = null;
    // Check if `this.sku` is not null and is a valid number
    if (this.sku !== null && !isNaN(this.sku)) {
      this.service.getaddItemSearch(this.sku.toString()).subscribe(data => {
        this.jsonData = data;
        if (this.jsonData.status == 'failed') {
          this.errorMessage = this.jsonData.message;
        } else {
          this.jsonData = data;
          this.products = this.jsonData.results;
          // Check if price is missing or zero
          if (!this.products.price || this.products.price === 0) {
            alert("Price is not added to this SKU, so it will not be added to the listing page.");
          }        
        }
      });
    } else {
      this.errorMessage = 'Please enter a valid Product SKU';
    }
  }  

  addItenBtn(): void{
    if (this.products) {
      const { blank, sku, desc, price } = this.products; // Destructure the product object
      // console.log('Closing with data:', { blank, sku, desc, price, quantity: this.quantity });
      this.addItemEvent.emit({ blank, sku, desc, price, quantity: this.quantity });
      this.dialogRef.close({ blank, sku, desc, price, quantity: this.quantity });
    } else {
      this.errorMessage = 'No product selected';
    }
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    this.sku = numericValue ? Number(numericValue) : null;
    input.value = this.sku?.toString() || '';
  }
  
  onQuantityChange(value: string): void {
    // Sanitize and parse the value
    const numericValue = value.replace(/[^0-9]/g, '');
    this.quantity = numericValue ? Number(numericValue) : 1;
  }

}