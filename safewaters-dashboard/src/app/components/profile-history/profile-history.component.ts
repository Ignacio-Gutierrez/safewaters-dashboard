import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { NavigationHistoryService, NavigationHistoryResponse, PaginatedHistoryResponse } from '../../services/navigation-history.service';
import { RuleDetailsDialogComponent } from '../rule-details-dialog/rule-details-dialog.component';

@Component({
  selector: 'app-profile-history',
  imports: [
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
    MatTabsModule,
    MatTooltipModule,
  ],
  templateUrl: './profile-history.component.html',
  styleUrl: './profile-history.component.css'
})
export class ProfileHistoryComponent implements OnInit, AfterViewInit {
  selectedTabIndex: number = 0;

  profileName: string | null = '';
  profileId: string | null = '';

  columnsToDisplay: string[] = ['visited_url', 'visited_at', 'blocked', 'blocking_rule_name', 'rule_details'];
  dataSource = new MatTableDataSource<NavigationHistoryResponse>();

  totalEntities = 0;
  pageSize = 10;
  currentPageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private navigationHistoryService: NavigationHistoryService,
    private dialog: MatDialog
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

    this.navigationHistoryService.getNavigationHistory(String(this.profileId), page, pageSize, false)
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

  viewRuleDetails(row: NavigationHistoryResponse): void {
    if (!row.blocking_rule_id || !row.blocking_rule_name) {
      console.warn('No hay información de regla de bloqueo disponible para esta entrada');
      return;
    }

    this.dialog.open(RuleDetailsDialogComponent, {
      width: '600px',
      data: {
        blocking_rule_enabled: row.blocked,
        blocking_rule_name: row.blocking_rule_name,
        blocking_rule_description: row.blocking_rule_description,
        visited_url: row.visited_url,
        visited_at: row.visited_at
      }
    });
  }
}
