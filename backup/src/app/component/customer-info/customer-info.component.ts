import { Component, OnInit, OnDestroy, Inject, EventEmitter, Output, ViewChild, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DealerPopupComponent } from '../popup/dealer-popup/dealer-popup.component';
import { MasterService } from 'src/app/apiservice/master.service';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/apiservice/account.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { LoaderService } from 'src/app/apiservice/loader.service';
import { MatSelect } from '@angular/material/select';
import { environment } from 'src/environments/environment';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';

export interface PeriodicElement {
  shipment: string;
  s1date: string;
  s2date: string;
  s3date: string;
  s1: string;
  s2: string;
  s3: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { shipment: ' ', s1date: 'S1', s2date: 'S2', s3date: 'S3', s1: 'D1', s2: 'D2', s3: 'D3' },
  { shipment: 'Handheld', s1date: '17,087.64', s2date: '39,887.04', s3date: '9,279.82', s1: '40,559.22', s2: '6,239.88', s3: '5,199.90' },
  { shipment: 'Wheeled', s1date: '-', s2date: '-', s3date: '-', s1: '-', s2: '-', s3: '-' },
  { shipment: 'Total', s1date: '17,087.64', s2date: '39,887.04', s3date: '9,279.82', s1: '40,559.22', s2: '6,239.88', s3: '5,199.90' },
];

@Component({
  selector: 'app-customer-info',
  templateUrl: './customer-info.component.html',
  styleUrls: ['./customer-info.component.scss'],
})
export class CustomerInfoComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  dataSource = ELEMENT_DATA;
  isDifferentContentVisible: boolean = true;
  private subscription: Subscription = new Subscription();
  searchForm!: FormGroup;
  jsonData: any;
  org_name: string = 'Demo User';
  account_number: string = '54321';
  @Output() IsActiveOrderTab = new EventEmitter<void>();
  showAccountInfo: boolean = false;
  customerName: string = 'Demo User';
  accountNumber: string = 'Demo User';
  compCode: string | null = null;
  @ViewChild('vlDiscountLevel') vlDiscountLevel!: MatSelect;
  @ViewChild('vlPartsLevel') vlPartsLevel!: MatSelect;
  assetUrl = environment.assetUrl;
  isLoading: boolean = true; // Start with loading as true
  deafultPromoCode = 'PSOSPRING';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private service: MasterService,
    private acctService: AccountService, 
    private loadService: LoaderService,
    private renderer: Renderer2,
    private router: Router
  ) {}

  openPopup(): void {
    this.loadService.show();
    this.compCode = this.acctService.getCompCode();
    //console.log('VL Compcode' + this.compCode);
    const dialogRef = this.dialog.open(DealerPopupComponent);

    dialogRef.componentInstance.addItemEvent.subscribe(res => {
      //console.log('VL response' + res.showBtn);
      // Define discountPartsMap outside the conditional blocks
      let discountPartsMap: { [key: string]: [number, number] } = {};
      // Assign values based on compCode
      if (this.compCode === 'USF') {
        discountPartsMap = {
          "BA": [0, 0], "TT": [0, 0], "TB": [0, 0], "TS": [0, 2],
          "TG": [0, 3], "BB": [1, 0], "BS": [1, 2], "BG": [1, 3],
          "SB": [2, 0], "SS": [2, 2], "SG": [2, 3], "GB": [3, 0],
          "GS": [3, 2], "GG": [3, 3], "PB": [4, 0], "PS": [4, 2],
          "PG": [4, 3], "CB": [6, 1], "CS": [6, 2], "CG": [6, 3],
          "SO": [0, 0]
        };
      } else if (this.compCode === 'CDA') {
        discountPartsMap = {
          "CG": [1, 1], "CP": [2, 2], "CT": [3, 3], "CR": [5, 5],
          "CE": [7, 7]
        };
      } else {
        // Handle unknown compCode by providing a default or logging a warning
        console.warn('Unknown compCode:', this.compCode);
      }
      // Emitting data to another service
      //console.log('VL res ShowBtn:' + res.showBtn);
      this.acctService.emitData(res.showBtn);
      // let resp = {'showBtn': true};
      // this.acctService.emitDealerClicked(resp);
      this.showAccountInfo = false;
      const op_ut = { default: false };
      this.acctService.emitDefaultPage(op_ut);

      const accountNumber = this.acctService.getSltDealerId();
      this.jsonData       = res.showBtn;
      const discountCategory = this.jsonData.results.dis_cat;
      const [discountLevel, partsLevel] = discountPartsMap[discountCategory] || [0, 0];
      this.account_number = this.jsonData.results.account_number;
      console.log('VL account_number: ' + this.account_number);
      // Adjust discount level based on compCode
      let finalDiscountLevel = discountLevel;
      if (this.compCode === 'USF') {
        finalDiscountLevel = discountLevel === 6 ? 5 : discountLevel;
      }
      this.acctService.setDiscountLevel(finalDiscountLevel.toString());
      this.acctService.setPromoCode(this.deafultPromoCode);
      this.acctService.setOrderSelected('Dealer');
      this.setPromoCode(this.deafultPromoCode);
      this.setDiscountLevel(finalDiscountLevel); // Ensure this is called after form initialization
      this.setPartsLevel(partsLevel);
      this.makeSelectReadOnly();
      this.acctService.setcustomerName(this.jsonData.results.name);
      this.acctService.setOrgID(this.jsonData.results.id);
      //Remove last order ID from dealer
      this.acctService.setOrderID('0');
      // Update elements in the DOM
      setTimeout(() => {
        this.updateDomElements(this.jsonData.results.account_number, this.jsonData.results.name);
      }, 1000); // 1000 ms = 1 seconds
    });
  }

  private updateDomElements(accountNumber: string, orgName: string): void {
    this.updateElementText('account_number', accountNumber);
    this.updateElementText('org_name', orgName);
  }

  private updateElementText(elementId: string, text: string | undefined): void {
    const element = this.document.getElementById(elementId);
    if (element) {
      this.renderer.setProperty(element, 'textContent', text || 'N/A');
    } else {
      console.warn(`Element with ID ${elementId} not found.`);
    }
  }

  makeSelectReadOnly(): void {
    if (this.vlDiscountLevel) {
      this.vlDiscountLevel.disabled = true;
    }
    if (this.vlPartsLevel) {
      this.vlPartsLevel.disabled = true;
    }
  }

  makeSelectAccessible(): void {
    if (this.vlDiscountLevel) {
      this.vlDiscountLevel.disabled = false; // Enable the select element
    }
    if (this.vlPartsLevel) {
      this.vlPartsLevel.disabled = false; // Enable the select element
    }
  }

  ngOnInit(): void {
    this.loadService.show();
    this.getCRMAPIcall();
    this.form = this.fb.group({
      customerName: 'Demo User',
      accountNumber: '54321',
      DiscountLevel: [''],
      PartsLevel: [''],
      PromoCode: ['PSOSPRING']
    });
    this.runOnPageLoad();
    this.subscription = this.service.isDifferentContentVisible$.subscribe(isVisible => {
      this.isDifferentContentVisible = isVisible;
    });
    // Use setTimeout to delay the hiding of the loadService by 3 seconds
    setTimeout(() => {
      this.loadService.hide();
    }, 3000); // 3000 ms = 3 seconds
    this.subscribeToCustomerPage();
  }

  subscribeToCustomerPage(): void {
    this.acctService.getshowCustomerPage().subscribe(res => {
      if (res && res.default !== undefined) {
        this.isDifferentContentVisible = true;
      }
    });
  }

  getCRMAPIcall(): void {
    this.isLoading = true; // Set loading to true while waiting for data
    this.service.getCRMURL().subscribe(
      (data: any) => {
        this.jsonData = data;
        // Check if results or data is null
        if (!this.jsonData || !this.jsonData.results || !this.jsonData.results.data || this.jsonData.results.message !== 'Request was successful') {
          console.error('Data is null or request was not successful, redirecting to 404 page');
          this.router.navigate(['/404']); // Redirect to 404 page
          this.isLoading = false; // Ensure loading is false
          this.loadService.hide(); // Hide loading indicator
          return; // Exit early to avoid further execution
        }        
        // If data exists, continue with setting values
        this.acctService.setEmailAddress(this.jsonData.results.email);
        this.acctService.setCompCode(this.jsonData.results.data[0].CompanyCode);
        this.acctService.setTerritory(this.jsonData.terList);

        this.isLoading = false; // Set loading to false once data is loaded
        this.loadService.hide(); // Hide loading indicator
      },
      (error) => {
        console.error('Error occurred while fetching CRM data:', error);
        this.router.navigate(['/404']); // Redirect on error
        this.isLoading = false; // Ensure loading is false
        this.loadService.hide(); // Hide loading indicator
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  runOnPageLoad(): void {
    //console.log('Page is loaded, running specific code...');
    this.service.setIsDifferentContentVisible(true); // Initial state
  }

  runDifferentCode(): void {
    //console.log('Running different code...');
    this.service.setIsDifferentContentVisible(true);
  }

  setDiscountLevel(value: number): void {
    this.form.get('DiscountLevel')?.setValue(value.toString());
  }

  setPartsLevel(value: number): void {
    this.form.get('PartsLevel')?.setValue(value.toString());
  }

  setPromoCode(value: string): void {
    this.form.get('PromoCode')?.setValue(value);
  }

  demoOrder(): void {
    this.compCode = this.acctService.getCompCode();
    this.showAccountInfo = true;
    const account_number = '54321';
    this.org_name = 'Demo User';
    this.account_number = account_number;
    this.acctService.setSltDealerId(account_number);
    //this.acctService.setOrgID('82298');
    this.acctService.setOrgID('');
    this.acctService.setOrderID('0');
    const dd = [0, 0];
    this.acctService.setDiscountLevel(dd[0].toString());
    this.acctService.setPromoCode(this.deafultPromoCode);
    this.setPromoCode(this.deafultPromoCode);
    this.setDiscountLevel(dd[0]); // Ensure this is called after form initialization
    this.setPartsLevel(dd[1]);
    this.service.setIsDifferentContentVisible(false);
    let res = {'showBtn': true};
    this.acctService.emitData(res);
    // Emit data for the second emitter (e.g., Account Info visibility)
    let resAccountInfo = { showAccountInfo: true };
    this.acctService.emitShowAccountInfo(resAccountInfo);
    const op_ut = { default: true };
    this.acctService.emitDefaultPage(op_ut);
    this.form = this.fb.group({
      customerName: 'Demo User',
      DiscountLevel: [''],
      PartsLevel: [''],
      PromoCode: ['PSOSPRING']
    });
    this.makeSelectAccessible();
    this.acctService.setOrderSelected('Demo');
  }

  onAccountNumberKey(event: Event): void{
    const inputElement = event.target as HTMLInputElement;
    const orgID = inputElement.value;
    const account_number = '54321';
    this.acctService.setSltDealerId(this.account_number);
    this.acctService.setOrgID(orgID);
    //console.log('Account pressed:', account);
  }

  onCustomerNameKey(event: Event): void{
    const inputElement = event.target as HTMLInputElement;
    const name = inputElement.value;
    this.acctService.setcustomerName(name);
  }

  PromoChanged(event: MatSelectChange) {
    const selectedPromoCode = event.value;
    console.log('Promo Code changed to:', selectedPromoCode);
    this.acctService.setPromoCode(selectedPromoCode);
  }

  DiscountLevelChanged(event: Event): void {
    const eventValue = Number(event); // Convert event to number once
    let discountMap: { [key: number]: string } = {};

    // Define discount level mapping based on compCode
    if (this.compCode === 'USF') {
      discountMap = { 0: '0', 1: '1', 2: '2', 3: '3', 4: '4', 5: '6' };
    } else {
      discountMap = { 0: '0', 1: '1', 2: '2', 3: '3', 5: '5', 7: '7' };
    }
    // Set the discount level based on event value if it exists in the map
    if (discountMap.hasOwnProperty(eventValue)) {
      this.acctService.setDiscountLevel(discountMap[eventValue]);
    }
    // Emit data for the second emitter (e.g., Account Info visibility)
    const resDiscount = { showDiscount: true };
    this.acctService.emitshowDiscountEmitter(resDiscount);
  }
  
}