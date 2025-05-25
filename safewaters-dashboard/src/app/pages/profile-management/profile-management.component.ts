import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common'; // Importa DatePipe
import { MatCardModule } from '@angular/material/card';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { NavigationHistoryService, NavigationHistoryResponse, PaginatedHistoryResponse } from '../../services/navigation-history.service';

@Component({
  selector: 'app-profile-management',
  imports: [
    NavbarComponent,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    ScrollingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.css'
})
export class ProfileManagementComponent implements OnInit, AfterViewInit {
  profileName: string | null = '';
  profileId: string | null = '';

  columnsToDisplay: string[] = ['visited_url', 'visited_date', 'was_blocked', 'blocking_rule_id'];
  dataSource = new MatTableDataSource<NavigationHistoryResponse>();

  totalEntities = 0;
  pageSize = 10;
  currentPageIndex = 0;
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private navigationHistoryService: NavigationHistoryService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id');
      const nameFromUrl = params.get('name');
      if (nameFromUrl) {
        this.profileName = decodeURIComponent(nameFromUrl);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    if (this.paginator) {
        this.pageSize = this.paginator.pageSize;
        this.currentPageIndex = this.paginator.pageIndex;
    }
    this.loadNavigationData();
  }

  loadNavigationData(): void {
    if (!this.profileId) {
      console.error('Profile ID no está disponible para cargar el historial.');
      this.dataSource.data = [];
      this.totalEntities = 0;
      return;
    }

    const page = this.currentPageIndex + 1;
    const pageSize = this.pageSize;

    this.navigationHistoryService.getNavigationHistory(Number(this.profileId), page, pageSize)
      .subscribe({
        next: (response: PaginatedHistoryResponse) => { 
          if (response && typeof response.total_items === 'number' && Array.isArray(response.items)) {
            this.dataSource.data = response.items;
            this.totalEntities = response.total_items;
          } else {
            console.warn('La respuesta del historial de navegación no tiene el formato PaginatedHistoryResponse esperado (items y total_items).');
            this.dataSource.data = [];
            this.totalEntities = 0;
          }
        },
        error: (error) => {
          console.error('Error loading navigation history:', error);
          this.dataSource.data = [];
          this.totalEntities = 0;
        }
      });
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPageIndex = event.pageIndex;
    this.loadNavigationData();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.searchTerm = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createRule() {
    console.log('Creating a new rule for profile ID:', this.profileId);
  }
}
