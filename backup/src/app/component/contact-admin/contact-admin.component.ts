import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contact-admin',
  templateUrl: './contact-admin.component.html',
  styleUrls: ['./contact-admin.component.css']
})
export class ContactAdminComponent {
  assetUrl = environment.assetUrl;
  envName = environment.name;
  isUATMode: boolean = environment.uat;
}
