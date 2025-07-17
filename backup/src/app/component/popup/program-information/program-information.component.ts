import { Component } from '@angular/core';
//import { DialogRef } from '@angular/cdk/dialog';
import { environment } from 'src/environments/environment';
import { AccountService } from 'src/app/apiservice/account.service';

@Component({
  selector: 'app-program-information',
  templateUrl: './program-information.component.html',
  styleUrls: ['./program-information.component.scss']
})

export class ProgramInformationComponent {
  noRecords: boolean = false;
  assetUrl = environment.assetUrl;
  compCode: any;

  constructor(private accountService: AccountService) {
    this.compCode = this.accountService.getCompCode();
    this.loadprogram();
  }

  loadprogram(){
    
  }
  

}
