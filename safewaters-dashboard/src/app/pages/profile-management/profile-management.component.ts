import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { MatTabsModule } from '@angular/material/tabs';

import { ProfileHistoryComponent } from '../../components/profile-history/profile-history.component';
import { ProfileRulesComponent } from '../../components/profile-rules/profile-rules.component';

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
export class ProfileManagementComponent{
  selectedTabIndex: number = 0;
}
