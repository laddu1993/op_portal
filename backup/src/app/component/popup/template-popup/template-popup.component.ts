import { Component, OnInit, ViewChild, Output, EventEmitter, Inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MasterService } from 'src/app/apiservice/master.service';
import { Templates } from 'src/app/Model/UserObject';
import { DialogRef } from '@angular/cdk/dialog';
import { DealerInfoComponent } from '../../dealer-info/dealer-info.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from 'src/app/apiservice/loader.service';
import { DOCUMENT } from '@angular/common';
import { AccountService } from 'src/app/apiservice/account.service';
import { GeneralOutputComponent } from '../general-output/general-output.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-template-popup',
  templateUrl: './template-popup.component.html',
  styleUrls: ['./template-popup.component.scss']
})
export class TemplatePopupComponent  implements OnInit{
  noRecords: boolean = false;
  messages: string[] = [];
  templatelist !: Templates[];
  dataSource: any;
  jsonData: any;
  displayedColumns: string[] = ["name", "created", "updated", "submitted", "project_code", 'actions'];
  @ViewChild(MatPaginator) paginatior !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  @Output() elementEdited = new EventEmitter<any>(); // Event emitter to notify parent
  assetUrl = environment.assetUrl;
  isLoading = true; // Initialize the loading flag

  constructor(
    private acctService: AccountService,
    private service: MasterService, 
    public dialogRef: DialogRef, 
    private dialog: MatDialog, 
    @Inject(DOCUMENT) private document: Document, 
    private loadService: LoaderService) 
  { }

  ngOnInit(): void {
    this.templatelisting();
  }

  templatelisting(): void {
    this.loadService.show();
    // Retrieve the quote type and orgID
    const quote = this.acctService.getOrderSelected();
    const orgID = this.acctService.getOrgID();
    // Determine if orgID should be passed based on quote type
    const shouldIncludeOrgID = quote === 'Dealer' && orgID;
    // Determine the appropriate call based on whether orgID is included
    const templateObservable = shouldIncludeOrgID ?
      this.service.getTemplates(orgID) :
      this.service.getTemplates(); // Assuming the method can handle no parameters
    templateObservable.subscribe({
      next: (res) => {
        this.jsonData = res;
        this.templatelist = this.jsonData.results;
        // Format the submitted date in each template
        this.templatelist.forEach(template => this.formatDateFields(template));
        // Set up the data source for the table
        this.dataSource = new MatTableDataSource < Templates > (this.templatelist);
        this.dataSource.paginator = this.paginatior;
        this.dataSource.sort = this.sort;
        // Hide the loading spinner
        this.loadService.hide();
        // Check if the results are empty
        this.noRecords = this.templatelist.length === 0;
      },
      error: (err) => {
        // Handle errors appropriately
        console.error('Failed to load templates:', err);
        this.loadService.hide();
        // Optionally, display an error message to the user
        this.dialog.open(GeneralOutputComponent, {
          data: {
            message: 'An error occurred while loading templates. Please try again later.',
            reload: false
          }
        });
      }
    });
    // Handle the case where no account is selected
    if (!orgID && quote === 'dealer') {
      this.loadService.hide();
      this.dialog.open(GeneralOutputComponent, {
        data: {
          message: 'No account is selected. Please select an account to display the template listing.',
          reload: false
        }
      });
    }
  }

  formatDateFields(template: any) {
    ['created', 'updated', 'submitted'].forEach(field => {
      if (template[field]) {
        template[field] = this.formatDate(template[field]);
      }
    });
  }

  formatDate(dateStr: string) {
    const date = new Date(dateStr);

    // Format the date to 'd M Y'
    const day = ("0" + date.getDate()).slice(-2);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    // Format the time to 12-hour format with AM/PM
    let hours = date.getHours();
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 hour to 12
    const formattedTime = hours + ':' + minutes + ' ' + ampm;

    // Combine the date and time
    return `${day} ${month} ${year} ${formattedTime}`;
  }

  editElement(element: Templates) {
    this.isLoading = false;
    // Implement your edit logic here
    const orderID = element.id;
    // Call getOrderPortalProductAPI when editing an element
    this.loadService.show();
    this.service.getLoadOrder(orderID).subscribe(data => {
      this.dialogRef.close(TemplatePopupComponent);
      this.acctService.setcustomerName(data.order_details[0].name || '');
      // Implement logic to handle the received data
      this.elementEdited.emit(data); // Emit the data to parent
      this.loadService.hide();
    });
  }

  deleteElement(element: Templates) {
    // Implement your delete logic here
    //console.log('Delete element:', element.id);
    const orderID = element.id;
    this.service.deleteTemplate(orderID).subscribe(data => {
      let output = { message: 'Template deleted successfully.', 'reload': false };
      this.dialog.open(GeneralOutputComponent, { data: output });
      this.templatelisting();
    })
  }

  closePopup(): void {
    this.dialogRef.close(TemplatePopupComponent);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
