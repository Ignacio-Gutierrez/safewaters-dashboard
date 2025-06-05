import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatTabsModule } from '@angular/material/tabs';

import { ProfileHistoryComponent } from '../../components/profile-history/profile-history.component';
import { ProfileRulesComponent } from '../../components/profile-rules/profile-rules.component';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile-management',
  imports: [
    NavbarComponent,
    MatTabsModule,
    ProfileHistoryComponent,
    ProfileRulesComponent
  ],
  templateUrl: './profile-management.component.html',
  styleUrl: './profile-management.component.css'
})
export class ProfileManagementComponent implements OnInit {
  selectedTabIndex: number = 0;
  profileId: string = '';
  profileName: string = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.profileId = params.get('id') || '';
      const nameFromUrl = params.get('name');
      if (nameFromUrl) {
        this.profileName = decodeURIComponent(nameFromUrl);
      }
    });
  }
}
