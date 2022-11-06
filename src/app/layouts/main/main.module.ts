import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { JobSeekerGuard } from 'src/app/guards/job-seeker.guard';
import { EmployerGuard } from 'src/app/guards/employer.guard';
import { HomePageGuard } from 'src/app/guards/home-page.guard';
import { ListJobJobseekerGuard } from 'src/app/guards/list-job-jobseeker.guard';
import { MainComponent } from 'src/app/layouts/main/main.component';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing-jobseeker',
    pathMatch: 'full'
  },
  {
    path: 'home',
    canActivate: [HomePageGuard],
    loadChildren: () => import('src/app/pages/home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'landing-employer',
    canActivate: [HomePageGuard],
    loadChildren: () => import('src/app/pages/landing-employer/landing-employer.module').then(m => m.LandingEmployerModule),
  },
  {
    path: 'employer',
    canActivate: [HomePageGuard],
    loadChildren: () => import('src/app/pages/landing-employer/landing-employer.module').then(m => m.LandingEmployerModule),
  },
  {
    path: 'employers',
    canActivate: [HomePageGuard],
    loadChildren: () => import('src/app/pages/landing-employer/landing-employer.module').then(m => m.LandingEmployerModule),
  },
  {
    path: 'landing-jobseeker',
    canActivate: [HomePageGuard],
    loadChildren: () => import('src/app/pages/landing-jobseeker/landing-jobseeker.module').then(m => m.LandingJobseekerModule),
  },
  {
    path: 'jobseeker',
    canActivate: [HomePageGuard],
    loadChildren: () => import('src/app/pages/landing-jobseeker/landing-jobseeker.module').then(m => m.LandingJobseekerModule),
  },
  {
    path: 'job-seeker',
    canActivate: [HomePageGuard],
    loadChildren: () => import('src/app/pages/landing-jobseeker/landing-jobseeker.module').then(m => m.LandingJobseekerModule),
  },
  {
    path: 'jobseekers',
    canActivate: [HomePageGuard],
    loadChildren: () => import('src/app/pages/landing-jobseeker/landing-jobseeker.module').then(m => m.LandingJobseekerModule),
  },
  {
    path: 'job-seekers',
    canActivate: [HomePageGuard],
    loadChildren: () => import('src/app/pages/landing-jobseeker/landing-jobseeker.module').then(m => m.LandingJobseekerModule),
  },
  {
    path: 'employer-dashboard',
    canActivate: [EmployerGuard],
    loadChildren: () => import('src/app/pages/employer/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'employer-settings',
    canActivate: [EmployerGuard],
    loadChildren: () => import('src/app/pages/employer/company-settings/company-settings.module').then(m => m.CompanySettingsModule)
  },
  {
    path: 'preview-employer',
    canActivate: [EmployerGuard],
    loadChildren: () => import('src/app/pages/employer/preview-job-employer/preview-job-emplyer.module').then(m => m.PreviewJobEmployerModule)
  },
  {
    path: 'employer-profile/:type',
    canActivate: [EmployerGuard],
    loadChildren: () => import('src/app/pages/employer/employer-profile/employer-profile.module').then(m => m.EmployerProfileModule)
  },
  {
    path: 'applicants',
    canActivate: [EmployerGuard],
    loadChildren: () => import('src/app/pages/employer/applicants/applicants.module').then(m => m.ApplicantsModule)
  },
  {
    path: 'employer-assessments',
    canActivate: [EmployerGuard],
    loadChildren: () => import('src/app/pages/employer/assessments/assessments.module').then(m => m.AssessmentsModule)
  },
  {
    path: 'add-custom-assessments',
    canActivate: [EmployerGuard],
    loadChildren: () => import('src/app/pages/employer/add-custom-assessments/add-custom-assessments.module').then(m => m.AddCustomAssessmentsModule)
  },
  {
    // path: 'employer-messages/:groupId/:jobId',
    path: 'employer-messages',
    canActivate: [EmployerGuard],
    loadChildren: () => import('src/app/pages/employer/messages/messages.module').then(m => m.MessagesModule)
  },
  {
    path: 'shopping-card',
    canActivate: [EmployerGuard],
    loadChildren: () => import('src/app/pages/employer/shopping-card/shopping-card.module').then(m => m.ShoppingCardModule)
  },
  {
    path: 'job-seeker-settings',
    canActivate: [JobSeekerGuard],
    loadChildren: () => import('src/app/pages/job-seeker/job-seeker-settings/job-seeker-settings.module').then(m => m.JobSeekerSettingsModule)
  },
  {
    path: 'job-seeker-profile/:type',
    canActivate: [JobSeekerGuard],
    loadChildren: () => import('src/app/pages/job-seeker/job-seeker-profile/job-seeker-profile.module').then(m => m.JobSeekerProfileModule)
  },
  {
    path: 'job-seeker-assessments',
    canActivate: [JobSeekerGuard],
    loadChildren: () => import('src/app/pages/job-seeker/assessments/assessments.module').then(m => m.AssessmentsModule)
  },
  {
    path: 'job-seeker-test-assessments',
    canActivate: [JobSeekerGuard],
    loadChildren: () => import('src/app/pages/job-seeker/test-assessment/test-assessment.module').then(m => m.TestAssessmentModule)
  },
  {
    path: 'job',
    canActivate: [ListJobJobseekerGuard],
    loadChildren: () => import('src/app/pages/job-seeker/job-seeker-dashboard/job-seeker-dashboard.module').then(m => m.JobSeekerDashboardModule)
  },
  {
    path: 'job/:slug',
    // canActivate: [JobSeekerGuard],
    loadChildren: () => import('src/app/pages/job-seeker/job-details/job-details.module').then(m => m.JobDetailsModule)
  },
  {
    path: 'company/:slug',
    // canActivate: [JobSeekerGuard],
    loadChildren: () => import('src/app/pages/job-seeker/job-details/job-details.module').then(m => m.JobDetailsModule)
  },
  // {
  //   path: 'company/:slug',
  //   loadChildren: () => import('src/app/pages/job-seeker/company-info/company-info.module').then(m => m.CompanyInfoModule)
  // },
  {
    // path: 'messages/:groupId/:jobId',
    path: 'messages',
    canActivate: [JobSeekerGuard],
    loadChildren: () => import('src/app/pages/job-seeker/messages/messages.module').then(m => m.MessagesModule)
  },
]

@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild([{
      path: '',
      component: MainComponent,
      children: routes,
      
    }])
  ]
})
export class MainModule { }
