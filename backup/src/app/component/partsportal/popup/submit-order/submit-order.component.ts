import { Component, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MasterService } from 'src/app/apiservice/master.service';
import { OutputMessageComponent } from '../output-message/output-message.component';
import { LoaderService } from 'src/app/apiservice/loader.service';
import { environment } from 'src/environments/environment';
import { GeneralOutputComponent } from 'src/app/component/popup/general-output/general-output.component';
import { AccountService } from 'src/app/apiservice/account.service';
import { DOCUMENT } from '@angular/common';

interface Order {
  id: number;
  order_id: string;
  order_date: string;
  previous_capacity: number;
  current_capacity: number;
  created_date: string;
  created_by: string;
  order_quantity: number;
  warehouse_id: number;
}

@Component({
  selector: 'app-submit-order',
  templateUrl: './submit-order.component.html',
  styleUrls: ['./submit-order.component.css']
})
export class SubmitOrderComponent {

  selectedDate: Date | null = null;
  minDate: Date = new Date();  // This sets the minimum date to today
  assetUrl = environment.assetUrl;
  showError = false;
  isSubmitting = false;  // Flag to control button visibility
  compCode: any;
  isLoading = true; // Initialize loading state as true
  disabledDates: Set<string> = new Set();  // Store disabled dates

  constructor(public dialogRef: DialogRef,
    @Inject(DOCUMENT) private document: Document, 
    private acctService: AccountService,
    private service: MasterService,
    private dialog: MatDialog,
    private loaderService: LoaderService
  ) { }
  
  ngOnInit(): void {
    this.compCode = this.acctService.getCompCode();
    const today = new Date();
    // Calculate minDate as 90 days from today
    this.minDate = new Date(today);
    this.minDate.setDate(today.getDate() + 90);
    if (this.compCode === 'CDA') {
      // If compCode is CDA, set the minDate to January 1st of next year
      // const nextYear = today.getFullYear() + 1;
      // this.minDate = new Date(nextYear, 0, 1); // January is month 0 in JavaScript
    } else {
      // For other compCodes, set the minDate to 14 days later
      // this.minDate = new Date(today.setDate(today.getDate() + 14));
      this.loadDisabledDates();
    }
  }

  loadDisabledDates() {
    this.service.getWareHouseDateList().subscribe(res => {
      const orders = res.results;
      orders.forEach((order: Order) => { // Type the order parameter
        if (order.current_capacity <= 0) {
          const orderDate = new Date(order.order_date);
          const formattedDate = this.formatDateWithoutTimezone(orderDate);
          this.disabledDates.add(formattedDate);
        }
      });
    });
  }
  
  // Custom function to format date as YYYY-MM-DD without timezone issues
  private formatDateWithoutTimezone(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure 2 digits for month
    const day = ('0' + date.getDate()).slice(-2); // Ensure 2 digits for day
    return `${year}-${month}-${day}`;
  }

  submitOrder() {
    if (!this.selectedDate) {
      this.showError = true;
      return;
    }
    this.showError = false;
    this.isSubmitting = true;  // Hide the Submit button
    this.loaderService.show();
    this.isLoading = true;
    const shipWeekDate = this.formatDateWithoutTimezone(this.selectedDate); // Format the date as YYYY-MM-DD
    this.acctService.disableSaveButton();
    this.dialogRef.close();
    //let respon = { message: 'You will be notified once the order is submitted!', 'reload': false };
    //this.dialog.open(GeneralOutputComponent, { data: respon });
    let numericValue: number = 0; // Define numericValue with a default value
    const msg_after_discount = this.document.getElementById('msg_after_discount');
    if (msg_after_discount) {
      // Get the text content, using fallback to an empty string if null
      let discountValue: string = msg_after_discount.innerText || msg_after_discount.textContent || '';
      // Remove the $ symbol and commas from the text
      discountValue = discountValue.replace(/[$,]/g, '');
      // Convert the string into a number and update numericValue
      numericValue = parseFloat(discountValue);
      if (isNaN(numericValue)) {
        console.error('Invalid numeric value extracted from discount text');
        numericValue = 0; // Reset to default in case of invalid value
      } else {
        console.log('Discount value:', numericValue);
      }
    } else {
      console.error('Element with id "msg_after_discount" not found');
    }
    this.service.submitOrder(shipWeekDate, numericValue).subscribe(res => {
      if(res.status == 'failed'){
        let output = { message: res.message, 'reload': false };
        this.dialog.open(GeneralOutputComponent, { data: output });
      }else{
        this.dialog.open(OutputMessageComponent, {
          data: { message: res }
        });
        this.dialogRef.close();
      }
      this.loaderService.hide();
      this.isLoading = false;
      //this.isSubmitting = false;  // Show the Submit button again
    }, error => {
      this.loaderService.hide();
      this.isLoading = false;
      console.error('Error submitting order', error);
      //this.isSubmitting = false;  // Show the Submit button again
    });
  }

  closePopup(){
    this.dialogRef.close();
  }

  // Define the filter function to disable specific dates and weekends
  dateFilter = (date: Date | null): boolean => {
    if (!date) return true;
    const day = date.getDay();
    const formattedDate = this.formatDateWithoutTimezone(date);
    // Disable weekends (Saturday=6, Sunday=0) and dates in the disabledDates set
    return day !== 0 && day !== 6 && !this.disabledDates.has(formattedDate);
  };

}
