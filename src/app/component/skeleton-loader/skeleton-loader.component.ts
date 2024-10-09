import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { LoaderService } from 'src/app/apiservice/loader.service';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss']
})
export class SkeletonLoaderComponent {
  @Input() rowCount: number = 5; // Number of skeleton rows
  constructor(private loaderService: LoaderService, private cdr: ChangeDetectorRef) {}
  isLoading = false;
  ngOnInit(): void {
    this.loaderService.isLoading$.subscribe(status => {
      setTimeout(() => {
        this.isLoading = status;
      });
      this.cdr.detectChanges();
    });
  }
  get skeletonRows() {
    return Array(this.rowCount).fill(0);
  }
}
