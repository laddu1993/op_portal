import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { MasterService } from 'src/app/apiservice/master.service';
import { LoaderService } from 'src/app/apiservice/loader.service';

interface LoadHistory {
  sku: string;
  date_created: Date;
  quantity: number;
  description: string;
  price: string;
  isLatest?: boolean; // Added to mark the latest SKU
  stock?: number; // For tooltip (mock data)
}

@Component({
  selector: 'app-load-history',
  templateUrl: './load-history.component.html',
  styleUrls: ['./load-history.component.scss']
})
export class LoadHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['sku', 'date_created', 'description', 'quantity'];
  dataSource = new MatTableDataSource<LoadHistory>([]);
  isLoading = true;
  totalRecords = 0;
  assetUrl = environment.assetUrl;
  jsonData: any;
  lastOrderedItem: LoadHistory | null = null;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: MasterService, private loaderService: LoaderService) {}

  ngOnInit(): void {
    this.fetchLoadHistory();
  }

  ngAfterViewInit(): void {
    // These will be overridden anyway after fetchLoadHistory, but no harm keeping them
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }  

  fetchLoadHistory(): void {
    this.service.getLoadHistory().subscribe(data => {
      this.jsonData = data;
      const loadData = this.jsonData.data as LoadHistory[];

      // Sort by date to find the latest
      loadData.sort((a, b) => new Date(b.date_created).getTime() - new Date(a.date_created).getTime());
      
      // Mark the latest SKU
      if (loadData.length > 0) {
        loadData[0].isLatest = true;
        this.lastOrderedItem = loadData[0];
        // Mock stock data for tooltip
        loadData.forEach(item => item.stock = Math.floor(Math.random() * 50) + 10);
      }
      // Correctly reassign the dataSource with MatTableDataSource
      this.dataSource = new MatTableDataSource<LoadHistory>(this.jsonData.data);
      // Critical: paginator/sort MUST be reassigned AFTER new dataSource is created
      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
      this.totalRecords = this.jsonData.data.length;
      this.isLoading = false;
      this.loaderService.hide();
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterByDate(filter: string): void {
    const today = new Date('2025-05-21'); // Using the current date as per the system
    let filteredData = this.jsonData.data as LoadHistory[];

    if (filter === 'last7') {
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      filteredData = filteredData.filter(item => new Date(item.date_created) >= sevenDaysAgo);
    } else if (filter === 'last30') {
      const thirtyDaysAgo = new Date(today);
      thirtyDaysAgo.setDate(today.getDate() - 30);
      filteredData = filteredData.filter(item => new Date(item.date_created) >= thirtyDaysAgo);
    }

    this.dataSource = new MatTableDataSource<LoadHistory>(filteredData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  
  
}