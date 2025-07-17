import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent {
  assetUrl = environment.assetUrl;
  envName = environment.name;
  isUATMode: boolean = environment.production;

}
