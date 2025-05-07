import { Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { LoginComponent } from './components/pages/login/login.component';
import { OtpComponent } from './components/pages/otp/otp.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { ForgotPasswordComponent } from './components/pages/forgot-password/forgot-password/forgot-password.component';
import { UpdatePasswordComponent } from './components/pages/update-password/update-password/update-password.component';
import { NavbarComponent } from './components/navbar /navbar/navbar.component';
import { ConfigurationComponent } from './components/pages/cofiguration/configuration/configuration.component';
import { AdministrationComponent } from './components/pages/administration/administration.component';
import { LicenseManagementComponent } from './components/pages/license-management/license-management/license-management.component';
import { UserManagementComponent } from './components/pages/user-management/user-management/user-management.component';
import { ReportsComponent } from './components/pages/reports/reports.component';
import { ObjectComponent } from './components/pages/object/object/object.component';
import { AccessComponent } from './components/pages/extras/extras/access.component';
import { RolesComponent } from './components/pages/roles/roles/roles.component';
import { RolesaddComponent } from './components/pages/rolesadd/ rolesadd/rolesadd.component';
import { RolesmanagementComponent } from './components/pages/rolesmanagement/rolesmanagement/rolesmanagement.component';
import { EventsComponent } from './components/pages/events/events/events.component';
import { CanteenConfigurationComponent } from './components/pages/canteen-configration/canteen-configuration/canteen-configuration.component';
import { CanteenComponent } from './components/pages/canteen/canteen/canteen.component';
import { AddreportComponent } from './components/pages/addreport/addreport/addreport.component';
import { ProcessAndAutomationComponent } from './components/pages/process-and-automation/process-and-automation/process-and-automation.component';
import { RoleseditComponent } from './components/pages/rolesedit/rolesedit/rolesedit.component';
import { AddRoleaccessComponent } from './components/pages/add-roleaccess/add-roleaccess/add-roleaccess.component';

import { ExtrasroleComponent } from './components/pages/extrasrole/extrasrole/extrasrole.component';
import { CoupenComponent } from './components/pages/coupen/coupen/coupen.component';
import { ReportSummaryComponent } from './components/pages/report-summary/report-summary.component';
import { ConsolidatedReportComponent } from './components/pages/consolidated-report/consolidated-report/consolidated-report.component';






export const routes: Routes =[

  { path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  {
     path: 'login', 
     component: LoginComponent 
  },
  
  { 
    path: 'otp', 
    component: OtpComponent 
  },
  { 
    path: 'signup', 
    component: SignupComponent
  },
  {
    path:'forgot-password',
    component:ForgotPasswordComponent
  },

  {   path: 'update-password', 
      component:UpdatePasswordComponent
  },
  
  {
    path: '',
    component: NavbarComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Default: Dashboard
      { path: 'dashboard', component: DashboardComponent },
      { path:'configuration',component:ConfigurationComponent},
      { path:'license-management',component:LicenseManagementComponent},
      { path:'user-management',component:UserManagementComponent},
      { path:'reports',component:ReportsComponent},
      { path:'object',component:ObjectComponent},
      { path:'access',component:AccessComponent},
      { path:'roles',component:RolesComponent},
      { path:'rolesadd',component:RolesaddComponent},

      {path:'rolesmanagement',component:RolesmanagementComponent},
      {path:'events',component:EventsComponent},
      {path:'canteen',component:CanteenComponent},
      {path:'canteen-configuration',component:CanteenConfigurationComponent},
      {path:'addreport',component:AddreportComponent},
      {path:'process-and-automation',component:ProcessAndAutomationComponent},
      // {path:'rolesedit',component:RoleseditComponent},
     {path:'add-roleaccess',component:AddRoleaccessComponent},
     {path:'extrasrole',component:ExtrasroleComponent},
     { path: 'rolesedit/:roleId', component: RoleseditComponent }, // ✅ Dynamic roleId route
     { path: 'rolesedit', component: RoleseditComponent },
    
      {path:'coupen',component:CoupenComponent},
      // {path:'report-summary/:reportName',component:ReportSummaryComponent}
      { path: 'report-summary', component: ReportSummaryComponent },
      {path:'consolidated-report',component: ConsolidatedReportComponent},
           


  

    ]
  }

  
  
];
