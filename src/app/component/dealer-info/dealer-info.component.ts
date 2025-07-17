import { Component, ViewChild, OnInit, Inject, Renderer2, ElementRef, ChangeDetectorRef, AfterViewInit, ViewChildren, QueryList,  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TemplatePopupComponent } from '../popup/template-popup/template-popup.component';
import { AddTemplatePopupComponent } from '../popup/add-template-popup/add-template-popup.component';
import { TabsResult } from 'src/app/Model/UserObject';
import { MasterService } from 'src/app/apiservice/master.service';
import { MatTableDataSource } from '@angular/material/table';
import { OrderProductList } from 'src/app/Model/UserObject';
import { DOCUMENT } from '@angular/common';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { AccountService } from 'src/app/apiservice/account.service';
import { GeneralOutputComponent } from '../popup/general-output/general-output.component';
import { HomeComponent } from '../home/home.component';
import { ProgramInformationComponent } from '../popup/program-information/program-information.component';
import { OutputMessageComponent } from '../partsportal/popup/output-message/output-message.component';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/apiservice/loader.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface OrderSummaryElement {
  shipment: string;
  total: string;
  s1: string;
  s2: string;
  s3: string;
  d1: string;
  d2: string;
  d3: string;
}

// Define the structure of the orderInputs and CostArray
export interface OrderInput {
  sku: string;
  s1: string;
  s2: string;
  s3: string;
  d1: string;
  d2: string;
  d3: string;
  cost: string;
  msrp: string;
  ayp: string;
  ext: string;
  model: string;
  desc: string;
  cat?: string;
  main_cat?: string;
  group?: string;
}

export interface CurrentOrderArray {
  sku: string;
  s1: string;
  s2: string;
  s3: string;
  d1: string;
  d2: string;
  d3: string;
  model: string;
  desc: string;
  histoy: string;
  cost: string;
  msrp: string;
  ayp: string;
  ext: string;
}

export interface CostArray {
  sku: string;
  s1: number;
  s2: number;
  s3: number;
  d1: number;
  d2: number;
  d3: number;
  ayp: string;
  cost: string;
  cat: string;
  main_cat?: string;
  group?: string;
}

export interface WheeledCostArray {
  sku: string;
  s1: number;
  s2: number;
  s3: number;
  d1: number;
  d2: number;
  d3: number;
  ayp: string;
  cost: string;
  cat: string;
  main_cat?: string;
}

export interface TotalCost {
  sku: string;
  s1: number;
  s2: number;
  s3: number;
  d1: number;
  d2: number;
  d3: number;
}

export interface WheeledTotalCost {
  sku: string;
  s1: number;
  s2: number;
  s3: number;
  d1: number;
  d2: number;
  d3: number;
}

export interface TotalValue {
  total: number;
}

export interface Result {
  sku: string;
  s1?: string;
  s2?: string;
  s3?: string;
  d1?: string;
  d2?: string;
  d3?: string;
  cost: any;
  msrp: any;
  ayp: string;
  ext: string;
  model: string;
  desc: string;
  pna: string;
  group: string;
  main_cat?: string;
  history: string;
  costs1?: string;
  costs2?: string;
  costs3?: string;
  costd1?: string;
  costd2?: string;
  costd3?: string;
  cat: string;
}

export interface VLSKUUnit{
  sku: string;
  s1: number;
  s2: number;
  s3: number;
  d1: number;
  d2: number;
  d3: number;
}

const ORDER_DATA: OrderSummaryElement[] = [
  {shipment:' ', total: 'Total Units', s1: 'S1', s2: 'S2', s3: 'S3', d1: 'D1', d2:'D2', d3:'D3'},
  {shipment:'Handheld (Gas)', total: '0', s1: '0.00', s2: '0.00', s3: '0.00', d1: '0.00', d2:'0.00', d3:'0.00'},
  {shipment:'Residential ZTR', total: '0', s1: '0.00', s2: '0.00', s3: '0.00', d1: '0.00', d2:'0.00', d3:'0.00'},
  {shipment:'TS Tractor', total: '0', s1: '0.00', s2: '0.00', s3: '0.00', d1: '0.00', d2:'0.00', d3:'0.00'},
  {shipment:'Professional ZTR', total: '0', s1: '0.00', s2: '0.00', s3: '0.00', d1: '0.00', d2:'0.00', d3:'0.00'},
  {shipment:'Other', s1: '0.00', total: '0', s2: '0.00', s3: '0.00', d1: '0.00', d2:'0.00', d3:'0.00'},
  {shipment:'Total', s1: '0.00', total: '0', s2: '0.00', s3: '0.00', d1: '0.00', d2:'0.00', d3:'0.00'},
];

@Component({
  selector: 'app-dealer-info',
  templateUrl: './dealer-info.component.html',
  styleUrls: ['./dealer-info.component.scss']
})


export class DealerInfoComponent implements OnInit, AfterViewInit{

  selectedDateS1: Date | null = null;
  selectedDateS2: Date | null = null;
  selectedDateS3: Date | null = null;
  S1minDate: Date = new Date();  // This sets the minimum date to today
  S2minDate: Date = new Date();
  S3minDate: Date = new Date();
  tablist !: TabsResult[];
  tabSource: any;
  tabdisplayedColumns: string[] = ["account_number", "name", "dis_cat", "dis_cat_desc", "financial_yr_to_date_sales", "financial_last_yr_sales"];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild('priceTable') priceTable!: ElementRef;
  displayedColumns: string[] = ['sku', 'model', 'desc', 'history', 'last_year', 's1', 's2', 's3', 'msrp', 'cost', 'ayp', 'ext'];
  displayedOrderSummaryColumns: string[] = ['shipment', 'total', 's1', 's2', 's3'];
  orderSummarySource = new MatTableDataSource<OrderSummaryElement>(ORDER_DATA);
  jsonData: any;
  products: any[] = [];
  tabs_arr: string[] = [];
  static resultsData: any[] = []; // Define the static array to store results data
  tabForm: FormGroup;
  // Initialize the arrays
  orderInputs: OrderInput[] = [];
  CurrentOrders: OrderInput[] = [];
  orderCosts: CostArray[] = [];
  overallTotals: TotalCost = { sku: 'total', s1: 0, s2: 0, s3: 0, d1: 0, d2: 0, d3: 0 };
  overallWheeledTotals: WheeledTotalCost = { sku: 'total', s1: 0, s2: 0, s3: 0, d1: 0, d2: 0, d3: 0 };
  totalVar: TotalValue = { total: 0 };
  searchTerm: string = '';
  Handheld: WheeledCostArray[] = [];
  VLHandled: VLSKUUnit[] = [];
  VLResiZTR: VLSKUUnit[] = [];
  VLTractor: VLSKUUnit[] = [];
  VLProfZTR: VLSKUUnit[] = [];
  VLOthers:  VLSKUUnit[] = [];
  showAccountInfo: boolean = false;
  showDiscountInfo: boolean = false;
  compCode: string | null = null;
  assetUrl = environment.assetUrl;
  isLoading = true; // Initialize loading state as true
  noRecords: boolean = false;
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchOrderInput') searchOrderInput!: ElementRef;
  private quantitiesByCategory: { [key: string]: number } = {};
  isTemplateCreated: boolean = false; // Initially set to false
  @ViewChild('orderSummaryPanel') orderSummaryPanel!: MatExpansionPanel;
  private dataLoaded: boolean = false;
  private skuBasedDiscountsCDA: { [sku: number]: number } = {};
  private isTokenGenerationEnabled = environment.tokenGenerationEnabled; // Add this flag in your environment file
  @ViewChildren(MatExpansionPanel) panels!: QueryList<MatExpansionPanel>;

  constructor(private cdr: ChangeDetectorRef, 
    private homeComponent: HomeComponent, 
    private accountService: AccountService, 
    private renderer: Renderer2, 
    private el: ElementRef, 
    private fb: FormBuilder, 
    private service: MasterService, 
    private dialog: MatDialog, 
    @Inject(DOCUMENT) private document: Document,
    private loaderService: LoaderService) {
    //this.loadtabs();
    this.tabForm = this.fb.group({
      tabCheckboxes: this.fb.array([])
    });
  }

  private initializeMinDates(): void {
    const today = new Date();
    this.S1minDate = this.S2minDate = this.S3minDate = new Date(today.setDate(today.getDate()));
  }

  private resetDateFields(): void {
    this.selectedDateS1 = null;
    this.selectedDateS2 = null;
    this.selectedDateS3 = null;
  }
  
  private setupOrderSubmission(): void {
    this.homeComponent.submitOrderEvent.subscribe(() => {
      this.onOrderSubmitted();
    });
  }

  private initializeTabList(): void {
    this.service.getTabs().subscribe(data => {
      this.jsonData = data;
      this.tablist = this.jsonData.results || [];
      this.tablist.unshift({ id: '0', name: 'CURRENT ORDER', subtabs: [] });
      this.cdr.detectChanges(); // Consider refactoring to avoid forcing change detection if possible
    });
  }

  private callProductListing(): void{
    this.setLoadingState(true);
    this.compCode = this.accountService.getCompCode();
    const val = 'all';
    this.service.getOrderPortalProductAPI(val,'').subscribe(data => {
        this.jsonData = data;
        this.products = this.jsonData.results;
        const disCountId = this.accountService.getDiscountLevel();
        const discountPercentageMap = this.createDiscountPercentageMap();
        const discountPercentage = disCountId && discountPercentageMap[disCountId] !== undefined ? discountPercentageMap[disCountId] : 0.00;
        this.products = this.products.map(product => {
        let cost = product.cost;
        if (!product.cost || product.cost === '') {
          product.cost = product.msrp;
        }
        // Determine the cost based on compCode
        if (this.compCode === 'USF') {
          cost = Number(product.cost); // Use updated product.cost
        } else if (this.compCode === 'CDA') {
          const discount = this.getDiscountForSubGroup(product.sku); // Fetch discount based on the sub-group
          if (discount !== undefined) {
            product.cost = Number(product.msrp * (1 - discount)); // Adjusting the discount formula
          } else {
            product.cost = Number(product.msrp);
          }
          if(product.sku == '970743801'){
            product.cost = Number('4949.18');
          }
          if(product.sku == '970743901'){
            product.cost = Number('6067.18');
          }
          cost = product.cost;
        }
        if (product.main_cat == '4151' || product.main_cat == '8051') {
          product.ayp = product.cost;
          return product;
        }else{
          const discountedCost = cost * (1 - discountPercentage);
          product.G1ATYP = product.ayp;
          product.ayp = discountedCost.toFixed(2);
          return product;
        }
      });
      this.dataSource = new MatTableDataSource<OrderProductList>(this.products);
      this.dataSource.paginator = this.paginator;
      // Ensure that sort is assigned correctly
      this.dataLoaded = true; // Flag that the data is loaded
      //this.dataSource.sort = this.sort;
      this.isLoading = false;
      this.loaderService.hide();
      this.noRecords = this.products.length === 0;
    });
  }

  public getDiscountForSubGroup(sku: number): number {
    // Return the discount if it exists, otherwise return 0
    return this.skuBasedDiscountsCDA[sku] || 0;
  }

  private setLoadingState(isLoading: boolean): void {
    this.isLoading = isLoading;
    isLoading ? this.loaderService.show() : this.loaderService.hide();
  }

  private initializeSubscriptions(): void {
    this.subscribeToDealerPop();
    this.subscribeToAccountData();
    this.subscribeToDiscountData();
  }

  login(): void {
    this.service.login().subscribe(
      (res: any) => {
        if (res && res.token) {
          // Store the login token in local storage
          localStorage.setItem('loginToken', res.token);
          // Call functions after successful login
          this.initializeSubscriptions();
          this.initializeTabList();
          this.setupOrderSubmission();
          this.initializeMinDates();
        } else {
          console.error('Login failed: Token not received.');
        }
      },
      (error) => {
        console.error('Error during login:', error);
      }
    );
  }

  ngOnInit(): void {
    if(this.compCode == 'CDA'){
      this.loadDiscounts();
    }
    if (this.isTokenGenerationEnabled) {
      this.login();
    }else{
      // Call functions after successful login
      this.initializeSubscriptions();
      this.initializeTabList();
      this.setupOrderSubmission();
      this.initializeMinDates();
    }
  }

  private loadDiscounts(): void {
    this.service.getDiscountBySKUforCDA().subscribe(data => {
      // Ensure data is an array and each item has SKU and discount
      if (Array.isArray(data)) {
        this.skuBasedDiscountsCDA = data.reduce((acc, item) => {
          if (item.sku && item.discount) {
            acc[item.sku] = item.discount;
          }
          return acc;
        }, {} as { [sku: number]: number });
      } else {
        console.error('Unexpected response format:', data);
      }
    });
  }
  

  ngAfterViewInit() {
    this.closeAllPanels();
    this.callProductListing();
  }
  
  ngAfterViewChecked() {
    if (this.dataLoaded && this.sort && !this.dataSource.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  subscribeToDealerPop(): void {
    this.accountService.getDataEmitter().subscribe(res => {
      if (res && res.showBtn !== undefined) {
        this.showAccountInfo = false;
        this.resetDateFields();
        this.resetTotals();
        this.resetOrderCosts();
        this.displayedOrderSummaryColumns = ['shipment', 'total', 's1', 's2', 's3'];
        this.displayedColumns = ['sku', 'model', 'desc', 'history', 'last_year', 's1', 's2', 's3', 'msrp', 'cost', 'ayp', 'ext'];
        this.callProductListing();
        this.ngAfterViewInit();
        this.accountService.setSubmittingStatus(false); // Enable submit Button
        this.isTemplateCreated = false;
        if (this.orderSummaryPanel.expanded) {
          this.orderSummaryPanel.expanded = false;
        }
      }
    });
  }
  
  subscribeToAccountData(): void {
    this.accountService.getShowAccountInfoEmitter().subscribe(res => {
      //alert(321);
      if (res && res.showAccountInfo !== undefined) {
        this.showAccountInfo = res.showAccountInfo;
        this.resetTotals();
        this.resetOrderCosts();
        // Update displayed columns based on showAccountInfo value
        this.updateDisplayedColumns();
        //this.ngAfterViewInit();
        this.cdr.detectChanges();  // Manually trigger change detection
      }
    });
  }

  subscribeToDiscountData(): void{
    this.accountService.getshowDiscountEmitter().subscribe(res => {
      if (res && res.showDiscount !== undefined) {
        this.resetTotals();
        this.resetOrderCosts();
        this.callProductListing();
      }
    });
  }

  updateDisplayedColumns(): void {
    if (this.showAccountInfo) {
      this.displayedOrderSummaryColumns = ['shipment', 'total', 'd1', 'd2', 'd3'];
      this.displayedColumns = ['sku', 'model', 'desc', 'history', 'last_year', 'd1', 'd2', 'd3', 'msrp', 'cost', 'ayp', 'ext'];
    } else {
      this.displayedOrderSummaryColumns = ['shipment', 'total', 's1', 's2', 's3'];
      this.displayedColumns = ['sku', 'model', 'desc', 'history', 'last_year', 's1', 's2', 's3', 'msrp', 'cost', 'ayp', 'ext'];
    }
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input) {
      this.searchTerm = input.value.toLowerCase();
      this.cdr.detectChanges(); // Force change detection if necessary
    }
  }

  getFilteredSubtabs(subtabs: string[]): string[] {
    if (!this.searchTerm) {
      return subtabs.filter(subtab => typeof subtab === 'string');
    }
    return subtabs.filter(subtab => {
      if (typeof subtab === 'string') {
        return subtab.toLowerCase().includes(this.searchTerm);
      }
      return false;
    });
  }

  // Select All function
  selectAll(tabId: string, isChecked: boolean, subtab_arr: string[]) {

    if (isChecked) {
      // Convert subtab_arr to string if needed
      this.tabs_arr.push(...subtab_arr);
      const tabidstr = subtab_arr.join(',');
      this.isLoading = true;
      this.loaderService.show();
      // Assuming `this.service` is your service that makes the API call
      this.service.getOrderPortalProductAPI(tabId, tabidstr).subscribe(
        (data: any) => {
          this.jsonData = data;
          this.products = this.jsonData.results;
          const disCountId = this.accountService.getDiscountLevel();
          const discountPercentageMap = this.createDiscountPercentageMap();
          const discountPercentage = disCountId && discountPercentageMap[disCountId] !== undefined ? discountPercentageMap[disCountId] : 0.00;

          this.products = this.products.map(product => {
            let cost = product.cost;
            if (!product.cost || product.cost === '') {
              product.cost = product.msrp;
            }
            // Determine the cost based on compCode
            if (this.compCode === 'USF') {
              cost = Number(product.cost); // Use updated product.cost
            } else if (this.compCode === 'CDA') {
              const discount = this.getDiscountForSubGroup(product.sku); // Fetch discount based on the sub-group
              if (discount !== undefined) {
                product.cost = Number(product.msrp * (1 - discount)); // Adjusting the discount formula
              } else {
                product.cost = Number(product.msrp);
              }
              if(product.sku == '970743801'){
                product.cost = Number('4949.18');
              }
              if(product.sku == '970743901'){
                product.cost = Number('6067.18');
              }
              cost = product.cost;
            }
            if (product.main_cat == '4151' || product.main_cat == '8051') {
              product.ayp = product.cost;
              return product;
            }else{
              const discountedCost = cost * (1 - discountPercentage);
              product.G1ATYP = product.ayp;
              product.ayp = discountedCost.toFixed(2);
              return product;
            }
          });
          
          this.products = this.products.map(product => {
            const matchingOrderInput = this.orderInputs.find(orderInput => orderInput.sku === product.sku);
            if (matchingOrderInput) {
              product.s1 = matchingOrderInput.s1 || '';
              product.s2 = matchingOrderInput.s2 || '';
              product.s3 = matchingOrderInput.s3 || '';
              product.d1 = matchingOrderInput.d1 || '';
              product.d2 = matchingOrderInput.d2 || '';
              product.d3 = matchingOrderInput.d3 || '';
              product.ext = matchingOrderInput.ext || '0.00';
            }
            return product;
          });
          this.dataSource = new MatTableDataSource<OrderProductList>(this.products);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
          this.loaderService.hide();
          this.noRecords = this.products.length === 0;
        },
        (error: any) => {
          this.isLoading = false;
          this.loaderService.hide();
          console.error('Error fetching products:', error);
          // Handle error as needed
        }
      );
      const allCheckboxes1 = this.el.nativeElement.querySelectorAll('.testvl input');
      allCheckboxes1.forEach((checkbox: HTMLInputElement) => {
        this.renderer.setProperty(checkbox, 'checked', isChecked);
        this.renderer.setAttribute(checkbox, 'aria-checked', isChecked.toString());
      });
      // Select all checkboxes with class 'vlchecbox' using Renderer2
      const allCheckboxes = this.el.nativeElement.querySelectorAll(`.vlchecbox${tabId} input`);
      allCheckboxes.forEach((checkbox: HTMLInputElement) => {
        this.renderer.setProperty(checkbox, 'checked', isChecked);
        this.renderer.setAttribute(checkbox, 'aria-checked', isChecked.toString());
      });
      
    }else{
      this.tabs_arr = [];
      // Deselect all checkboxes and remove 'mdc-checkbox--selected' class
      const allCheckboxes = this.el.nativeElement.querySelectorAll('input[type="checkbox"].mdc-checkbox__native-control');
      allCheckboxes.forEach((checkbox: HTMLInputElement) => {
        // Remove the 'mdc-checkbox--selected' class if it's present
        if (checkbox.classList.contains('mdc-checkbox--selected')) {
          this.renderer.removeClass(checkbox, 'mdc-checkbox--selected');
        }
        // Ensure the checkbox is unchecked
        this.renderer.setProperty(checkbox, 'checked', false);
        this.renderer.setAttribute(checkbox, 'aria-checked', 'false');
      });

      // Trigger change detection to ensure the view updates
      this.cdr.detectChanges();

      // Assuming `this.service` is your service that makes the API call
      const tabId = '0';
      this.service.getOrderPortalProductAPI(tabId, '').subscribe(
        (data: any) => {
          this.jsonData = data;
          this.products = this.jsonData.results;
          this.dataSource = new MatTableDataSource<OrderProductList>(this.products);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.noRecords = this.products.length === 0;
        },
        (error: any) => {
          console.error('Error fetching products:', error);
          // Handle error as needed
        }
      );

    }
  }

  validateNumber(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  private InputupdateOrderInputs(
    sku: string,
    inputEle: 's1' | 's2' | 's3' | 'd1' | 'd2' | 'd3',
    value: string,
    model: string,
    desc: string,
    cost: string,
    msrp: string,
    ayp: string,
    ext: string
  ): void {
    const existingEntry = this.orderInputs.find(item => item.sku === sku);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    if (existingEntry) {
      existingEntry[inputEle] = value;
      const costEntry = this.orderCosts.find(item => item.sku === sku);
      if (costEntry) {
        // Calculate the total extended cost
        const totalExt = this.calculateTotalExt(costEntry);
        // Format the extended cost as US currency and update existing entry
        existingEntry.ext = formatter.format(totalExt);
      }
    } else {
      this.orderInputs.push({ sku, s1: '', s2: '', s3: '', d1: '', d2: '', d3: '', cost, msrp, ayp, ext: formatter.format(Number(ext) || 0), model, desc });
      this.orderInputs.find(item => item.sku === sku)![inputEle] = value;
    }
  }

  private calculateTotalExt(costEntry: CostArray): number {
    // Ensure all properties are numbers before summing
    return (Number(costEntry.s1) || 0) + 
    (Number(costEntry.s2) || 0) + 
    (Number(costEntry.s3) || 0) + 
    (Number(costEntry.d1) || 0) + 
    (Number(costEntry.d2) || 0) + 
    (Number(costEntry.d3) || 0);
  }

  // Utility function to safely parse numbers, returns 0 for empty or invalid strings
  private safeParseFloat(value: string): number {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  private InputupdateOrderCosts(sku: string, inputEle: 's1' | 's2' | 's3' | 'd1' | 'd2' | 'd3', parsedCost: number, inputValue: number, element: any): void {
    const existingCostEntry = this.orderCosts.find(item => item.sku === sku);
    // Check the category and call the appropriate update method
    if (existingCostEntry) {
      existingCostEntry[inputEle] = parsedCost * inputValue;
    } else {
      const newCostEntry: CostArray = { sku: sku, s1: 0, s2: 0, s3: 0, d1: 0, d2: 0, d3: 0, ayp: element.ayp, cost: element.cost, cat: element.cat, main_cat: element.main_cat, group: element.group };
      newCostEntry[inputEle] = parsedCost * inputValue;
      this.orderCosts.push(newCostEntry);
    }
  }

  private InputupdateCurrentOrders(
    sku: string, 
    inputEle: 's1' | 's2' | 's3' | 'd1' | 'd2' | 'd3', 
    value: string, 
    model: string, 
    desc: string, 
    cost: string, 
    msrp: string, 
    ayp: string, 
    ext: string, 
    element: any
  ): void {
    const orderKeys = ['s1', 's2', 's3', 'd1', 'd2', 'd3'] as const;
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    let order = this.CurrentOrders.find(item => item.sku === sku);
  
    if (order) {
      order[inputEle] = value;
    } else {
      order = { sku, s1: '', s2: '', s3: '', d1: '', d2: '', d3: '', cost, msrp, ayp, ext, model, desc, cat: element.cat, main_cat: element.main_cat, group: element.group };
      order[inputEle] = value;
      this.CurrentOrders.push(order);
    }
  
    const costEntry = this.orderCosts.find(item => item.sku === sku);
    if (costEntry) {
      const totalExt = orderKeys.reduce((sum, key) => sum + (Number(costEntry[key]) || 0), 0);
      order.ext = formatter.format(totalExt);
    }
  }

  private calculateTotals(): void {
    this.resetTotals();
    this.orderCosts.forEach(costEntry => {
      this.overallTotals.s1 += costEntry.s1;
      this.overallTotals.s2 += costEntry.s2;
      this.overallTotals.s3 += costEntry.s3;
      this.overallTotals.d1 += costEntry.d1;
      this.overallTotals.d2 += costEntry.d2;
      this.overallTotals.d3 += costEntry.d3;
    });
    this.totalVar.total = this.orderCosts.reduce((sum, costEntry) => 
      sum + this.calculateTotalExt(costEntry), 0
    );
  }

  private resetTotals(): void {
    this.overallTotals = { sku: 'total', s1: 0, s2: 0, s3: 0, d1: 0, d2: 0, d3: 0 };
    this.totalVar.total = 0;
  }

  // Helper function to get selected value
  private getSelectedValue(orderInput: any, key: string): number {
    const quote = this.accountService.getOrderSelected();
    return quote === 'Dealer' ? orderInput[key] : orderInput[`d${key[1]}`] || 0;
  }

  // Apply discount to the item
  private applyDiscountToItem(item: any, discount: number): void {
    item.s1 = item.s1 ? item.s1_total * (1 - discount) : item.s1_total;
    item.s2 = item.s2 ? item.s2_total * (1 - discount) : item.s2_total;
    item.s3 = item.s3 ? item.s3_total * (1 - discount) : item.s3_total;
    item.d1 = item.d1 ? item.d1_total * (1 - discount) : item.d1_total;
    item.d2 = item.d2 ? item.d2_total * (1 - discount) : item.d2_total;
    item.d3 = item.d3 ? item.d3_total * (1 - discount) : item.d3_total;
  }

  private calculateAndUpdateTotals(orderCosts: any[], currentOrders: any[]) {
    // Process current orders
    currentOrders.forEach(order => {
      const aypPrice = parseFloat(order.ayp); // Convert AYP price to number
      //console.log('Current aypPrice:', aypPrice);
      const item = orderCosts.find(cost => cost.sku === order.sku);
      if (item) {
        if (order.s1) {
          item.s1_total = (parseFloat(order.s1 || '0') * aypPrice) || 0;
        }else{
          item.s1_total = order.s1;
        }
        if (order.s2) {
          item.s2_total = (parseFloat(order.s2 || '0') * aypPrice) || 0;
        }else{
          item.s2_total = order.s2;
        }
        if (order.s3) {
          item.s3_total = (parseFloat(order.s3 || '0') * aypPrice) || 0;
        }else{
          item.s3_total = order.s3;
        }
        if (order.d1) {
          item.d1_total = (parseFloat(order.d1 || '0') * aypPrice) || 0;
        }else{
          item.d1_total = order.d1;
        }
        if (order.d2) {
          item.d2_total = (parseFloat(order.d2 || '0') * aypPrice) || 0;
        }else{
          item.d2_total = order.d2;
        }
        if (order.d3) {
          item.d3_total = (parseFloat(order.d3 || '0') * aypPrice) || 0;
        }else{
          item.d3_total = order.d3;
        }
      }
    });
    //console.log('Updated orderCosts:', orderCosts);
    return orderCosts;
  }

  private updateOrderSummary(): void {
    // Get the selected quote type
    const quote = this.accountService.getOrderSelected() ?? 'Demo';
    const keys = ['s1', 's2', 's3', 'd1', 'd2', 'd3'];

    // Helper function to calculate totals
    const calculateTotals = (items: any[], keys: string[]) => {
      return items.reduce((acc, item) => {
        keys.forEach(key => {
          acc[key] += Number(item[key]) || 0;
        });
        return acc;
      }, { s1: 0, s2: 0, s3: 0, d1: 0, d2: 0, d3: 0 });
    };

    // Example category totals
    const VLHandledSKU = calculateTotals(this.VLHandled, keys);
    const VLResiZTR = calculateTotals(this.VLResiZTR, keys);
    const VLTractor = calculateTotals(this.VLTractor, keys);
    const VLProfZTR = calculateTotals(this.VLProfZTR, keys);
    const VLOthers = calculateTotals(this.VLOthers, keys);
  
    // Calculate total quantity for all entries in VLHandled
    const totalHHQuantity = this.VLHandled.reduce((acc, orderInput) => {
      const s1 = this.getSelectedValue(orderInput, 's1');
      const s2 = this.getSelectedValue(orderInput, 's2');
      const s3 = this.getSelectedValue(orderInput, 's3');
      return acc + s1 + s2 + s3;
    }, 0); // Initial accumulator is 0
    let discount: number = 0; // Initialize discount with a default value of 0
    discount = this.calculateHHDiscount(totalHHQuantity);

    // Calculate total quantity for all entries in VLResiZTR
    const totalCZQuantity = this.VLResiZTR.reduce((acc, orderInput) => {
      const s1 = this.getSelectedValue(orderInput, 's1');
      const s2 = this.getSelectedValue(orderInput, 's2');
      const s3 = this.getSelectedValue(orderInput, 's3');
      return acc + s1 + s2 + s3;
    }, 0); // Initial accumulator is 0
    const CZdiscount = this.calculateCZDiscount(totalCZQuantity);
    
    // Calculate total quantity for all entries in VLTractor
    const totalTRCQuantity = this.VLTractor.reduce((acc, orderInput) => {
      const s1 = this.getSelectedValue(orderInput, 's1');
      const s2 = this.getSelectedValue(orderInput, 's2');
      const s3 = this.getSelectedValue(orderInput, 's3');
      return acc + s1 + s2 + s3;
    }, 0);
    const TRCdiscount = this.calculateTRCDiscount(totalTRCQuantity);

    // Calculate total quantity for all entries in VLProfZTR
    const totalZTHQuantity = this.VLProfZTR.reduce((acc, orderInput) => {
      const s1 = this.getSelectedValue(orderInput, 's1');
      const s2 = this.getSelectedValue(orderInput, 's2');
      const s3 = this.getSelectedValue(orderInput, 's3');
      return acc + s1 + s2 + s3;
    }, 0);
    const ZTHdiscount = this.calculateZTHDiscount(totalZTHQuantity);

    // Calculate total quantity for all entries in VLOthers
    const totalOthersQuantity = this.VLOthers.reduce((acc, orderInput) => {
      const s1 = this.getSelectedValue(orderInput, 's1');
      const s2 = this.getSelectedValue(orderInput, 's2');
      const s3 = this.getSelectedValue(orderInput, 's3');
      return acc + s1 + s2 + s3;
    }, 0);
    const Otherdiscount = this.calculateOtherDiscount(totalOthersQuantity);

    let updated = false; // Initialize the flag
    // Assuming this.orderCosts is initialized
    this.orderCosts = this.calculateAndUpdateTotals(this.orderCosts, this.CurrentOrders);
    // Handheld totals (Gas HH)
    const handheldTotals = calculateTotals(this.orderCosts.filter(item => {
      let gasHHMainCatValues: string[];
      if(this.compCode == 'USF'){
        gasHHMainCatValues = ['1054', '6331', '2701', '6315', '6212', '2900', '6002', '6001', 
        '6013', '6320', '6334', '6324', '6314', '6332', '6311', '3300', 
        '3301', '6312', '1052'];
      }else{
        gasHHMainCatValues = ['8429', '2253', '8427', '2271', '8431', '8430',
        '2900', '6002', '6001', '6013', '6314', '1054', '6331', '2701', '6315', '6212', '6320', '6324', '1052', '6312', '3300', '2562', '6317', '6316', '6311', '3301','6332'];
      }
      // Ensure item.main_cat is defined and a string
      if (item.main_cat && gasHHMainCatValues.includes(item.main_cat)) {
        this.applyDiscountToItem(item, discount);
        updated = true;  // Set the flag to true when condition is met
        return true;
      }
      return false;
    }), keys);

    // Residential ZTR totals
    const ResidentialTotals = calculateTotals(this.orderCosts.filter(item => {
      if (item.main_cat == '9660' || item.main_cat == '9661') {  // Check for either 9660 or 9661
        this.applyDiscountToItem(item, CZdiscount);
        updated = true;  // Set the flag to true when condition is met
        return true;
      }
      return false;
    }), keys);
    // Professional totals (Comm'l ZTR)
    const ProfessionalTotals = calculateTotals(this.orderCosts.filter(item => {
      // Check if compCode is 'USF' and allow both '8434' and '9664'
      if (this.compCode === 'USF' && (item.main_cat === '8434' || item.main_cat === '9664' || item.main_cat === '7266')) {
        this.applyDiscountToItem(item, ZTHdiscount);
        updated = true;
        return true;
      }
      // Otherwise, allow only '9664'
      else if (this.compCode === 'CDA') {
        if(item.main_cat === '9664'){
          this.applyDiscountToItem(item, ZTHdiscount);
          updated = true;
          return true;
        }
      }
      return false;
    }), keys);    
    
    // Tractor totals
    const TractorTotals = calculateTotals(this.orderCosts.filter(item => {
      if (item.main_cat == '4151' || item.main_cat == '8051') {  // Check for either 4151 or 8051
        this.applyDiscountToItem(item, TRCdiscount);
        updated = true;  // Set the flag to true when condition is met
        return true;
      }
      return false;
    }), keys);

    // Other totals (items in the specified main_cat values)
    const OtherTotals = calculateTotals(this.orderCosts.filter(item => {
      let otherMainCatValues: string[];
      if(this.compCode == 'USF'){
        otherMainCatValues = [
          '8320', '8348', '6431', '9352', '2232', '2231', '9353', '8427', '2251', 
          '8428', '8429', '2271', '8431', '8430', '2253', '2281', '8432', '2562', 
          '6316', '6317', '2120', '1230', '8435', '8850', '4152', '8062', '4452', 
          '8052', '9669', '7277', '2260', '4453'
        ];      
      }else{
        otherMainCatValues = [
          '9352', '2232', '2231', '9353', '2120', '8320', '8348', '6431', '8435', '1230', '8435',
          '6430', '8432', '2281', '2260', '8428', '2251'
        ];
      }
      if (item.main_cat && otherMainCatValues.includes(item.main_cat)) {
        if (this.compCode === 'CDA' && (item.main_cat === '1230' || item.main_cat === '8435')) {
          this.applyDiscountToItem(item, Otherdiscount);
        }
        return true;
      }
      return false;
    }), keys);    
  
    // Format the totals into currency
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  
    // Helper function to calculate total for a given SKU category based on quote type
    const calculateTotalSKU = (skuCategory: any, quoteType: string): number => {
      const { s1 = 0, s2 = 0, s3 = 0, d1 = 0, d2 = 0, d3 = 0 } = skuCategory;
      return quoteType === 'Dealer' 
        ? s1 + s2 + s3 
        : d1 + d2 + d3;
    };

    // Calculate totals for each SKU category using the helper function
    const totalHandledSKU = calculateTotalSKU(VLHandledSKU, quote);
    const totalVLResiZTR = calculateTotalSKU(VLResiZTR, quote);
    const totalVLTractor = calculateTotalSKU(VLTractor, quote);
    const totalVLProfZTR = calculateTotalSKU(VLProfZTR, quote);
    const totalVLOthers = calculateTotalSKU(VLOthers, quote);

    // Grand Total of all categories
    const GrandTotal = totalHandledSKU + totalVLResiZTR + totalVLTractor + totalVLProfZTR + totalVLOthers;
    // Optionally: log the totals to verify
    //console.log({ totalHandledSKU, totalVLResiZTR, totalVLTractor, totalVLProfZTR, totalVLOthers, GrandTotal });

    const ORDER_DATA: OrderSummaryElement[] = [
      { shipment: ' ', total: 'Total Units', s1: 'S1', s2: 'S2', s3: 'S3', d1: 'D1', d2: 'D2', d3: 'D3' },
      {
        shipment: 'Handheld (Gas)',
        total: `${totalHandledSKU}`,
        s1: `${formatter.format(handheldTotals.s1)}`,
        s2: `${formatter.format(handheldTotals.s2)}`,
        s3: `${formatter.format(handheldTotals.s3)}`,
        d1: `${formatter.format(handheldTotals.d1)}`,
        d2: `${formatter.format(handheldTotals.d2)}`,
        d3: `${formatter.format(handheldTotals.d3)}`
      },
      {
        shipment: 'Residential ZTR',
        total: `${totalVLResiZTR}`,
        s1: `${formatter.format(ResidentialTotals.s1)}`,
        s2: `${formatter.format(ResidentialTotals.s2)}`,
        s3: `${formatter.format(ResidentialTotals.s3)}`,
        d1: `${formatter.format(ResidentialTotals.d1)}`,
        d2: `${formatter.format(ResidentialTotals.d2)}`,
        d3: `${formatter.format(ResidentialTotals.d3)}`
      },
      {
        shipment: 'TS Tractor',
        total: `${totalVLTractor}`,
        s1: `${formatter.format(TractorTotals.s1)}`,
        s2: `${formatter.format(TractorTotals.s2)}`,
        s3: `${formatter.format(TractorTotals.s3)}`,
        d1: `${formatter.format(TractorTotals.d1)}`,
        d2: `${formatter.format(TractorTotals.d2)}`,
        d3: `${formatter.format(TractorTotals.d3)}`
      },
      {
        shipment: 'Professional ZTR',
        total: `${totalVLProfZTR}`,
        s1: `${formatter.format(ProfessionalTotals.s1)}`,
        s2: `${formatter.format(ProfessionalTotals.s2)}`,
        s3: `${formatter.format(ProfessionalTotals.s3)}`,
        d1: `${formatter.format(ProfessionalTotals.d1)}`,
        d2: `${formatter.format(ProfessionalTotals.d2)}`,
        d3: `${formatter.format(ProfessionalTotals.d3)}`
      },
      {
        shipment: 'Other',
        total: `${totalVLOthers}`,
        s1: `${formatter.format(OtherTotals.s1)}`,
        s2: `${formatter.format(OtherTotals.s2)}`,
        s3: `${formatter.format(OtherTotals.s3)}`,
        d1: `${formatter.format(OtherTotals.d1)}`,
        d2: `${formatter.format(OtherTotals.d2)}`,
        d3: `${formatter.format(OtherTotals.d3)}`
      },
      {
        shipment: 'Total',
        total: `${GrandTotal}`,
        s1: `${formatter.format(handheldTotals.s1 + ResidentialTotals.s1 + TractorTotals.s1 + ProfessionalTotals.s1 + OtherTotals.s1)}`,
        s2: `${formatter.format(handheldTotals.s2 + ResidentialTotals.s2 + TractorTotals.s2 + ProfessionalTotals.s2 + OtherTotals.s2)}`,
        s3: `${formatter.format(handheldTotals.s3 + ResidentialTotals.s3 + TractorTotals.s3 + ProfessionalTotals.s3 + OtherTotals.s3)}`,
        d1: `${formatter.format(handheldTotals.d1 + ResidentialTotals.d1 + TractorTotals.d1 + ProfessionalTotals.d1 + OtherTotals.d1)}`,
        d2: `${formatter.format(handheldTotals.d2 + ResidentialTotals.d2 + TractorTotals.d2 + ProfessionalTotals.d2 + OtherTotals.d2)}`,
        d3: `${formatter.format(handheldTotals.d3 + ResidentialTotals.d3 + TractorTotals.d3 + ProfessionalTotals.d3 + OtherTotals.d3)}`
      }
    ];
    // Update the MatTableDataSource with the new data
    this.orderSummarySource = new MatTableDataSource(ORDER_DATA);
  }

  applyDiscount(value: number, discount: number): number {
    if (discount > 0) {
      return value * (1 - discount); // Apply discount
    }
    return value; // No discount
  }

  private updateProductsWithCurrentOrders(): void {
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    // Define main categories as constants
    const tractorMainCatValues = ['4151', '8051'];
    const resiZTRMainCatValues = ['9660', '9661'];
    const mainCatValuesMap: { [key: string]: { gasHHMainCatValues: string[], commercialZTR: string[], otherMainValues: string[] } } = {
      'USF': {
        gasHHMainCatValues: ['1054', '6331', '2701', '6315', '6212', '2900', '6002', '6001', '6013', '6320', '6334', '6324', '6314', '6332', '6311', '3300', '3301', '6312', '1052'],
        commercialZTR: ['8434', '9664', '7266'],
        otherMainValues: ['8320', '8348', '6431', '9352', '2232', '2231', '9353', '8427', '2251', '8428', '8429', '2271', '8431', '8430', '2253', '2281', '8432', '2562', '6316', '6317', '2120', '1230', '8435', '8850', '4152', '8062', '4452', '8052', '9669', '7277', '2260', '4453']
      },
      'CDA': {
        gasHHMainCatValues: ['8429', '2253', '8427', '2271', '8431', '8430', '2900', '6002', '6001', '6013', '6314', '1054', '6331', '2701', '6315', '6212', '6320', '6324', '1052', '6312', '3300', '2562', '6317', '6316', '6311', '3301','6332'],
        commercialZTR: ['8434', '7266', '7263', '9664'],
        otherMainValues: ['9352', '2232', '2231', '9353', '2120', '8320', '8348', '6431', '8435', '1230', '6430', '8432', '2281', '2260', '8428', '2251']
      }
    };

    const { gasHHMainCatValues, commercialZTR, otherMainValues } = mainCatValuesMap[this.compCode || 'USF'];

    // Helper function to calculate totals
    const calculateTotalQuantity = (categoryValues: string[]): number => {
      return this.CurrentOrders
        .filter(orderInput => typeof orderInput.main_cat === 'string' && categoryValues.includes(orderInput.main_cat))
        .reduce((acc, orderInput) => acc + this.getOrderQuantity(orderInput), 0);
    };

    const totalHHQuantity = calculateTotalQuantity(gasHHMainCatValues);
    const totalCZQuantity = calculateTotalQuantity(resiZTRMainCatValues);
    const totalTRCQuantity = calculateTotalQuantity(tractorMainCatValues);
    const totalZTHQuantity = calculateTotalQuantity(commercialZTR);
    const totalOthersQuantity = calculateTotalQuantity(otherMainValues);
    
    // Iterate over products to update with CurrentOrders data
    this.products = this.products.map(product => {
      const matchingOrderInput = this.CurrentOrders.find(orderInput => orderInput.sku === product.sku);
      if (matchingOrderInput) {
        product.s1 = matchingOrderInput.s1 || '';
        product.s2 = matchingOrderInput.s2 || '';
        product.s3 = matchingOrderInput.s3 || '';
        product.d1 = matchingOrderInput.d1 || '';
        product.d2 = matchingOrderInput.d2 || '';
        product.d3 = matchingOrderInput.d3 || '';
        // Convert the input values to numbers
        const s1 = parseFloat(matchingOrderInput.s1) || 0;
        const s2 = parseFloat(matchingOrderInput.s2) || 0;
        const s3 = parseFloat(matchingOrderInput.s3) || 0;
        const d1 = parseFloat(matchingOrderInput.d1) || 0;
        const d2 = parseFloat(matchingOrderInput.d2) || 0;
        const d3 = parseFloat(matchingOrderInput.d3) || 0;

        // Calculate the total sum of s1, s2, s3, d1, d2, d3 as numbers
        let totalValue = (s1 + s2 + s3 + d1 + d2 + d3) * (product.ayp || product.cost);
        let ext = parseFloat(matchingOrderInput.ext.replace(/[^0-9.-]+/g, '')) || 0;
        let discount: number = 0; // Initialize discount with a default value of 0
        if (matchingOrderInput.main_cat && gasHHMainCatValues.includes(matchingOrderInput.main_cat)) {
          discount = this.calculateHHDiscount(totalHHQuantity);
          totalValue = this.applyDiscount(totalValue, discount);
        } else if (matchingOrderInput.main_cat && resiZTRMainCatValues.includes(matchingOrderInput.main_cat)) {
          if (this.compCode === 'USF') {
            discount = this.calculateCZDiscount(totalCZQuantity);
          } else {
            discount = this.calculateCZDiscount(totalCZQuantity);
          }
          totalValue = this.applyDiscount(totalValue, discount);
        } else if (matchingOrderInput.main_cat && tractorMainCatValues.includes(matchingOrderInput.main_cat)) {
          if (this.compCode === 'USF') {
            discount = this.calculateTRCDiscount(totalTRCQuantity);
          }else{
            discount = this.calculateTRCDiscount(totalTRCQuantity);
          }
          totalValue = this.applyDiscount(totalValue, discount);
        } else if (matchingOrderInput.main_cat && commercialZTR.includes(matchingOrderInput.main_cat)) {
          if (this.compCode === 'USF') {
            discount = this.calculateZTHDiscount(totalZTHQuantity);
          }else if (this.compCode === 'CDA' && (matchingOrderInput.main_cat === '9664')) {
            discount = this.calculateZTHDiscount(totalZTHQuantity);
          }
          totalValue = this.applyDiscount(totalValue, discount);
        } else if (matchingOrderInput.main_cat && otherMainValues.includes(matchingOrderInput.main_cat)) {
          let discount: number = 0;
          // Check if compCode is 'CDA' and main_cat is '1230' or '8435'
          if (this.compCode === 'CDA' && (matchingOrderInput.main_cat === '1230' || matchingOrderInput.main_cat === '8435')) {
            discount = this.calculateOtherDiscount(totalOthersQuantity);
          }
          // Apply discount (even if it's 0 if conditions are not met)
          totalValue = this.applyDiscount(totalValue, discount);
        }
        // Update the product's ext value with the formatted result of totalValue
        product.ext = formatter.format(totalValue);
      }
      return product;
    });
  }
  
  // Helper function to get total quantity for each order
  private getOrderQuantity(orderInput: any): number {
    const quote = this.accountService.getOrderSelected();
    const s1 = parseInt(quote === 'Dealer' ? orderInput.s1 : orderInput.d1) || 0;
    const s2 = parseInt(quote === 'Dealer' ? orderInput.s2 : orderInput.d2) || 0;
    const s3 = parseInt(quote === 'Dealer' ? orderInput.s3 : orderInput.d3) || 0;
    return s1 + s2 + s3;
  }  

  private updateVLClassifications(element: any, inputEle: 's1' | 's2' | 's3' | 'd1' | 'd2' | 'd3', inputValue: number): void {
    const newSKUEntry: VLSKUUnit = {
      sku: element.sku,
      s1: this.safeParseFloat(element.s1),
      s2: this.safeParseFloat(element.s2),
      s3: this.safeParseFloat(element.s3),
      d1: this.safeParseFloat(element.d1),
      d2: this.safeParseFloat(element.d2),
      d3: this.safeParseFloat(element.d3),
    };
    newSKUEntry[inputEle] = inputValue;

    let gasHHMainCatValues: string[];
    if(this.compCode == 'USF'){
      gasHHMainCatValues = ['1054', '6331', '2701', '6315', '6212', '2900', '6002', '6001', 
      '6013', '6320', '6334', '6324', '6314', '6332', '6311', '3300', 
      '3301', '6312', '1052'];
    }else{
      gasHHMainCatValues = ['8429', '2253', '8427', '2271', '8431', '8430', 
      '2900', '6002', '6001', '6013', '6314', '1054', '6331', '2701', '6315', '6212', '6320', '6324', '1052', '6312', '3300', '2562', '6317', '6316', '6311', '3301','6332'];
    }
    const resiZTRMainCatValues = ['9660', '9661'];
    const tractorMainCatValues = ['4151', '8051'];
    let commZTRMainCatValues: string[]; // Declare the variable outside the if-else block
    if (this.compCode == 'USF') {
      commZTRMainCatValues = ['8434', '9664', '7266']; // Assign values if compCode is 'USF'
    } else {
      commZTRMainCatValues = ['8434', '7266', '7263', '9664']; // Assign different values otherwise
    }

    // VLHandled: Handheld (Gas) items
    if (gasHHMainCatValues.includes(element.main_cat)) {  
      this.updateOrAddToArray(this.VLHandled, newSKUEntry);
    }
    
    // VLResiZTR: Residential ZTR items
    if (resiZTRMainCatValues.includes(element.main_cat)) {
      this.updateOrAddToArray(this.VLResiZTR, newSKUEntry);
    }

    // VLTractor: TS Tractor items
    if (tractorMainCatValues.includes(element.main_cat)) {
      this.updateOrAddToArray(this.VLTractor, newSKUEntry);
    }

    // VLProfZTR: Professional ZTR items
    if (commZTRMainCatValues.includes(element.main_cat)) {
      this.updateOrAddToArray(this.VLProfZTR, newSKUEntry);
    }

    // If not updated, add to VLOthers
    if (!(
      gasHHMainCatValues.includes(element.main_cat) ||
      resiZTRMainCatValues.includes(element.main_cat) ||
      tractorMainCatValues.includes(element.main_cat) ||
      commZTRMainCatValues.includes(element.main_cat)
    )) {
      this.updateOrAddToArray(this.VLOthers, newSKUEntry);
    }
  }

  private updateOrAddToArray(array: VLSKUUnit[], entry: VLSKUUnit): void {
    const index = array.findIndex(item => item.sku === entry.sku);
    if (index >= 0) {
      array[index] = entry;  // Update existing entry
    } else {
      array.push(entry);     // Add new entry
    }
  }  

  private logUpdatedData(): void {
    console.log('Order Inputs:', this.orderInputs);
    console.log('Order Costs:', this.orderCosts);
    console.log('Current Orders:', this.CurrentOrders);
    console.log('VL Handled:', this.VLHandled);
    console.log('VL ResiZTR:', this.VLResiZTR);
    console.log('VL Tractor:', this.VLTractor);
    console.log('VL Others:', this.VLOthers);
    console.log('Overall Totals:', this.overallTotals);
    console.log('Total Value:', this.totalVar);
  }

  // Add this method to calculate HH Gas Promo discount
  private calculateHHDiscount(quantity: number): number {
    if (this.compCode === 'USF') {
      if (quantity >= 120) return 0.05; // 5%
      if (quantity >= 90) return 0.04;  // 4%
      if (quantity >= 60) return 0.03;  // 3%
      if (quantity >= 30) return 0.02;  // 2%
      return 0; // No discount
    }else{
      return 0; // No discount
    }
  }
  
  // Function to calculate discount for 'CZ' category
  private calculateCZDiscount(quantity: number): number {
    if (this.compCode === 'USF') {
      return quantity >= 48 ? 0.03 : 
      quantity >= 24 ? 0.02 : 
      quantity >= 12 ? 0.01 : 
      0;
    }else{
      return quantity >= 24 ? 0.03 : 
      quantity >= 12 ? 0.02 : 
      quantity >= 6 ? 0.01 : 
      0;
    }
  }

  private calculateTRCDiscount(quantity: number): number {
    if (this.compCode === 'USF') {
      return quantity >= 48 ? 0.06 : 
      quantity >= 24 ? 0.04 : 
      quantity >= 12 ? 0.02 : 
      0;
    }else{
      return 0;
    }
  }

  private calculateZTHDiscount(quantity: number): number {
    if (this.compCode === 'USF') {
      return quantity >= 24 ? 0.05 :
      quantity >= 16 ? 0.04 :
      quantity >= 10 ? 0.03 :
      quantity >= 4  ? 0.02 :
      0;
    } else {
      return quantity >= 24 ? 0.03 : 
      quantity >= 12 ? 0.02 : 
      quantity >= 6 ? 0.01 : 
      0;
    }
  }

  private calculateOtherDiscount(quantity: number): number {
    if (this.compCode === 'CDA') {
      return quantity >= 12 ? 0.06 :
      quantity >= 8 ? 0.04 :
      quantity >= 4 ? 0.02 :
      0;
    } else {
      return 0;
    }
  }

  onInputChange(
    event: Event,
    element: any,
    sku: string,
    inputEle: 's1' | 's2' | 's3' | 'd1' | 'd2' | 'd3',
    cost: string,
    msrp: string,
    model: string,
    desc: string,
    ayp: string,
    ext: string
  ): void {
    // console.log('VL elements group: ' + element.group);
    // console.log('VL elements cat: ' + element.cat);
    // console.log('VL elements main_cat: ' + element.main_cat);
    const inputElement = event.target as HTMLInputElement;
    const trimmedValue = inputElement.value.trim(); // Trim leading/trailing spaces
    // If trimmedValue is blank or undefined, set element.order to 0
    element.order = (!trimmedValue || trimmedValue === '') ? '0' : trimmedValue;

    const inputValue = parseFloat(element.order) || 0;
    const parsedCost = parseFloat(ayp) || 0;
    this.accountService.setOrderFilled(element.order.trim() !== '');
    // Update or create entries
    this.InputupdateOrderInputs(sku, inputEle, inputElement.value, model, desc, cost, msrp, ayp, ext);
    this.InputupdateOrderCosts(sku, inputEle, parsedCost, inputValue, element);
    this.InputupdateCurrentOrders(sku, inputEle, inputElement.value, model, desc, cost, msrp, ayp, ext, element);

    // Update updateVLClassifications
    this.updateVLClassifications(element, inputEle, Number(inputElement.value));

    // Recalculate totals
    this.calculateTotals();
    // Update data source
    this.updateOrderSummary();
    // Update products with values from CurrentOrders
    this.updateProductsWithCurrentOrders();
    // Log updated data
    // this.logUpdatedData();
  }

  // Getter for tabCheckboxes FormArray
  get tabCheckboxes(): FormArray {
    return this.tabForm.get('tabCheckboxes') as FormArray;
  }

  openTemplatePopup(): void {
    const dialogRef = this.dialog.open(TemplatePopupComponent);
    dialogRef.componentInstance.elementEdited.subscribe((data: any) => {
      this.handleEditElement(data);
    });
  }

  handleEditElement(data: any): void {
    
    this.resetOrderCosts();
    this.setOrderDetails(data.order_details);
    DealerInfoComponent.resultsData = data.results;
    const discountPercentageMap = this.createDiscountPercentageMap();

    if (data.results && Array.isArray(data.results)) {
      this.products = data.results;
      this.processResults(data.results);
      // Iterate over each result and update classifications
      this.products.forEach(product => {
        // Assume 's1' and 'cost' as placeholders for inputEle and inputValue, replace accordingly
        this.updateVLClassifications(product, 's1', Number(product.s1 || 0)); 
      });
      this.calculateTotals();
      this.updateOrderSummary();
      // Update products with values from CurrentOrders
      this.updateProductsWithCurrentOrders();
      this.accountService.setSubmittingStatus(false); // Enable submit Button
      this.isTemplateCreated = true;
      this.resetDateFields();
      //this.accountService.setOrderID('0');
      //this.updateProductData();
      // Log updated data
      //this.logUpdatedData();
    }

    const disCountId = this.accountService.getDiscountLevel();
    //console.log('VL loaded Discount' + disCountId);
    const discountPercentage = disCountId && discountPercentageMap[disCountId] !== undefined ? discountPercentageMap[disCountId] : 0.00;
    this.products = this.products.map(product => {
      const matchingOrderInput = this.CurrentOrders.find(orderInput => orderInput.sku === product.sku);
      if (matchingOrderInput) {
        product.s1 = matchingOrderInput.s1 || '';
        product.s2 = matchingOrderInput.s2 || '';
        product.s3 = matchingOrderInput.s3 || '';
        product.d1 = matchingOrderInput.d1 || '';
        product.d2 = matchingOrderInput.d2 || '';
        product.d3 = matchingOrderInput.d3 || '';
        // Convert ext to number, default to 0 if NaN, and format as currency
        product.ext = matchingOrderInput.ext;
        let cost = product.cost;
        if (!product.cost || product.cost === '') {
          product.cost = product.msrp;
        }
        // Determine the cost based on compCode
        if (this.compCode === 'USF') {
          cost = Number(product.cost); // Use updated product.cost
        } else if (this.compCode === 'CDA') {
          const discount = this.getDiscountForSubGroup(product.sku); // Fetch discount based on the sub-group
          if (discount !== undefined) {
            product.cost = Number(product.msrp * (1 - discount)); // Adjusting the discount formula
          } else {
            product.cost = Number(product.msrp);
          }
          if(product.sku == '970743801'){
            product.cost = Number('4949.18');
          }
          if(product.sku == '970743901'){
            product.cost = Number('6067.18');
          }
          cost = product.cost;
        }
        const discountedCost = cost * (1 - discountPercentage);
        product.G1ATYP = product.ayp;
        product.ayp = discountedCost.toFixed(2);
        // Define formatter to format numbers as currency
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });
        let extValue = product.ext.toString().replace(/[$,]/g, ''); // Remove $ and commas
        let numericExt = parseFloat(extValue); // Convert to a number
        let discountedExt = numericExt * (1 - discountPercentage);
        product.ext = formatter.format(discountedExt);
      }
      //this.onInputChange('',product.sku,'s1',product.cost,product.msrp,product.model,product.desc,product.ayp,product.ext);
      return product;
    });
    this.dataSource.data = this.products;
    this.noRecords = this.products.length === 0;
  }

  private createDiscountPercentageMap(): { [key: string]: number } {
    const compCode = this.accountService.getCompCode();
    if(compCode == 'USF'){
      return {
        '0': 0.00,
        '1': 0.01,
        '2': 0.02,
        '3': 0.03,
        '4': 0.04,
        '5': 0.06,
      };
    }else{
      return {
        '0': 0.00,
        '1': 0.01,
        '2': 0.02,
        '3': 0.03,
        '5': 0.05,
        '7': 0.07,
      };
    }
  }

  private resetOrderCosts(): void {
    this.CurrentOrders = [];
    this.orderInputs = [];
    this.orderCosts = [];
    this.Handheld = [];
    this.VLHandled = [];
    this.VLResiZTR = [];
    this.VLTractor = [];
    this.VLProfZTR = [];
    this.VLOthers = [];
    this.orderSummarySource = new MatTableDataSource<OrderSummaryElement>(ORDER_DATA);
  }

  private setOrderDetails(orderDetails: any[]): void {
    if (orderDetails && orderDetails.length > 0) {
      const orderId = orderDetails[0].id;
      this.accountService.setOrderID(orderId);
      this.selectedDateS1 = orderDetails[0].s1_ship ? new Date(orderDetails[0].s1_ship) : null;
      this.selectedDateS2 = orderDetails[0].s2_ship ? new Date(orderDetails[0].s2_ship) : null;
      this.selectedDateS3 = orderDetails[0].s3_ship ? new Date(orderDetails[0].s3_ship) : null;
    } else {
      console.error('Order details are missing or empty');
      return;
    }
  }
  
  private processResults(results: Result[]): void {
    results.forEach((result: Result) => {
      let cost: number = typeof result.cost === 'string' ? parseFloat(result.cost) : result.cost || 0;
      if (this.compCode === 'USF') {
        cost = Number(result.cost); // Use updated product.cost
      } else if (this.compCode === 'CDA') {
        const discount: number = this.getDiscountForSubGroup(Number(result.sku)) ?? 0;
        if(result.sku == '970743801'){
          result.cost = Number('4949.18');
        }
        if(result.sku == '970743901'){
          result.cost = Number('6067.18');
        }
        result.cost = result.msrp * (1 - discount);
        cost = result.cost;
      }
      this.updateOrderInputs(result);
      this.updateCurrentOrders(result);
      this.updateOrderCosts(result);
    });
  }

  private updateOrderInputs(result: Result): void {
    const existingEntry = this.orderInputs.find(item => item.sku === result.sku);
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
    // Convert result.ext to a number and format it
    const extValue = parseFloat(result.ext) || 0; // Default to 0 if conversion fails
    const newEntry: OrderInput = {
      sku: result.sku,
      s1: result.s1 || '',
      s2: result.s2 || '',
      s3: result.s3 || '',
      d1: result.d1 || '',
      d2: result.d2 || '',
      d3: result.d3 || '',
      cost: result.cost || '',
      msrp: result.msrp || '',
      ayp: result.ayp || '',
      ext: formatter.format(extValue), // Format the numeric value
      model: result.model || '',
      desc: result.desc || ''
    };
  
    if (existingEntry) {
      Object.assign(existingEntry, newEntry);
    } else {
      this.orderInputs.push(newEntry);
    }
  }
  
  private updateCurrentOrders(result: Result): void {  
    const existingCurrentOrderEntry = this.CurrentOrders.find(item => item.sku === result.sku);
    const existingProductEntry      = this.products.find(item => item.sku === result.sku);
    const s1 = Number(result.s1) || 0;
    const s2 = Number(result.s2) || 0;
    const s3 = Number(result.s3) || 0;
    const d1 = Number(result.d1) || 0;
    const d2 = Number(result.d2) || 0;
    const d3 = Number(result.d3) || 0;
    const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
  
    const disCountId = this.accountService.getDiscountLevel();
    const discountPercentageMap = this.createDiscountPercentageMap();
    const discountPercentage = disCountId && discountPercentageMap[disCountId] !== undefined ? discountPercentageMap[disCountId] : 0.00;
  
    // Parse the actual cost as a number
    let Actualcost = result.cost;
    if (!Actualcost || Actualcost === '') {
      Actualcost = result.msrp;
    }
  
    // Determine the cost based on compCode
    if (this.compCode === 'USF') {
      Actualcost = result.cost; // Use updated product.cost
    } else if (this.compCode === 'CDA') {
      Actualcost = result.cost; // Use msrp for CDA
    }
  
    // Calculate discounted cost and ensure it's a number for further operations
    const discountedCost = Number(Actualcost) * (1 - discountPercentage);
  
    // Convert discounted cost to a number with 2 decimal places
    const last_ayp = parseFloat(discountedCost.toFixed(2));
  
    const newCurrentOrderEntry: OrderInput = {
      sku: result.sku,
      s1: result.s1 || '',
      s2: result.s2 || '',
      s3: result.s3 || '',
      d1: result.d1 || '',
      d2: result.d2 || '',
      d3: result.d3 || '',
      cost: result.cost || '',
      msrp: result.msrp || '',
      ayp: last_ayp.toString(), // Convert number to string for 'ayp'
      model: result.model || '',
      desc: result.desc || '',
      cat: result.cat || '',
      group: result.group || '',
      main_cat: result.main_cat || '',
      ext: formatter.format(
        ((parseFloat(result.s1 || '0') +
          parseFloat(result.s2 || '0') +
          parseFloat(result.s3 || '0') +
          parseFloat(result.d1 || '0') +
          parseFloat(result.d2 || '0') +
          parseFloat(result.d3 || '0')) *
        parseFloat(result.cost || '0'))
      ),
    };
  
    if (existingCurrentOrderEntry) {
      Object.assign(existingCurrentOrderEntry, newCurrentOrderEntry);
    } else {
      this.CurrentOrders.push(newCurrentOrderEntry);
    }
    if(existingProductEntry){
      Object.assign(existingProductEntry, newCurrentOrderEntry);
    }else{
      this.products.push(newCurrentOrderEntry);
    }
  }  
  
  private updateOrderCosts(result: Result): void {
    
    const disCountId = this.accountService.getDiscountLevel();
    const discountPercentageMap = this.createDiscountPercentageMap();
    const discountPercentage = disCountId && discountPercentageMap[disCountId] !== undefined ? discountPercentageMap[disCountId] : 0.00;
    
    // Parse the actual cost as a number
    let Actualcost = result.cost;
    if (!Actualcost || Actualcost === '') {
      Actualcost = result.msrp;
    }
    // Determine the cost based on compCode
    if (this.compCode === 'USF') {
      Actualcost = result.cost; // Use updated product.cost
    } else if (this.compCode === 'CDA') {
      Actualcost = result.cost; // Use msrp for CDA
    }
    // Calculate discounted cost and ensure it's a number for further operations
    const discountedCost = Number(Actualcost) * (1 - discountPercentage);
    
    // Convert discounted cost to string with 2 decimal places, but retain number for calculations
    const cost = parseFloat(discountedCost.toFixed(2));
    // Calculate s1Cost, s2Cost, etc., using numeric `cost`
    const s1Cost = (parseFloat(result.s1 || '0') * cost) || 0;
    const s2Cost = (parseFloat(result.s2 || '0') * cost) || 0;
    const s3Cost = (parseFloat(result.s3 || '0') * cost) || 0;
    const d1Cost = (parseFloat(result.d1 || '0') * cost) || 0;
    const d2Cost = (parseFloat(result.d2 || '0') * cost) || 0;
    const d3Cost = (parseFloat(result.d3 || '0') * cost) || 0;
    
    // Create the new cost entry
    const newCostEntry: CostArray = {
      sku: result.sku,
      s1: Number(s1Cost),
      s2: s2Cost,
      s3: s3Cost,
      d1: d1Cost,
      d2: d2Cost,
      d3: d3Cost,
      ayp: result.cost,
      cost: result.cost,
      cat: result.cat,
      group: result.group,
      main_cat: result.main_cat
    };
    
    // Push the new cost entry to the array
    this.orderCosts.push(newCostEntry);
    //console.log('Updated this.orderCosts:', this.orderCosts);
  }

  onPanelChange(expanded: boolean, item: any): void {
    console.log('VL expanded' , expanded);
    if (expanded) {
      // Perform actions when the panel is expanded
      this.MainTabfunc(item.id, item.subtabs);
      if (this.searchOrderInput && this.searchOrderInput.nativeElement) {
        this.searchOrderInput.nativeElement.value = '';
        // Manually trigger the search event to handle any necessary updates
        this.onSearch({ target: this.searchOrderInput.nativeElement } as Event);
      }
    }else{
      // Perform actions when the panel is collapsed
      if (this.searchInput && this.searchInput.nativeElement) {
        this.searchInput.nativeElement.value = '';
        // Manually trigger the search event to handle any necessary updates
        this.onSearch({ target: this.searchInput.nativeElement } as Event);
      }
    }
  }

  closeAllPanels(): void {
    this.panels.forEach(panel => {
      panel.close();  // Close each panel programmatically
    });
  }

  MainTabfunc(data: any, subtab_arr: string[]): void {
    console.log('Handle Element Data:', data);
  
    // Remove duplicates from subtab_arr using Set
    subtab_arr = Array.from(new Set(subtab_arr));
  
    // Deselect all checkboxes if 'Select All' is unchecked
    const allCheckboxes1 = this.el.nativeElement.querySelectorAll('.testvl input');
    allCheckboxes1.forEach((checkbox: HTMLInputElement) => {
      this.renderer.setProperty(checkbox, 'checked', false);
    });
  
    const allCheckboxes2 = this.el.nativeElement.querySelectorAll('.maintab input');
    allCheckboxes2.forEach((checkbox: HTMLInputElement) => {
      this.renderer.setProperty(checkbox, 'checked', false);
    });
  
    if (data == 0 && this.CurrentOrders) {
      // Assign current orders if data is 0
      this.dataSource.data = this.CurrentOrders;
      // Check if the results are empty
      this.noRecords = this.CurrentOrders.length === 0;
    } else {
      this.tabs_arr = subtab_arr; // Set unique subtabs array
      this.selectAll(data, true, subtab_arr); // Handle the selection logic
      this.dataSource.data = DealerInfoComponent.resultsData;
    }
  }  

  openAddTemplatePopup(): void {
    this.accountService.setOrderID('0');
    const dialogRef = this.dialog.open(AddTemplatePopupComponent);
  
    dialogRef.componentInstance.templateSaved.subscribe((data: any) => {
      const formData = this.OPbuildFormData(data); // Refactor to use a helper method
  
      this.service.saveOrder(formData).subscribe(
        res => {
          this.jsonData = res;
          this.accountService.setOrderID(this.jsonData.OrderID); // Store OrderID in the service
          const output = { message: this.jsonData.message, reload: false };
          this.dialog.open(GeneralOutputComponent, { data: output });
          this.isTemplateCreated = true;
        },
        error => {
          console.error('Error saving order:', error);
          this.handleSaveError(error);
        }
      );
    });
  }
  
  /**
   * Helper method to build FormData
   */
  private OPbuildFormData(data: any): FormData {
    const formData = new FormData();
    
    formData.append('templatename', data);
    this.accountService.setcustomerName(data || '');
    formData.append('compCode', 'USF');
    formData.append('totalVar', JSON.stringify(this.totalVar)); // Convert to a string
    formData.append('orderInputs', JSON.stringify(this.orderInputs)); // Ensure proper serialization
  
    // Append OrderID with default value of '0' if null
    formData.append('OrderID', this.getValueOrDefault(this.accountService.getOrderID(), '0'));
  
    // Append orgID with default value of '0' if null
    formData.append('orgID', this.getValueOrDefault(this.accountService.getOrgID(), '0'));
  
    // Append acctNum with default value of '0' if null
    formData.append('acctNum', this.getValueOrDefault(this.accountService.getOrderPortalAccountNumber(), '0'));
  
    // Append agent ID (aid) with a default value of '0' if null, and log a warning if missing
    const aid = this.accountService.getAgentId();
    if (aid !== null) {
      formData.append('aid', aid);
    } else {
      console.warn('Agent ID is null. Using default value.');
      formData.append('aid', '0');
    }
  
    // Append selected dates if available
    this.appendDateToForm(formData, 'selectedDateS1', this.selectedDateS1);
    this.appendDateToForm(formData, 'selectedDateS2', this.selectedDateS2);
    this.appendDateToForm(formData, 'selectedDateS3', this.selectedDateS3);
  
    // Append promo code with default value if missing
    formData.append('promoCode', this.getValueOrDefault(this.accountService.getPromoCode(), 'PSOSPRING'));
  
    return formData;
  }
  
  /**
   * Helper method to append a date to FormData
   */
  private appendDateToForm(formData: FormData, fieldName: string, date: Date | null): void {
    if (date) {
      formData.append(fieldName, date.toISOString());
    } else {
      console.warn(`${fieldName} is null.`);
    }
  }
  
  /**
   * Helper method to return a default value if the provided value is null
   */
  private getValueOrDefault(value: any, defaultValue: any): any {
    return value !== null ? value : defaultValue;
  }  

  onOrderSubmitted(): void {
    this.accountService.setOrderID('0');
    if (!this.totalVar.total) {
      this.showDialog('You have not created any order elements. Please fill in the order elements and then try to submit the order.');
      return;
    }
  
    // Perform date validation
    const dateValidationResult = this.validateOrderDates();
    if (!dateValidationResult.isValid) {
      this.dialog.open(GeneralOutputComponent, { data: { message: dateValidationResult.message, reload: false } });
      return; // Prevent order submission
    }
  
    const formData = this.buildFormData();
    this.service.saveOrder(formData).subscribe(
      res => {
        this.jsonData = res;
        this.accountService.setOrderID(this.jsonData.OrderID); // Store OrderID in the service
        this.dialog.open(OutputMessageComponent, { data: { message: res } });
        this.accountService.setSubmittingStatus(true); // Disable submit button after successful submission
      },
      error => {
        console.error('Error saving order:', error);
        this.dialog.open(OutputMessageComponent, { data: { message: 'Error submitting the order. Please try again later.', reload: false } });
      }
    );
  }
  
  // Separate function for date validation
  private validateOrderDates(): { isValid: boolean, message: string } {
    let isDateMissing = false;
    let message = '';
  
    let isS1MessageShown = false;
    let isS2MessageShown = false;
    let isS3MessageShown = false;
  
    this.CurrentOrders.forEach(order => {
      if (order.s1 && !this.selectedDateS1 && !isS1MessageShown) {
        isDateMissing = true;
        message += 'Please fill in the date for S1.\n'; // Add new line
        isS1MessageShown = true; // Ensure message is only shown once
      }
      if (order.s2 && !this.selectedDateS2 && !isS2MessageShown) {
        isDateMissing = true;
        message += 'Please fill in the date for S2.\n'; // Add new line
        isS2MessageShown = true; // Ensure message is only shown once
      }
      if (order.s3 && !this.selectedDateS3 && !isS3MessageShown) {
        isDateMissing = true;
        message += 'Please fill in the date for S3.\n'; // Add new line
        isS3MessageShown = true; // Ensure message is only shown once
      }
    });
  
    // Trim the message to remove trailing newlines
    message = message.trim();
    return { isValid: !isDateMissing, message };
  }    
  
  // Separate function for building FormData
  private buildFormData(): FormData {
    const formData = new FormData();
    const aid = this.accountService.getAgentId() || '0';
    const OrderID = this.accountService.getOrderID() || '0';
    const orgID = this.accountService.getOrgID() || '0';
    const acctNum = this.accountService.getOrderPortalAccountNumber() || '0';
    const promoCode = this.accountService.getPromoCode() || 'PSOSPRING';
    const AgentEmail = this.accountService.getEmalAddress() || '';
  
    formData.append('power_submit', '1');
    formData.append('compCode', this.compCode || 'USF');
    formData.append('totalVar', JSON.stringify(this.totalVar));
    formData.append('orderInputs', JSON.stringify(this.orderInputs));
    formData.append('OrderID', OrderID);
    formData.append('orgID', orgID);
    formData.append('aid', aid);
    formData.append('acctNum', acctNum);
    formData.append('agentEmail', AgentEmail);
    formData.append('promoCode', promoCode);
    this.appendFieldToFormData(formData, 'customerName', this.accountService.getcustomerName(), '');
  
    // Add selected dates if they exist
    if (this.selectedDateS1) formData.append('selectedDateS1', this.formatDateWithoutTimezone(this.selectedDateS1));
    if (this.selectedDateS2) formData.append('selectedDateS2', this.formatDateWithoutTimezone(this.selectedDateS2));
    if (this.selectedDateS3) formData.append('selectedDateS3', this.formatDateWithoutTimezone(this.selectedDateS3));
  
    return formData;
  }

  // Custom function to format date as YYYY-MM-DD without timezone issues
  private formatDateWithoutTimezone(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Ensure 2 digits for month
    const day = ('0' + date.getDate()).slice(-2); // Ensure 2 digits for day
    return `${year}-${month}-${day}`;
  }

  saveTemplate(): void {
    if (!this.totalVar.total) {
      this.showDialog('You have not created any order elements. Please fill in the order elements and then try to Save the template.');
      return;
    }
  
    const formData = this.SavebuildFormData();
  
    this.service.saveOrder(formData).subscribe(
      res => {
        this.jsonData = res;
        this.accountService.setOrderID(this.jsonData.OrderID); // Store OrderID in the service
        this.showDialog(this.jsonData.message);
      },
      error => {
        console.error('Error saving order:', error);
        this.handleSaveError(error);
      }
    );
  }
  
  /**
   * Helper method to build FormData
   */
  private SavebuildFormData(): FormData {
    const formData = new FormData();
  
    formData.append('totalVar', JSON.stringify(this.totalVar));
    formData.append('compCode', this.compCode || 'USF');
    formData.append('orderInputs', JSON.stringify(this.orderInputs));
  
    this.appendFieldToFormData(formData, 'OrderID', this.accountService.getOrderID());
    this.appendFieldToFormData(formData, 'orgID', this.accountService.getOrgID());
    this.appendFieldToFormData(formData, 'aid', this.accountService.getAgentId(), '0');
    this.appendDateToFormData(formData, 'selectedDateS1', this.selectedDateS1);
    this.appendDateToFormData(formData, 'selectedDateS2', this.selectedDateS2);
    this.appendDateToFormData(formData, 'selectedDateS3', this.selectedDateS3);
    this.appendFieldToFormData(formData, 'acctNum', this.accountService.getOrderPortalAccountNumber());
    this.appendFieldToFormData(formData, 'customerName', this.accountService.getcustomerName(), '');
    this.appendFieldToFormData(formData, 'promoCode', this.accountService.getPromoCode(), 'PSOSPRING');
  
    return formData;
  }
  
  /**
   * Helper method to append a field to FormData with a default value if null
   */
  private appendFieldToFormData(formData: FormData, fieldName: string, value: any, defaultValue: string = '0'): void {
    formData.append(fieldName, value !== null ? value : defaultValue);
  }
  
  /**
   * Helper method to append a date to FormData
   */
  private appendDateToFormData(formData: FormData, fieldName: string, date: Date | null): void {
    if (date) {
      formData.append(fieldName, date.toISOString());
    } else {
      console.warn(`${fieldName} is null.`);
    }
  }
  
  /**
   * Show dialog with a message
   */
  private showDialog(message: string): void {
    this.dialog.open(GeneralOutputComponent, { data: { message, reload: false } });
  }
  
  /**
   * Handle errors for saving order
   */
  private handleSaveError(error: any): void {
    if (error.status === 400) {
      this.showDialog('You need to fill in the S1, S2, or S3 quantity before creating a template.');
    } else {
      this.showDialog('An error occurred while saving the template.');
    }
  }  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isChecked(tab: string): boolean {
    // Check if the tab is in the tabs_arr to determine whether it's checked
    return this.tabs_arr.includes(tab);
  }

  onCheckboxChange(event: MatCheckboxChange, mainTabId: string) {
    const checkbox = event.source;  // Use the MatCheckbox event source to access the checkbox
    const isChecked = event.checked;
    const checkboxId = checkbox.id;
    
    // Handle adding or removing the tab from the array
    if (isChecked) {
      this.tabs_arr.push(checkboxId);
    } else {
      this.tabs_arr = this.tabs_arr.filter(id => id !== checkboxId);
    }
    const tabidstr = this.tabs_arr.join(",");
    this.isLoading = true;
    this.loaderService.show();
    this.service.getOrderPortalProductAPI(mainTabId,tabidstr).subscribe(data => {
      this.jsonData = data;
      this.products = this.jsonData.results;
      const disCountId = this.accountService.getDiscountLevel();
      //console.log('VL Discount: ' + disCountId);
      // Map discount levels to discount percentages
      const discountPercentageMap = this.createDiscountPercentageMap();
      // Ensure disCountId is a valid string and exists in the map
      const discountPercentage = disCountId && discountPercentageMap[disCountId] !== undefined ? discountPercentageMap[disCountId] : 0.00;
      this.products = this.products.map(product => {
        let cost = product.cost;
        if (!product.cost || product.cost === '') {
          product.cost = product.msrp;
        }
        // Determine the cost based on compCode
        if (this.compCode === 'USF') {
          cost = Number(product.cost); // Use updated product.cost
        } else if (this.compCode === 'CDA') {
          const discount = this.getDiscountForSubGroup(product.sku); // Fetch discount based on the sub-group
          if (discount !== undefined) {
            product.cost = Number(product.msrp * (1 - discount)); // Adjusting the discount formula
          } else {
            product.cost = Number(product.msrp);
          }
          if(product.sku == '970743801'){
            product.cost = Number('4949.18');
          }
          if(product.sku == '970743901'){
            product.cost = Number('6067.18');
          }
          cost = product.cost;
        }
        // Calculate AYP as cost minus discount percentage
        if (product.main_cat == '4151' || product.main_cat == '8051') {
          product.ayp = product.cost;
          return product;
        }else{
          const cost = Number(product.cost);
          const discountedCost = cost * (1 - discountPercentage);
          product.ayp = discountedCost.toFixed(2);
          return product;
        }
      });
      // Update products with values from orderInputs
      this.products = this.products.map(product => {
        const matchingOrderInput = this.orderInputs.find(orderInput => orderInput.sku === product.sku);
        if (matchingOrderInput) {
          product.s1 = matchingOrderInput.s1 || '';
          product.s2 = matchingOrderInput.s2 || '';
          product.s3 = matchingOrderInput.s3 || '';
          product.d1 = matchingOrderInput.d1 || '';
          product.d2 = matchingOrderInput.d2 || '';
          product.d3 = matchingOrderInput.d3 || '';
          product.ext = matchingOrderInput.ext || '0';
        }
        return product;
      });
      this.dataSource = new MatTableDataSource<OrderProductList>(this.products);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.isLoading = false;
      this.loaderService.hide();
      this.noRecords = this.products.length === 0;
    });
  }

  generatePDF(): void {
    // Helper function to append form data
    const appendFormData = (key: string, value: any) => {
      formData.append(key, value || '');
    };
    // Create FormData object
    const formData = new FormData();
    const orgID = this.accountService.getOrgID() || '';
    const OrderID = this.accountService.getOrderID() || 0;
    // Append form data values
    appendFormData('orderID', this.accountService.getOrderID());
    appendFormData('orgID', this.accountService.getOrgID());
    appendFormData('customerName', this.accountService.getcustomerName());
    appendFormData('disCountId', this.accountService.getDiscountLevel());
    appendFormData('compCode', this.compCode || 'USF');

    // Append orderInputs if not empty
    if (this.orderInputs.length > 0) {
      this.orderInputs.forEach((input, index) => {
        formData.append(`orderInputs[${index}][sku]`, input.sku.toString());
        formData.append(`orderInputs[${index}][cost]`, input.cost.toString());
        formData.append(`orderInputs[${index}][msrp]`, input.msrp.toString());
        formData.append(`orderInputs[${index}][ayp]`, input.ayp.toString());
      });
    }
    // Ensure that OrderID and orgID are not empty before making the request
    const isOrderIDValid = OrderID && OrderID !== '0'; // Check if OrderID is neither empty nor '0'
    if (isOrderIDValid) {
      this.service.generatePDF(formData).subscribe(
        (data: Blob) => {
          //console.log('Download response:', data);
          const blob = new Blob([data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          const a = document.createElement('a');
          a.href = url;
          a.download = `order-export-${orgID}.pdf`; // Set the file name
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        },
        error => {
          console.error('Error generating PDF:', error);
        }
      );
    } else {
      let output = { message: 'You have not created or loaded any templates. Please create or choose a template to download the PDF version.', 'reload': false };
      this.dialog.open(GeneralOutputComponent, { data: output });
    }
  }

  programInformation(){
    const dialogRef = this.dialog.open(ProgramInformationComponent);
  }

}