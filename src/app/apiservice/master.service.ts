import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable , throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Dealer, TabsResponse, TabsResult, Templates, Category, PartProducts, AddNewItem, OrderProductList } from '../Model/UserObject';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from './account.service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EncryptionService } from './encryption.service';

@Injectable({
    providedIn: 'root'
})

export class MasterService {

  private isMode = environment.production;
  private isTokenGenerationEnabled = environment.tokenGenerationEnabled; // Add this flag in your environment file
  private apiUrl = !this.isMode ? environment.uatApiBaseUrl : environment.prodApiBaseUrl;
  //private apiUrl = !this.isMode ? environment.uatOpPortalApiBaseUrl : environment.prodOpPortalApiBaseUrl;
  private CRMURL = environment.CRMURL;
  private encryptedAidParam: string | null = null;
  private encryptedAcctParam: string | null = null;
  private oauth: string | null = null;
  account_number: any;
  private isDifferentContentVisibleSubject = new BehaviorSubject<boolean>(false);
  isDifferentContentVisible$ = this.isDifferentContentVisibleSubject.asObservable();
  acct: string | null = null;
  aid: string | null = null;
  jsonData: any;

  constructor(private http: HttpClient, 
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private accountService: AccountService ) { }

  private tokenGenerated(): HttpHeaders {
    if (!this.isTokenGenerationEnabled) {
      return new HttpHeaders({
        'Accept': 'application/json'
      });
    }
  
    const token = localStorage.getItem('loginToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`,
      'Accept': 'application/json'
    });
  }

  // Handle token refresh logic
  private handleTokenError(error: any, retryFunction: () => Observable<any>): Observable<any> {
    if (error.status === 401) { // Assuming 401 is the status code for token expiration
      return this.refreshTokenAndRetry(retryFunction);
    }
    return throwError(error);
  }

  // Refresh token and retry the original request
  private refreshTokenAndRetry(retryFunction: () => Observable<any>): Observable<any> {
    return this.login().pipe( // Assuming you have a login method to refresh the token
      switchMap((res: any) => {
        // Store the new token in localStorage
        localStorage.setItem('loginToken', res.token);
        return retryFunction(); // Retry the original request
      }),
      catchError((loginError) => {
        console.error('Login failed', loginError);
        return throwError(loginError); // Rethrow the login error
      })
    );
  }
  
  login(): Observable<any> {
    const key = 'secretkey123456';
    const ivtest = '1100110011000111';
    const username = 'vinil@speridian.com';
    const password = '12345678';
    const encryptedPswd = 'IUKhJMNPHGmYmOOBHC4MjQ==';
    // Set the headers with an additional boolean parameter
    const headers = {
      'Content-Type': 'application/json',
      'Custom-Boolean-Header': 'true'  // Example boolean parameter in headers (convert boolean to string)
    };
    // Set the headers
    const body = {
      email: username,
      password: encryptedPswd
    };
    // Send the encrypted data via HTTPS with headers
    return this.http.post<any>(this.apiUrl + `login`, body, {
      headers: headers
    });
  }

  getDiscountBySKUforCDA(): Observable<{ sku: number, discount: number }[]> {
    return this.http.get<{ sku: number, discount: number }[]>(this.apiUrl+`op_getDiscountBySKUforCDA`);
  }

  getCRMURL(){
    this.aid = this.accountService.getAgentId(); // Get the acct parameter
    const encryptedTestValue = this.encryptionService.encrypt(this.aid || '');
    console.log('Encrypted Test Value:', encryptedTestValue);

    const decryptedTestValue = this.encryptionService.decrypt(encryptedTestValue);
    console.log('Decrypted Test Value:', decryptedTestValue);
    return this.http.get<any>(this.apiUrl+`op_getCrmCall?aid=`+this.aid);
  }
  
  getUsers(): Observable<Dealer[]> {
    const headers = this.tokenGenerated();
    this.aid = this.accountService.getAgentId(); // Get the agent ID
    const terList = this.accountService.getTerritory();
    const compCode = this.accountService.getCompCode();
    const url = `${this.apiUrl}op_dealerlist?aid=${this.aid}&compCode=${compCode}&terList=${terList}`;
    return this.http.get<Dealer[]>(url, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getUsers()))
    );
  }

  getTemplates(orgID?: string): Observable<Templates[]> {
    const headers = this.tokenGenerated();
    this.aid = this.accountService.getAgentId(); // Get the agent ID
    let url = `${this.apiUrl}op_templatelist?agentID=${this.aid}`;
    if (orgID) {
      url += `&orgID=${orgID}`;
    }
    return this.http.get<Templates[]>(url, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getTemplates(orgID)))
    );
  }  

  getTabs(): Observable<TabsResult[]> {
    const headers = this.tokenGenerated();
    const compCode = this.accountService.getCompCode();
    const url = `${this.apiUrl}op_tablist?compCode=${compCode}`;
    return this.http.get<TabsResult[]>(url, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getTabs()))
    );
  }

  getDealer(account_number: string, orgID: string): Observable<Dealer[]> {
    const headers = this.tokenGenerated();
    const url = `${this.apiUrl}op_dealer?acctNum=${account_number}&orgID=${orgID}`;
    return this.http.get<Dealer[]>(url, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getDealer(account_number, orgID)))
    );
  }

  getLoadOrder(orderID: number): Observable<any> {
    const headers = this.tokenGenerated();
    const compCode = this.accountService.getCompCode();
    const url = `${this.apiUrl}op_load_order?orderID=${orderID}&compCode=${compCode}`;
    return this.http.get<any>(url, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getLoadOrder(orderID)))
    );
  }

  deleteTemplate(id: number): Observable<Templates[]> {
    const headers = this.tokenGenerated(); // Assuming tokenGenerated() returns the authorization header
    const url = `${this.apiUrl}op_delete_template`;
    const body = { orderID: id }; // Define the payload for the POST request
  
    return this.http.post<Templates[]>(url, body, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.deleteTemplate(id)))
    );
  }  
  
  getOrderPortalProductAPI(tab_ids: string, stn_arr: string): Observable<OrderProductList[]> {
    this.account_number = this.accountService.getOrderPortalAccountNumber(); // Get the acct parameter
    const headers = this.tokenGenerated();
    const compCode = this.accountService.getCompCode();
    const new_stn_arr = encodeURIComponent(stn_arr);
  
    const url = `${this.apiUrl}op_products?tid=${tab_ids}&stns=${new_stn_arr}&compCode=${compCode}&acctNum=${this.account_number}`;
    
    return this.http.get<OrderProductList[]>(url, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getOrderPortalProductAPI(tab_ids, stn_arr)))
    );
  }  

  saveOrder(formData: any): Observable<any[]> {
    const headers = this.tokenGenerated();
    const url = `${this.apiUrl}op_saveorder`;
    return this.http.post<any[]>(url, formData, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.saveOrder(formData)))
    );
  }  

  generatePDF(formData: any): Observable<Blob> {
    const headers = this.tokenGenerated();
    const url = `${this.apiUrl}op_generatePdf`;
    return this.http.post<Blob>(url, formData, { headers, responseType: 'blob' as 'json' }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.generatePDF(formData)))
    );
  }  

  getOrderPortalAPI(aid: string): Observable<any[]>{
    return this.http.get<any[]>(this.CRMURL + `order_portal_api?aid=`+aid);
  }

  // Parts Portal API list
  setIsDifferentContentVisible(isVisible: boolean): void {
    this.isDifferentContentVisibleSubject.next(isVisible);
  }

  getWareHouseDateList(): Observable<any> {
    const headers = this.tokenGenerated();
    // Use template literals for URL construction and add error handling with `pipe()` and `catchError()`
    return this.http.get<any>(`${this.apiUrl}pp_warehouse_datelist`, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getWareHouseDateList()))
    );
  }

  getAgentEmail(): Observable<any> { 
    const compCode = this.accountService.getCompCode();
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const encryptedTestValue = this.encryptionService.encrypt(this.acct || '');
    console.log('Encrypted Test Value:', encryptedTestValue);

    const decryptedTestValue = this.encryptionService.decrypt(encryptedTestValue);
    console.log('Decrypted Test Value:', decryptedTestValue);
    const headers = this.tokenGenerated();
    // Use template literals for URL and add error handling with `pipe()` and `catchError()`
    return this.http.get<any>(`${this.apiUrl}pp_agent_email?compCode=${compCode}&acctNum=${this.acct}`, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getAgentEmail()))
    );
  }

  getPartsCategories(): Observable<Category[]> {
    const headers = this.tokenGenerated();
    const compCode = this.accountService.getCompCode();
    return this.http.get<Category[]>(`${this.apiUrl}pp_categories?compCode=${compCode}`, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getPartsCategories()))
    );
  }

  getProductCategory(catID: string, history: string, percentage: number, addItem?: number, loadR12: boolean = false): Observable<PartProducts[]> {
    const headers = this.tokenGenerated();
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const compCode = this.accountService.getCompCode();
    const itemToAdd = addItem ?? 0;
    const loadR12Flag = loadR12 ? 1 : 0;

    return this.http.get<PartProducts[]>(`${this.apiUrl}pp_product_category?compCode=${compCode}&history=${history}&percentage=${percentage}&acctNum=${this.acct}&catID=${catID}&addItem=${itemToAdd}&loadR12=${loadR12Flag}`, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getProductCategory(catID, history, percentage, itemToAdd)))
    );
  }

  getaddItemSearch(sku: string): Observable<AddNewItem[]> { 
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const compCode = this.accountService.getCompCode();
    const headers = this.tokenGenerated();
    // Use template literals for URL construction and add error handling with `pipe()` and `catchError()`
    return this.http.get<AddNewItem[]>(`${this.apiUrl}pp_addNewItem?compCode=${compCode}&acctNum=${this.acct}&prodSKU=${sku}`, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getaddItemSearch(sku)))
    );
  }

  updateOrder(qty: string, sku: string, price: number): Observable<any>{
    const headers = this.tokenGenerated();
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const compCode = this.accountService.getCompCode();
    const formData = new FormData();
    formData.append('compCode', compCode || 'USF');
    formData.append('prodSKU', sku);
    formData.append('acctNum', this.acct || '');
    formData.append('qty', qty);
    formData.append('price', price.toString()); // Convert price to string

    return this.http.post<any>(`${this.apiUrl}pp_update_parts_order`, formData, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.updateOrder(qty, sku, price)))
    );
  }

  getClearOrder(): Observable<AddNewItem[]> {
    const headers = this.tokenGenerated();
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const compCode = this.accountService.getCompCode();
    
    // Define return type as Observable<AddNewItem[]>
    return this.http.get<AddNewItem[]>(`${this.apiUrl}pp_clear_order?compCode=${compCode}&acctNum=${this.acct}`, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getClearOrder()))
    );
  }    

  importOrder(file: File): Observable<any> {
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const formData: FormData = new FormData();
    const compCode = this.accountService.getCompCode();
    formData.append('excel_file', file, file.name);
    formData.append('acctNum', this.acct || '54321'); // Use the account number or fallback to '54321'
    formData.append('compCode', compCode || 'USF');
    const headers = this.tokenGenerated();
    // const headers = new HttpHeaders({
    //   'Authorization': `Bearer ${token || ''}`,
    //   'Accept': 'application/json'
    // });
    return this.http.post(`${this.apiUrl}pp_import_order`, formData, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.importOrder(file)))
    );
  }

  submitOrder(shipWeekDate: string, numericValue: number): Observable<any> {
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    let compCode = this.accountService.getCompCode();
    let agentEmail = this.accountService.getAgentEmail();
    let partAgentID = this.accountService.getPartsAgentID();
    const formData = new FormData();
    formData.append('compCode', compCode || 'USF');
    formData.append('shipWeekDate', shipWeekDate);
    formData.append('acctNum', this.acct || '');
    formData.append('agentEmail', agentEmail || '');
    formData.append('agentID', String(partAgentID || '0')); // Convert agentID to string
    // Ensure numericValue is passed as a string and is not NaN
    formData.append('totalValue', !isNaN(numericValue) ? numericValue.toString() : '0');
    const headers = this.tokenGenerated();

    // Using catchError to handle token errors and retry the request
    return this.http.post<any>(`${this.apiUrl}pp_submit_order`, formData, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.submitOrder(shipWeekDate, numericValue)))
    );
  }

  getR12History(): Observable<any> {
    const headers = this.tokenGenerated();
    const acct = this.accountService.getAccount(); // Use local variable
    const compCode = this.accountService.getCompCode();
  
    const url = `${this.apiUrl}pp_load_history?compCode=${compCode}&acctNum=${acct}`;
  
    return this.http.get<PartProducts[]>(url, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getLoadHistory()))
    );
  }

  getLoadHistory(): Observable<PartProducts[]> {
    const headers = this.tokenGenerated();
    const acct = this.accountService.getAccount(); // Use local variable
    const compCode = this.accountService.getCompCode();
  
    const url = `${this.apiUrl}pp_load_history?compCode=${compCode}&acctNum=${acct}`;
  
    return this.http.get<PartProducts[]>(url, { headers }).pipe(
      catchError((error) => this.handleTokenError(error, () => this.getLoadHistory()))
    );
  }
  
  updateBulkOrderQty(orders: any[]): Observable<any> {
    const headers = this.tokenGenerated(); // Do not set Content-Type manually
    const acctNum = this.accountService.getAccount(); // Assuming method returns acctNum
    const compCode = this.accountService.getCompCode();
  
    const formData = new FormData();
    formData.append('orders', JSON.stringify(orders)); // Convert orders array to JSON
    formData.append('acctNum', acctNum ?? '');
    formData.append('compCode', compCode);
  
    return this.http.post<any>(
      `${this.apiUrl}pp_suggest_bulk_order_update`,
      formData,
      { headers }
    ).pipe(
      catchError(error =>
        this.handleTokenError(error, () => this.updateBulkOrderQty(orders))
      )
    );
  }     

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
  
}
