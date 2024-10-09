import { Component, OnInit, ViewChild, ElementRef, Renderer2, Inject, AfterViewInit } from '@angular/core';
import { ClearconfirmationComponent } from '../popup/clearconfirmation/clearconfirmation.component';
import { LegendsComponent } from '../popup/legends/legends.component';
import { MatDialog } from '@angular/material/dialog';
import { AdditemComponent } from '../popup/additem/additem.component';
import { SuggestComponent } from '../popup/suggest/suggest.component';
import { ImportorderComponent } from '../popup/importorder/importorder.component';
import { MasterService } from 'src/app/apiservice/master.service';
import { PartProducts } from 'src/app/Model/UserObject';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { AccountService } from 'src/app/apiservice/account.service';
import { ExcelDownloadService } from 'src/app/apiservice/excel-download.service';
import { SubmitOrderComponent } from '../popup/submit-order/submit-order.component';
import { LoaderService } from 'src/app/apiservice/loader.service';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { GeneralOutputComponent } from '../../popup/general-output/general-output.component';
import { Router } from '@angular/router';

export interface PartsTable {
  blank: 'manually' | 'ordered' | '-';
  sku: string;
  description: string;
  price: string;
  y_currentyear: string;
  y_previousyear: string;
  r12: string;
  order: string;
}

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styleUrls: ['./parts.component.scss']
})


export class PartsComponent implements OnInit, AfterViewInit {  
  displayedColumns: string[] = ['blank', 'sku', 'description', 'price', 'y_currentyear', 'y_previousyear', 'r12', 'order'];
  dataSource: any;
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  @ViewChild('priceTable') priceTable!: ElementRef;
  categories: any[] = [];
  firstproductArr: any[] = [];
  products: any[] = [];
  jsonData: any;
  searchForm!: FormGroup; // Use the non-null assertion operator
  elements: any[] = []; // Replace with your actual type
  price_arr: { [sku: string]: number } = {};
  order_arr: { [sku: string]: number } = {};
  valuesArray: number[] = [2500.00, 5000.00, 10000.00, 25000.00];
  bronze_progress: number = 0;
  silver_progress: number = 0;
  gold_progress: number = 0;
  gold_p_progress: number = 0;
  gold_pp_progress: number = 0;
  acct: string | null = null;
  currentYear: any;
  previousYear: any;
  suggestForm: FormGroup;
  prod_arr: any[] = []; // Initialize the prod_arr array
  discount: any;
  discount_per: number = 0; // Declare once at the top
  cal_discount: any;
  assetUrl = environment.assetUrl;
  accountName: string | null = null;
  accountNum: string | null = null;
  compCode: any;
  isLoading = true; // Initialize loading state as true
  envName = environment.name;
  isUATMode: boolean = environment.uat;
  private dataLoaded: boolean = false;
  isSaveDisabled = false;
  showMessage = false;

  // Define the global temporary array in your component class
  temporaryArray: { blank: string, sku: string, description: string, price: number, y_currentyear: number, y_previousyear: number, r12: number, order: number }[] = [];

  constructor(private titleService: Title,
    private dialog: MatDialog,
    private service: MasterService, 
    private fb: FormBuilder, 
    private renderer: Renderer2, 
    @Inject(DOCUMENT) private document: Document, 
    private accountService: AccountService, 
    private excelDownloadService: ExcelDownloadService,
    private router: Router,
    private loaderService: LoaderService) { 
    this.suggestForm = this.fb.group({
      selectedPercentage: [''],
      selectedHistory: ['']
    });
    this.compCode = this.accountService.getCompCode();
    //this.errorout();
    //this.login();
  }

  errorout() {
    // For this example, you can set the condition for showing the error message
    const isMaintenanceMode = true; // Replace with real condition based on your logic
    if (isMaintenanceMode) {
      this.router.navigate(['/isMaintenance']); // Navigate to the maintenance page
    }
  }

  login(): void {
    this.service.login().subscribe((res: any) => {
      //alert(res.message);
      localStorage.setItem('loginToken', res.token);
    })
  }

  // Helper method to update price elements
  private updatePriceElement(elementId: string, content: number | string): void {
    const element = this.document.getElementById(elementId);
    if (element) {
      let displayContent: string;
      if (typeof content === 'number') {
        displayContent = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(content);
      } else {
        displayContent = content;
      }
      this.renderer.setProperty(element, 'textContent', displayContent);
    }
  }

  // Method to update progress bars based on the afterdiscount_price
  private updateProgressBars(afterdiscount_price: number): void {
    if (this.compCode === 'CDA') {
      this.bronze_progress = afterdiscount_price >= 5000 ? 100 : 0;
      this.silver_progress = afterdiscount_price >= 10000 ? 100 : 0;
      this.gold_progress = afterdiscount_price >= 25000 ? 100 : 0;
    } else if (this.compCode === 'USF') {
      this.bronze_progress = afterdiscount_price >= 2500 ? 100 : 0;
      this.silver_progress = afterdiscount_price >= 5000 ? 100 : 0;
      this.gold_progress = afterdiscount_price >= 10000 ? 100 : 0;
      this.gold_p_progress = afterdiscount_price >= 25000 ? 100 : 0;
    }
  }

  private resetProgressBars(): void {
    if (this.compCode === 'CDA') {
      // Reset progress bars relevant for CDA
      this.silver_progress = 0;
      this.gold_progress = 0;
      this.gold_p_progress = 0;
    } else if (this.compCode === 'USF') {
      // Reset all progress bars for USF
      this.bronze_progress = 0;
      this.silver_progress = 0;
      this.gold_progress = 0;
      this.gold_p_progress = 0;
      this.gold_pp_progress = 0;
    } else {
      // Reset all progress bars as a fallback
      this.bronze_progress = 0;
      this.silver_progress = 0;
      this.gold_progress = 0;
      this.gold_p_progress = 0;
      this.gold_pp_progress = 0;
    }
  }

  private resetData(): void {
    // Clear the price and order arrays/objects
    this.price_arr = {};
    this.order_arr = {};
  }

  private resetOrderQuantities(): void {
    // Set all vl_order_qty input fields to 0
    document.querySelectorAll<HTMLInputElement>('.vl_order_qty').forEach(input => {
      input.value = '0';
    });
    // Ensure dataSource is properly typed
    this.dataSource.data.forEach((element: PartProducts) => {
      element.order = '0';
    });
  }

  private initializePage(): void {
    this.titleService.setTitle('Husqvarna - Part Portal');
    const date = new Date();
    this.currentYear = date.getFullYear();
    this.previousYear = this.currentYear - 1;
  }

  private initializeSearchForm(): void {
    this.searchForm = this.fb.group({
      selectedProduct: ['all'] // Default to "All Products"
    });
  }

  private loadCategories(): void {
    this.loaderService.show();
    this.service.getPartsCategories().subscribe(data => {
      this.jsonData = data;
      this.categories = this.jsonData.results;
    });
  }

  /**
   * Formats the discount value into a percentage string.
   * @param dis_count - The discount value to format.
   * @returns A formatted discount string.
   */
  private formatDiscount(dis_count: number): string {
    this.compCode = this.accountService.getCompCode();
    // Check if the discount is from CDA or USF
    if (this.compCode === 'CDA') {
      switch (dis_count) {
        case 0.00:
          return '0%'; // Assuming CDA has 0% as an option
        case 0.01:
          return '1%';
        case 0.02:
          return '2%';
        case 0.03:
          return '3%';
        case 0.05:
          return '5%';
        case 0.07:
          return '7%';
        default:
          return 'Unknown'; // For unexpected values
      }
    } else if (this.compCode === 'USF') {
      switch (dis_count) {
        case 0.06:
          return '6%';
        case 0.08:
          return '8%';
        default:
          return '0%'; // Assuming default value for USF if no match
      }
    } else {
      return '0%'; // Default value if `compCode` is neither CDA nor USF
    }
  }

  /**
   * Calculate the tier discount percentage based on the total price.
   * @param ttl_price - The total price for all products.
   * @returns The formatted tier discount string.
   */
  private calculateTierDiscount(ttl_price: number): string {
    let tier_discount = '0%';
    if (this.compCode === 'CDA') {
      if (ttl_price >= 5000 && ttl_price < 10000) {
        tier_discount = '10%';
      } else if (ttl_price >= 10000 && ttl_price < 25000) {
        tier_discount = '12%';
      } else if (ttl_price >= 25000) {
        tier_discount = '15%';
      }
    } else if (this.compCode === 'USF') {
      if (ttl_price >= 2500 && ttl_price < 5000) {
        tier_discount = '6%';
      } else if (ttl_price >= 5000 && ttl_price < 10000) {
        tier_discount = '6%';
      } else if (ttl_price >= 10000 && ttl_price < 25000) {
        tier_discount = '8%';
      } else if (ttl_price >= 25000) {
        tier_discount = '12%';
      }
    }
    return tier_discount;
  }

  private loadProducts(): void {
    const val = 'all';
    this.service.getProductCategory(val, '', 0).subscribe({
      next: (res) => {
        this.jsonData = res;
        // Safely extract products and discount data
        this.products = this.jsonData?.results || [];
        this.discount = this.jsonData?.discount || [];
        // Calculate and format discount
        const dis_count = this.calculateDiscount();
        //console.log('VL dis_count' + dis_count);
        this.cal_discount = this.formatDiscount(dis_count);
        //console.log('VL cal discount' + this.cal_discount);
        // Initialize accountName and accountNum with fallbacks
        const firstDiscount = this.discount[0] || {};
        this.accountName = firstDiscount.name || 'Unknown';
        this.accountNum = firstDiscount.account_number || 'Unknown';
        // Initialize products and UI elements
        this.sortProducts();
        this.initializeDataSource();
        this.storeProductPricesAndOrders();
        // Calculate and update prices
        const ttl_price = this.calculateTotalPrice();
        const discount_per = this.calculateCombinedDiscount(ttl_price);
        this.updatePriceElements(ttl_price, discount_per);
        // Update progress bars
        this.updateProgressBars(ttl_price);
        // Hide loader after all operations are complete
        this.loaderService.hide();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.loaderService.hide();
      }
    });
  }

  private updatePriceElements(ttl_price: number, discount_per: number): void {
    const discount_amount = ttl_price * discount_per;
    const afterdiscount_price = ttl_price - discount_amount;
    // Calculate and format the AYP discount
    const dis_count = this.calculateDiscount();
    this.cal_discount = this.formatDiscount(dis_count);
    // Determine the tier discount based on total price
    const tier_discount = this.calculateTierDiscount(ttl_price);
    // Build the discount display string based on the presence of a tier discount
    let discount_display = `(AYP ${this.cal_discount}`;
    if (parseFloat(tier_discount) > 0) {
      discount_display += ` + Tier ${tier_discount}`;
    }
    discount_display += `)`; // Ensure closing bracket is added
    // Update UI elements with calculated prices and combined discounts
    this.updatePriceElement('msg_before_discount', ttl_price);
    this.updatePriceElement('msg_ayp', discount_amount);
    this.updatePriceElement('combined_disount', discount_display);
    this.updatePriceElement('msg_after_discount', afterdiscount_price);
  }

  private calculateDiscount(): number {
    if (this.jsonData.discount && this.jsonData.discount.length > 0) {
      this.discount = this.jsonData.discount;
      if (this.compCode === 'CDA') {
        // Directly use the discount code without splitting
        const discountCode = this.discount[0]?.dis_cat; // Assuming you want to use the first discount entry
        return this.getAYP([
          [discountCode]
        ]);
      } else if (this.compCode === 'USF') {
        // For USF, handle the discount group with splitting
        const discountGroup = this.discount.map((item: {
          dis_cat: string
        }) => item.dis_cat.split(''));
        return this.getAYP(discountGroup);
      }
    }
    return 0; // Default to 0 if no discounts
  }

  private initializeDataSource(): void {
    this.dataSource = new MatTableDataSource<PartProducts>(this.products);
    this.dataSource.paginator = this.paginatior;
    this.dataSource.sort = this.sort;
    // Ensure that sort is assigned correctly
    this.dataLoaded = true; // Flag that the data is loaded
  }

  private storeProductPricesAndOrders(): void {
    this.products.forEach(product => {
      if (product.order && product.order !== 0) {
        this.price_arr[product.sku] = parseFloat(product.price);
        this.order_arr[product.sku] = parseFloat(product.order);
      }
    });
  }

  private calculateTotalPrice(): number {
    return Object.keys(this.order_arr).reduce((total, key) => 
      total + this.order_arr[key] * this.price_arr[key], 0
    );
  }

  ngOnInit(): void {
    this.compCode = this.accountService.getCompCode();
    this.loadAgentEmail();
    this.initializePage();
    this.initializeSearchForm();
    this.loadCategories();
    this.accountService.isSaveDisabled$.subscribe(
      (disabled) => (this.isSaveDisabled = disabled)
    );
  }

  loadAgentEmail() {
    this.service.getAgentEmail().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.accountService.setAgentEmail(res.email);
          this.accountService.setPartsAgentID(res.aid);
        } else {
          console.error('Failed to load agent email: ' + res.message);
          this.router.navigate(['/404']);  // Redirect to 404 page
        }
      },
      (error) => {
        console.error('Error occurred while loading agent email:', error);
        this.router.navigate(['/404']);  // Redirect on error
      }
    );
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadProducts();
    }, 2000);  // 2000 milliseconds = 2 seconds
    //this.login();
  }  
  
  ngAfterViewChecked() {
    if (this.dataLoaded && this.sort && !this.dataSource.sort) {
      this.dataSource.sort = this.sort;
    }
  }
  
  onValueChange(event: {
    value: string
  }): void {
    const selectedValue = event.value;
    const percentage = this.suggestForm.get('selectedPercentage')?.value || 0;
    const history = this.suggestForm.get('selectedHistory')?.value || '';
    this.loaderService.show();
    this.service.getProductCategory(selectedValue, history, percentage).subscribe({
      next: (res) => {
        this.jsonData = res;
        this.products = this.jsonData?.results || [];
        this.discount = this.jsonData?.discount || [];
        // Initialize products and UI elements
        this.sortProducts();
        this.initializeDataSource();
        this.storeProductPricesAndOrders();
        // Calculate total price across all SKUs
        const ttl_price = this.calculateTotalPrice();
        // Determine the combined discount percentage and update price elements
        const discount_per = this.calculateCombinedDiscount(ttl_price);
        this.updatePriceElements(ttl_price, discount_per);
        // Update progress bars
        this.updateProgressBars(ttl_price);
        this.loaderService.hide();
      },
      error: (err) => {
        console.error('Error fetching product category:', err);
        this.loaderService.hide();
      }
    });
  }
  
  validateNumber(event: KeyboardEvent): void {
    const inputChar = String.fromCharCode(event.charCode);
    if (!/^\d+$/.test(inputChar)) {
      event.preventDefault();
    }
  }

  private calculateCombinedDiscount(ttl_price: number): number {
    let base_discount_per = 0;
    // Determine base discount percentage based on compCode and ttl_price
    if (this.compCode === 'CDA') {
      if (ttl_price >= 5000 && ttl_price < 10000) {
        base_discount_per = 0.10;
      } else if (ttl_price >= 10000 && ttl_price < 25000) {
        base_discount_per = 0.12;
      } else if (ttl_price >= 25000) {
        base_discount_per = 0.15;
      }
    } else if (this.compCode === 'USF') {
      if (ttl_price >= 2500 && ttl_price < 5000) {
        base_discount_per = 0.06;
      } else if (ttl_price >= 5000 && ttl_price < 10000) {
        base_discount_per = 0.06;
      } else if (ttl_price >= 10000 && ttl_price < 25000) {
        base_discount_per = 0.08;
      } else if (ttl_price >= 25000) {
        base_discount_per = 0.12;
      }
    }
    // Calculate AYP discount
    let ayp_discount_per = 0;
    if (this.compCode === 'CDA') {
      // Directly use the discount code without splitting
      const aypCode = this.discount[0]?.dis_cat; // Assuming you want to use the first discount entry
      ayp_discount_per = this.getAYP([
        [aypCode]
      ]);
    } else if (this.compCode === 'USF') {
      // For USF, handle the discount group with splitting
      const discountGroup = this.discount.map((item: {
        dis_cat: string
      }) => item.dis_cat.split(''));
      ayp_discount_per = this.getAYP(discountGroup);
    }
    // Combine the base discount and AYP discount
    return base_discount_per + ayp_discount_per;
  }
  
  onInputChange(event: Event | number, element: any, sku: string): void {
    // Determine the order quantity based on the event type
    let orderQuantity: number;
    if (typeof event === 'number') {
        orderQuantity = event;
    } else {
        const inputValue = (event.target as HTMLInputElement).value.trim();
        // Set to zero if the input value is blank
        orderQuantity = inputValue === '' ? 0 : parseFloat(inputValue);
    }
    // Update the element order with the calculated quantity
    element.order = orderQuantity;
    // Safely parse and store the price and order quantity for the SKU
    const price = parseFloat(element.price);
    if (!isNaN(price) && !isNaN(orderQuantity)) {
      this.price_arr[sku] = price;
      this.order_arr[sku] = orderQuantity;
    } else {
      console.error('Invalid price or order quantity:', price, orderQuantity);
      return;
    }
    // Calculate total price across all SKUs
    const ttl_price = this.calculateTotalPrice();
    // Determine the combined discount percentage and update price elements
    const discount_per = this.calculateCombinedDiscount(ttl_price);
    this.updatePriceElements(ttl_price, discount_per);
    // Update progress bars
    this.updateProgressBars(ttl_price);
    // Proceed with the API call if the order quantity is valid
    if (orderQuantity >= 0) {
      this.loaderService.show();
      this.service.updateOrder(orderQuantity.toString(), element.sku, price).subscribe({
        next: (res) => {
          console.log('Order updated:', res);
          this.loaderService.hide();
        },
        error: (err) => {
          console.error('Error updating order:', err);
          this.loaderService.hide();
        }
      });
    }
    // Check if any SKU has a non-zero quantity to show or hide the Submit button
    this.checkOrderValidity();
  }
  
  // Method to check if any non-zero quantity exists in order_arr
  checkOrderValidity(): boolean {
    const values = Object.values(this.order_arr);
    return values.length > 0 && values.some(value => value > 0);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportOrder(): void {
    this.loaderService.show(); // Show the loader before the request starts
  
    this.excelDownloadService.downloadExcelFile().subscribe({
      next: (response) => {
        const acctNum = this.accountService.getAccount(); // Store acctNum for use in filename
        const fileName = 'parts_export_' + acctNum + '.xls'; // Construct the filename
        this.excelDownloadService.saveExcelFile(response, fileName); // Save the downloaded file
        this.loaderService.hide(); // Hide the loader once the file is saved
      },
      error: (error) => {
        console.error('Error downloading the file', error); // Log the error
        this.loaderService.hide(); // Hide the loader in case of error
      }
    });
  }  

  openClearconfirmation(): void {
    const dialogRef = this.dialog.open(ClearconfirmationComponent);
    dialogRef.componentInstance.addItemEvent.subscribe(result => {
      if (result.showBtn) {
        this.resetProgressBars();
        this.resetData();
        this.resetOrderQuantities();
        this.ngOnInit(); // Reinitialize the component
        this.isLoading = false;
        this.loaderService.hide();
      }
    });
  }

  reloadPage() {
    window.location.reload();
  }
  
  openLegends(): void {
    this.dialog.open(LegendsComponent);
  }

  private showErrorDialog(message: string): void {
    const output = { message, reload: false };
    this.dialog.open(GeneralOutputComponent, { data: output });
  }
  
  openSuggest(): void {
    const dialogRef = this.dialog.open(SuggestComponent);
    dialogRef.componentInstance.addItemEvent.subscribe(res => {
      if (res.showBtn) {
        const percentage = this.suggestForm.get('selectedPercentage')?.value;
        const history = this.suggestForm.get('selectedHistory')?.value;
        // Validate that both percentage and history are selected
        if (!percentage || !history) {
          this.showErrorDialog('Please select both Percentage and History.');
          return;
        }
        // Reset order quantities and progress bars before making an API call
        this.resetData();
        this.resetOrderQuantities();
        this.resetProgressBars();
        const product = this.searchForm.get('selectedProduct')?.value;
        this.loaderService.show();
        this.service.getProductCategory(product, history, percentage).subscribe(res => {
          this.jsonData = res;
          this.products = this.jsonData.results || [];
          this.discount = this.jsonData.discount || [];
          const suggest = this.jsonData.suggest;
          // Initialize products and UI elements
          this.sortProducts();
          this.initializeDataSource();
          this.storeProductPricesAndOrders();
          // Calculate total price for the given SKU
          let ttl_price = this.calculateTotalPrice();
          // Handle case where suggest equals 0
          if (suggest === 0) {
            ttl_price = 0;
            this.resetProgressBars();
          }
          // Determine the combined discount percentage and update price elements
          const discount_per = this.calculateCombinedDiscount(ttl_price);
          this.updatePriceElements(ttl_price, discount_per);
          // Update progress bars
          this.updateProgressBars(ttl_price);
          this.loaderService.hide();
        })
      }
    });
  }

  private updateOrAddProduct(productArray: any[], newProduct: any): void {
    const existingProduct = productArray.find(product => product.sku === newProduct.sku);
    if (existingProduct) {
      existingProduct.order = newProduct.order;
    } else {
      productArray.unshift(newProduct);
    }
  }

  openAdditem(): void {
    const dialogRef = this.dialog.open(AdditemComponent);
    dialogRef.componentInstance.addItemEvent.subscribe((result: { blank: 'manually' | 'ordered' | '-', sku: string, desc: string, price: number, quantity: number }) => {
      const { blank, sku, desc, price, quantity } = result;
      const newProduct = { blank: blank, sku: sku, description: desc, price: price, y_currentyear: 0, y_previousyear: 0, r12: 0, order: quantity };
      this.isLoading = true;
      this.loaderService.show();
      this.service.getProductCategory('all', '', 0, 1).subscribe({
        next: (res) => {
          this.jsonData = res;
          this.firstproductArr = this.jsonData.results || [];
          this.discount = this.jsonData.discount || [];
          // Update or add the new product in firstproductArr
          this.updateOrAddProduct(this.firstproductArr, newProduct);
          // Update or add items from firstproductArr to products
          this.updateOrAddProduct(this.products, newProduct);
          // Initialize products and UI elements
          this.sortProducts();
          this.initializeDataSource();
          this.storeProductPricesAndOrders();
          // Calculate total price and update UI elements
          const ttl_price = this.calculateTotalPrice();
          const discount_per = this.calculateCombinedDiscount(ttl_price);
          this.updatePriceElements(ttl_price, discount_per);
          this.updateProgressBars(ttl_price);
          // If the product was marked as ordered, update the database
          // RE: Deployment Status : Order Builder,Parts and Fleet Portal (Dean pointed out the error so commenting if condition)
          //if (newProduct.blank === 'ordered') {
            this.onInputChange(Number(quantity), newProduct, sku);
          //}
          this.loaderService.hide();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching product category:', err);
          this.loaderService.hide();
          this.isLoading = false;
          this.showErrorDialog('Failed to retrieve product data. Please try again later.');
        }
      });
    });
  }

  sortProducts() {
    const priority: { [key: string]: number } = { 'manually': 1, 'ordered': 2, '-': 3 };
    this.products.sort((a, b) => {
        const priorityA = priority[a.blank] !== undefined ? priority[a.blank] : 4;
        const priorityB = priority[b.blank] !== undefined ? priority[b.blank] : 4;
        return priorityA - priorityB;
    });
  }
  
  openImportorder(): void {
    this.dialog.open(ImportorderComponent);
  }

  openSubmitPopup(): void {
    if (!this.isSaveDisabled) {
      const dialogRef = this.dialog.open(SubmitOrderComponent);
      dialogRef.afterClosed().subscribe((result) => {
        // Show the message after 3 seconds
        setTimeout(() => {
          this.showMessage = true;
        }, 3000);
      });
    }
  }

  private getAYP(mDiscountGroup: string[][]): number {
    if (this.compCode === 'CDA') {
      const flatDiscountGroup = mDiscountGroup.flat();
      const partsCode = flatDiscountGroup[0]; // Use the first item for CDA
      switch (partsCode) {
        case "45":
          return 0.00;
        case "CS":
          return 0.00;
        case "CG":
          return 0.01;
        case "CP":
          return 0.02;
        case "CT":
          return 0.03;
        case "CR":
          return 0.05;
        case "CE":
          return 0.07;
        default:
          console.warn('Unknown parts code:', partsCode);
          return 0.0;
      }
    } else if (this.compCode === 'USF') {
      const flatDiscountGroup = mDiscountGroup.flat();
      if (flatDiscountGroup.length < 2) {
        console.warn('Unexpected discount group structure:', flatDiscountGroup);
        return 0.0;
      }
      const partsCode = flatDiscountGroup[1];
      switch (partsCode) {
        case "S":
          return 0.06;
        case "G":
          return 0.08;
        default:
          console.warn('Unknown parts code:', partsCode);
          return 0.0;
      }
    }
    return 0.0;
  }
  
}