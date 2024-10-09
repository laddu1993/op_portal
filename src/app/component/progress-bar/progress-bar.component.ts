import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { LoaderService } from 'src/app/apiservice/loader.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  isLoading = false;

  constructor(private loaderService: LoaderService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe(status => {
      setTimeout(() => {
        this.isLoading = status;
      });
      this.cdr.detectChanges();
    });
  }
}
