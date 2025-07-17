import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output, Renderer2, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Dealer } from 'src/app/Model/UserObject';
import { MasterService } from 'src/app/apiservice/master.service';
import { DialogRef } from '@angular/cdk/dialog';
import { TemplatePopupComponent } from '../template-popup/template-popup.component';
import { DOCUMENT } from '@angular/common';
import { LoaderService } from 'src/app/apiservice/loader.service';
import { AccountService } from 'src/app/apiservice/account.service';
import { environment } from 'src/environments/environment';

export interface Templates {
  account: string;
  name: string;
  dc: string;
  discount: string;
  ytd: string;
  ly: string;
}

@Component({
  selector: 'app-dealer-popup',
  templateUrl: './dealer-popup.component.html',
  styleUrls: ['./dealer-popup.component.scss']
})

export class DealerPopupComponent implements OnInit{
  noRecords: boolean = false;
  messages: string[] = [];
  dealerlist !: Dealer[];
  dataSource: any;
  displayedColumns: string[] = ["account_number", "name", "dis_cat", "dis_cat_desc", "financial_yr_to_date_sales", "financial_last_yr_sales"];
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  dealerData: any;
  jsonData: any = {};  // Initialize jsonData
  anyData: any = {};
  @Output() dataEvent = new EventEmitter<string>();
  account_number: any;
  @ViewChild('account_number', { static: true }) myTextElement!: ElementRef;
  @Output() addItemEvent = new EventEmitter<{ showBtn: boolean }>();
  assetUrl = environment.assetUrl;
  isLoading = true; // Initialize the loading flag

  constructor(
    private accountService: AccountService,
    private service: MasterService,
    public dialogRef: DialogRef,
    private renderer: Renderer2, 
    @Inject(DOCUMENT) private document: Document, 
    private loadService: LoaderService) 
  { }

  ngOnInit(): void {
    this.loaddealer();
  }

  loaddealer(){
    //this.loadService.show();
    this.service.getUsers().subscribe(res => {
      this.dealerlist = res;
      this.dataSource = new MatTableDataSource<Dealer>(this.dealerlist);
      this.dataSource.paginator = this.paginatior;
      this.dataSource.sort = this.sort;
      // Check if the results are empty
      this.noRecords = this.dealerlist.length === 0;
      this.loadService.hide();
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  closePopup(): void {
    this.dialogRef.close(TemplatePopupComponent);
  }

  dealerSelected(accountNumber: string, orgID: string): void {
    this.isLoading = false;
    this.service.setIsDifferentContentVisible(false);
    this.loadService.show();
    this.service.getDealer(accountNumber, orgID).subscribe({
      next: (data) => {
        this.handleDealerResponse(data);
      },
      error: (error) => {
        console.error('Error fetching dealer data:', error);
        this.loadService.hide();  // Ensure the loading indicator is hidden on error
        // Optionally, provide user feedback here
      }
    });
  }

  private handleDealerResponse(data: any): void {
    // Debug the response structure
    console.log('API response:', data);
    if (data && data.results) {
      const results = data.results;
      this.jsonData = { results, showBtn: true };  // Spread to include showBtn

      // Set properties and account details
      this.updateElementText('account_number', results.account_number || '');
      this.updateElementText('slt_dealer_id', results.id || '');
      this.updateElementText('org_name', results.name || '');

      // Set account service values
      this.accountService.setOrderPortalAccountNumber(results.account_number || '');
      this.accountService.setSltDealerId(results.id || '');
      this.accountService.setOrgID(results.id || '');

      // Emit the event and close the dialog
      this.jsonData.showBtn = true;
      this.addItemEvent.emit({ showBtn: this.jsonData });
      this.dialogRef.close();
    } else {
      console.error('Results are undefined or missing in the API response:', data);
      this.loadService.hide();  // Hide loading if data is not as expected
    }
  }

  private updateElementText(elementId: string, text: string | undefined): void {
    const element = this.document.getElementById(elementId);
    if (element) {
      this.renderer.setProperty(element, 'textContent', text || 'N/A');
    } else {
      console.warn(`Element with ID ${elementId} not found.`);
    }
  }

}
