import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'src/app/apiservice/account.service';
import { EncryptionService } from 'src/app/apiservice/encryption.service';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @Output() submitOrderEvent = new EventEmitter<void>();
  orderDetailsDisabled = true; // Initial state: Order Details tab is disabled
  isOrderFilled = false;
  showAccountInfo: boolean = false;
  assetUrl = environment.assetUrl;
  @ViewChild('tabGroup', { static: false }) tabGroup!: MatTabGroup;
  isShown = false;
  isDefault = true;
  isSubmitting: boolean = false;  // Variable to track if order is being submitted
  envName = environment.name;
  isUATMode: boolean = environment.production;

  constructor(
    private titleService: Title,
    private encryptionService: EncryptionService,
    private dialog: MatDialog,
    private dataService: AccountService,
    private cdr: ChangeDetectorRef,
    private acctService: AccountService
  ) { }

  private checkOrderFilled(isFilled: boolean): boolean {
    if (isFilled) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Husqvarna - Order Builder');
    this.subscribeToData();
    this.subscribeToAccountData();
    this.subscribeToDefaultPage();
    
    const aid = '615';
    const encryptedAid = this.encryptionService.encrypt(aid);
    //console.log('VL encryptedAid: ' + encryptedAid);

    const acct = '54321';
    const encryptedAcct = this.encryptionService.encrypt(acct);
    //console.log('VL encryptedAcct: ' + encryptedAcct);

    this.dataService.orderFilled$.pipe(take(2)).subscribe(isFilled => {
      this.isOrderFilled = this.checkOrderFilled(isFilled);
    });

    // Subscribe to the submitting status from the service
    this.acctService.isSubmitting$.subscribe((status: boolean) => {
      this.isSubmitting = status;
    });
  }

  selectCustomerInfoTab(): void {
    this.tabGroup.selectedIndex = 0;
    const output = { default: true };
    this.dataService.emitCustomerData(output);
    this.isShown = false;
    this.orderDetailsDisabled = true;
  }

  subscribeToDefaultPage(): void {
    this.dataService.getshowDefaultPage().subscribe(res => {
      if (res && res.default !== undefined) {
        this.isDefault = res.default;
      }
    });
  }

  subscribeToData(): void {
    this.dataService.getDataEmitter().subscribe(res => {  
      if (res.showBtn) {
        this.orderDetailsDisabled = false;
      }
    });
  }

  subscribeToAccountData(): void {
    this.dataService.getShowAccountInfoEmitter().subscribe(res => {
      if (res !== null && res !== undefined && res.showAccountInfo !== undefined) {
        this.showAccountInfo = res.showAccountInfo;
        this.cdr.detectChanges();  // Manually trigger change detection
      }
    });
  }

  submitOrder(): void {
    this.submitOrderEvent.emit();
  }

}