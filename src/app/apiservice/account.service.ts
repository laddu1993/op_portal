import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { EncryptionService } from './encryption.service';
import { filter } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AccountService {
  private acct: string | null = null;
  private aid: string | null = null;
  private encryptedAidParam: string | null = null;
  private encryptedAcctParam: string | null = null;
  private sltDealerId: string = ''; // Provide a default value
  private dataEmitter = new EventEmitter<any>();
  private showAccountInfoEmitter = new BehaviorSubject<any>(null);
  private showDiscountEmitter = new BehaviorSubject<any>(null);
  private dealerClicked =  new BehaviorSubject<any>(null);
  private orderID: string | null = null;
  private orgID: string |null = null;
  private disCountId: string | null = null;
  private promoCode: string | null = null;
  private OrderSelected: string | null = null;
  private orderFilledSubject = new BehaviorSubject<boolean>(false);
  private customerName: string | null = null;
  orderFilled$ = this.orderFilledSubject.asObservable();
  private op_acctNum: string | null = null;
  private emailAddr: string | null = null;
  private compCode: string | null = null;
  private terList: Array<any> | null = null;
  private dealerSelected = new BehaviorSubject<any>(null);
  private showDefaultPage =  new BehaviorSubject<any>(null);
  private showCustomerPage =  new BehaviorSubject<any>(null);
  private submittingSubject = new BehaviorSubject<boolean>(false);
  isSubmitting$ = this.submittingSubject.asObservable();
  private _isSaveDisabled = new BehaviorSubject<boolean>(false);
  isSaveDisabled$ = this._isSaveDisabled.asObservable();
  private agentEmail: string | null = null;
  private parts_aid: number | null = null;

  constructor(private encryptionService: EncryptionService, private route: ActivatedRoute, private router: Router) {
    // Subscribe to router events to handle query parameters
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const snapshot = this.route.snapshot;
      // this.encryptedAcctParam = snapshot.queryParamMap.get('acct');
      // this.encryptedAidParam = snapshot.queryParamMap.get('aid');

      // if (this.encryptedAidParam) {
      //   this.aid = this.encryptionService.decrypt(this.encryptedAidParam);
      //   console.log('URL parameter:', this.aid);
      // }
      // if (this.encryptedAcctParam) {
      //   this.acct = this.encryptionService.decrypt(this.encryptedAcctParam);
      //   console.log('URL Acct parameter:', this.acct);
      // }
      this.acct = snapshot.queryParamMap.get('acct');
      this.aid = snapshot.queryParamMap.get('aid');
      // Set compCode to 'USF' if it is not found in the URL
      this.compCode = snapshot.queryParamMap.get('compCode') || 'USF';
    });
  }

  disableSaveButton() {
    this._isSaveDisabled.next(true);
  }

  enableSaveButton() {
    this._isSaveDisabled.next(false);
  }

  setSubmittingStatus(status: boolean): void {
    this.submittingSubject.next(status);
  }

  getAccount(): string | null {
    return this.acct;
  }

  getAgentId(): string | null {
    return this.aid;
  }

  setSltDealerId(id: string): void {
    this.sltDealerId = id;
  }

  getSltDealerId(): string {
    return this.sltDealerId;
  }

  emitData(data: any): void {
    this.dataEmitter.emit(data);
  }

  emitDefaultPage(data: any): void {
    this.showDefaultPage.next(data);
  }

  emitCustomerData(data: any): void {
    this.showCustomerPage.next(data);
  }

  emitDealerClicked(data: any): void {
    //console.log('VL emi' + data);
    this.dealerClicked.next(data);
  }

  // Emit data and then complete the subject to prevent further emissions
  emitShowAccountInfo(data: any): void {
    this.showAccountInfoEmitter.next(data);
    //this.showAccountInfoEmitter.complete(); // Mark the subject as complete
  }

  emitDealerSelecte(data: any): void {
    this.dealerSelected.next(data);
  }

  emitshowDiscountEmitter(data: any): void {
    this.showDiscountEmitter.next(data);
  }
  
  getDataEmitter(): EventEmitter<any> {
    return this.dataEmitter;
  }

  getShowAccountInfoEmitter(): BehaviorSubject<any> {
    return this.showAccountInfoEmitter;
  }

  getShowDealerClickedEmitter(): BehaviorSubject<any> {
    //console.log('VL consuming act' + this.dealerClicked);
    return this.dealerClicked;
  }

  getShowDealerSelectedEmitter(): BehaviorSubject<any> {
    return this.dealerSelected;
  }

  getshowDiscountEmitter(): BehaviorSubject<any> {
    return this.showDiscountEmitter;
  }

  getshowDefaultPage(): BehaviorSubject<any> {
    return this.showDefaultPage;
  }

  getshowCustomerPage(): BehaviorSubject<any> {
    return this.showCustomerPage;
  }

  setOrderID(id: string): void {
    this.orderID = id;
  }

  getOrderID(): string | null {
    return this.orderID;
  }

  setOrgID(id: string): void{
    this.orgID = id;
  }

  getOrgID(): string | null {
    return this.orgID;
  }

  setOrderSelected(code: string): void{
    this.OrderSelected = code;
  }

  getOrderSelected(): string | null {
    return this.OrderSelected;
  }

  setPromoCode(code: string): void{
    this.promoCode = code;
  }

  getPromoCode(): string | null {
    return this.promoCode;
  }

  setDiscountLevel(id: string): void{
    this.disCountId = id;
  }

  getDiscountLevel(): string | null {
    return this.disCountId;
  }

  setOrderFilled(isFilled: boolean): void {
    this.orderFilledSubject.next(isFilled);
  }

  setcustomerName(name: string): void{
    this.customerName = name;
  }
  
  getcustomerName(): string | null {
    return this.customerName;
  }

  setOrderPortalAccountNumber(acctNum: string){
    this.op_acctNum = acctNum;
  }

  getOrderPortalAccountNumber(){
    return this.op_acctNum;
  }

  setEmailAddress(email: string){
    this.emailAddr = email;
  }

  getEmalAddress(){
    return this.emailAddr;
  }

  setCompCode(code: string){
    this.compCode = code;
  }

  getCompCode(){
    return this.compCode;
  }

  setTerritory(ter: Array<any>) {
    this.terList = ter;
  }
  
  getTerritory(): Array<any> {
    return this.terList || [];
  }

  //Parts Portal
  setAgentEmail(email: string): void {
    this.agentEmail = email;
  }

  getAgentEmail(){
    return this.agentEmail;
  }

  setPartsAgentID(aid: number): void {
    this.parts_aid = aid;
  }

  getPartsAgentID(){
    return this.parts_aid;
  }

}