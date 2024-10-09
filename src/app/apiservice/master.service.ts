import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable , throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Dealer, TabsResponse, TabsResult, Templates, Category, PartProducts, AddNewItem, OrderProductList } from '../Model/UserObject';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from './account.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})

export class MasterService {

  private apiUrl = environment.apiURL;
  private CRMURL = environment.CRMURL;
  account_number: any;
  private isDifferentContentVisibleSubject = new BehaviorSubject<boolean>(false);
  isDifferentContentVisible$ = this.isDifferentContentVisibleSubject.asObservable();
  acct: string | null = null;
  aid: string | null = null;
  jsonData: any;

  constructor(private http: HttpClient, private accountService: AccountService ) { }

  private tokenGenerated(): HttpHeaders {
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
    // Set the headers
    const body = {
      email: username,
      password: encryptedPswd
    };
    // Send the encrypted data via HTTPS
    return this.http.post<any>(this.apiUrl + `login`, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  getDiscountBySKUforCDA(): Observable<{ sku: number, discount: number }[]> {
    return this.http.get<{ sku: number, discount: number }[]>(this.apiUrl+`op_getDiscountBySKUforCDA`);
  }

  getCRMURL(){
    this.aid = this.accountService.getAgentId(); // Get the acct parameter
    return this.http.get<any>(this.apiUrl+`op_getCrmCall?aid=`+this.aid);
  }
  
  getUsers(): Observable<Dealer[]> {
    const headers = this.tokenGenerated();
    this.aid = this.accountService.getAgentId(); // Get the acct parameter
    const terList = this.accountService.getTerritory();
    const compCode = this.accountService.getCompCode();
    return this.http.get<Dealer[]>(this.apiUrl+`op_dealerlist?aid=`+this.aid+`&compCode=`+compCode+`&terList=`+terList);
  }

  getTemplates(orgID?: string): Observable<Templates[]> {
    const headers = this.tokenGenerated();
    this.aid = this.accountService.getAgentId(); // Get the acct parameter
    let url = `${this.apiUrl}op_templatelist?agentID=${this.aid}`;
    if (orgID) {
      url += `&orgID=${orgID}`;
    }
    return this.http.get<Templates[]>(url);
  }

  getTabs(): Observable<TabsResult[]> {
    const headers = this.tokenGenerated();
    const compCode = this.accountService.getCompCode();
    return this.http.get<TabsResult[]>(this.apiUrl+`op_tablist?compCode=`+compCode);
  }

  getDealer(account_number: string, orgID: string): Observable<Dealer[]> {
    const headers = this.tokenGenerated();
    return this.http.get<Dealer[]>(this.apiUrl+`op_dealer?acctNum=`+account_number+`&orgID=`+orgID);
  }

  getLoadOrder(orderID: number): Observable<any>{
    const headers = this.tokenGenerated();
    const compCode = this.accountService.getCompCode();
    return this.http.get<any>(this.apiUrl+`op_load_order?orderID=`+orderID+`&compCode=`+compCode);
  }

  deleteTemplate(id: number): Observable<Templates[]> {
    const httpOptions = {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    };
    const body = { orderID: id }; // Define the payload for the POST request
    return this.http.post<Templates[]>(`${this.apiUrl}op_delete_template`, body, httpOptions);
  }
  
  getOrderPortalProductAPI(tab_ids: string, stn_arr: string): Observable<OrderProductList[]>{
    this.account_number = this.accountService.getOrderPortalAccountNumber(); // Get the acct parameter
    const headers = this.tokenGenerated();
    const compCode = this.accountService.getCompCode();
    let new_stn_arr = encodeURIComponent(stn_arr);
    return this.http.get<OrderProductList[]>(this.apiUrl+`op_products?tid=`+tab_ids+`&stns=`+new_stn_arr+`&compCode=`+compCode+`&acctNum=`+this.account_number);
  }

  saveOrder(formData: any): Observable<any[]> {
    const headers = this.tokenGenerated();
    return this.http.post<any[]>(`${this.apiUrl}op_saveorder`, formData);
  }

  generatePDF(formData: any): Observable<Blob> {
    const headers = this.tokenGenerated();
    const url = `${this.apiUrl}op_generatePdf`;
    return this.http.post(url, formData, { responseType: 'blob' });
  }

  getOrderPortalAPI(aid: string): Observable<any[]>{
    return this.http.get<any[]>(this.CRMURL + `order_portal_api?aid=`+aid);
  }

  // Parts Portal API list
  setIsDifferentContentVisible(isVisible: boolean): void {
    this.isDifferentContentVisibleSubject.next(isVisible);
  }

  getWareHouseDateList(): Observable<any>{
    return this.http.get<any>(this.apiUrl+`pp_warehouse_datelist`);
  }

  getAgentEmail(): Observable<any>{
    const compCode = this.accountService.getCompCode();
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    return this.http.get<any>(this.apiUrl+`pp_agent_email?compCode=`+compCode+`&acctNum=`+ this.acct);
  }

  getPartsCategories(): Observable<Category[]>{
    const headers = this.tokenGenerated();
    const compCode = this.accountService.getCompCode();
    return this.http.get<Category[]>(this.apiUrl+`pp_categories?compCode=`+compCode);
  }

  getProductCategory(catID: string, history: string, percentage: number, addItem?: number): Observable<PartProducts[]>{
    const headers = this.tokenGenerated();
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const compCode = this.accountService.getCompCode();
    // Default addItem to 0 if it's null, undefined, or falsy
    const itemToAdd = addItem ?? 0;
    return this.http.get<PartProducts[]>(this.apiUrl+`pp_product_category?compCode=`+compCode+`&history=`+history+`&percentage=`+percentage+`&acctNum=`+ this.acct +`&catID=`+catID+`&addItem=` + itemToAdd).pipe(
      catchError(this.handleError)
    );
  }

  getaddItemSearch(sku: string): Observable<AddNewItem[]>{
    const headers = this.tokenGenerated();
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const compCode = this.accountService.getCompCode();
    return this.http.get<AddNewItem[]>(this.apiUrl+`pp_addNewItem?compCode=`+compCode+`&acctNum=`+ this.acct +`&prodSKU=`+sku);
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
    return this.http.post<any>(this.apiUrl+`pp_update_parts_order`, formData);
  }

  getClearOrder(){
    const headers = this.tokenGenerated();
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const compCode = this.accountService.getCompCode();
    return this.http.get<AddNewItem[]>(this.apiUrl+`pp_clear_order?compCode=`+compCode+`&acctNum=`+ this.acct);
  }

  importOrder(file: File): Observable<any> {
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    const formData: FormData = new FormData();
    const compCode = this.accountService.getCompCode();
    formData.append('excel_file', file, file.name);
    formData.append('acctNum', this.acct || '54321'); // Use the account number or fallback to '54321'
    formData.append('compCode', compCode || 'USF');
    const token = localStorage.getItem('loginToken');
    const headers = new HttpHeaders({
      //'Authorization': `Bearer ${token || ''}`,
      'Accept': 'application/json'
    });

    return this.http.post(`${this.apiUrl}pp_import_order`, formData);
  }

  submitOrder(shipWeekDate: string, numericValue: number){
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
    return this.http.post<any>(this.apiUrl+`pp_submit_order`, formData);
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
