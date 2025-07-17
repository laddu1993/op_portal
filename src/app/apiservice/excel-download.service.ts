import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
//import * as XLSX from 'xlsx';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExcelDownloadService {

  private isMode = environment.production;
  private apiUrl = !this.isMode ? environment.uatApiBaseUrl : environment.prodApiBaseUrl;
  acct: string | null = null;
  private compCode: string | null = null;
  constructor(private http: HttpClient, private accountService: AccountService ) { }

  downloadExcelFile(): Observable<Blob> {
    this.acct = this.accountService.getAccount(); // Get the acct parameter
    //console.log('VL acct', this.acct);
    this.compCode = this.accountService.getCompCode();
    //console.log('VL compCode', this.compCode);
    return this.http.get(this.apiUrl+`pp_excel_download?compCode=`+this.compCode+`&acctNum=`+ this.acct, { responseType: 'blob' });
  }

  saveExcelFile(data: Blob, fileName: string): void {
    saveAs(data, fileName);
  }

}