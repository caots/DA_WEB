import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareButtonsConfig } from 'ngx-sharebuttons';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ImageViewerModule } from 'ngx-image-viewer';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { PipesModule } from 'src/app/pipes/pipes.module';
import { PrimaryMenuComponent } from './primary-menu/primary-menu.component';
import { JobCardComponent } from './job-card/job-card.component';
import { HowItWorkItemComponent } from './how-it-work-item/how-it-work-item.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { ModalVerfifyCodeComponent } from './modal-verfify-code/modal-verfify-code.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { MessageCompleteComponent } from './message-complete/message-complete.component';
import { JobCardEmployerComponent } from './job-card-employer/job-card-employer.component';
import { AutocompleteSearchComponent } from './autocomplete-search/autocomplete-search.component';
import { ModalAddJobComponent } from './modal-add-job/modal-add-job.component';
import { SkillRequiredBoxComponent } from './skill-required-box/skill-required-box.component';
import { LoadingJobDetailComponent } from './loading-job-detail/loading-job-detail.component';
import { JobCardJobSeekerComponent } from './job-card-job-seeker/job-card-job-seeker.component';
import { AssesmentCardComponent } from './assesment-card/assesment-card.component';
import { AssessmentsTagComponent } from './assessments-tag/assessments-tag.component';
import { AddNewAssessmentComponent } from './add-new-assessment/add-new-assessment.component';
import { ModalEditAssessmentTagComponent } from './modal-edit-assessment-tag/modal-edit-assessment-tag.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ModalReportCompanyComponent } from './modal-report-company/modal-report-company.component';
import { JobCardDetailsComponent } from './job-card-details/job-card-details.component';
import { JobBookmarkComponent } from './job-bookmark/job-bookmark.component';
import { ModalApplyJobComponent } from './modal-apply-job/modal-apply-job.component';
import { AddAssessmentsComponent } from './add-assessments/add-assessments.component';
import { SearchAssessmentComponent } from './search-assessment/search-assessment.component';
import { AssessmentsCardComponent } from './assessments-card/assessments-card.component';
import { AssessmentItemComponent } from './assessment-item/assessment-item.component';
import { LoadingAssessmentItemComponent } from './loading-assessment-item/loading-assessment-item.component';
import { ModalAddAssessmentToExistsJobComponent } from './modal-add-assessment-to-exists-job/modal-add-assessment-to-exists-job.component';
import { ModalNoteApplicantComponent, NgbDateCustomParserFormatter } from './modal-note-applicant/modal-note-applicant.component';
import { AssessmentsSearchComponent } from './assessments-search/assessments-search.component';
import { LoadingJobDraftComponent } from './loading-job-draft/loading-job-draft.component';
import { ModalTopUpComponent } from './modal-top-up/modal-top-up.component';
import { ModalAddCreditCardComponent } from './modal-add-credit-card/modal-add-credit-card.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ModalAddMembersComponent } from './modal-add-members/modal-add-members.component';
import { ModalInviteNewMemberComponent } from './modal-invite-new-member/modal-invite-new-member.component';
import { ListIconInterviewComponent } from './list-icon-interview/list-icon-interview.component';
import { AvatarUserComponent } from './avatar-user/avatar-user.component';
import { NameUserComponent } from './name-user/name-user.component';
import { LoadingConversationComponent } from './loading-conversation/loading-conversation.component';
import { LoadingDataConversationComponent } from './loading-data-conversation/loading-data-conversation.component';
import { ModalReportJobComponent } from './modal-report-job/modal-report-job.component';
import { ModalPaymentConfirmationComponent } from './modal-payment-confirmation/modal-payment-confirmation.component';
import { ModalReportUserComponent } from './modal-report-user/modal-report-user.component';
import { PaymentMethodsComponent } from './payment-methods/payment-methods.component';
import { BillingHistoryComponent } from './billing-history/billing-history.component';
import { LoadingBillingHistoryComponent } from './loading-billing-history/loading-billing-history.component';
import { ModalPaymentConfirmationComponentJobseeker } from './modal-payment-confirmation-jobseeker/modal-payment-confirmation.component';
import { ModalPaymentAssessmentConfirmationComponent } from './modal-payment-assessment-confirmation/modal-payment-confirmation.component';
import { FooterModalPaymentComponent } from './footer-modal-payment/footer-modal-payment.component';
import { CustomAssessmentInfoComponent } from './custom-assessment-info/custom-assessment-info.component';
import { CustomAssessmentQuestionComponent } from './custom-assessment-question/custom-assessment-question.component';
import { TakeCustomeAssessmentInfoComponent } from './take-custome-assessment-info/take-custome-assessment-info.component';
import { TakeCustomeAssessmentQuestionComponent } from './take-custome-assessment-question/take-custome-assessment-question.component';
import { MyCreditsComponent } from './my-credits/my-credits.component';
import { ResultTakeCustomAssessmentComponent } from './result-take-custom-assessment/result-take-custom-assessment.component';
import { ModalInsertVideoLinkComponent } from './modal-insert-video-link/modal-insert-video-link.component';
import { ModalWebsiteAndSocialLinkComponent } from './modal-website-and-social-link/modal-website-and-social-link.component';
import { ModalAddApplicantsIntoPrivateJobComponent } from './modal-add-applicants-into-private-job/modal-add-applicants-into-private-job.component';
import { ModalNewJobScratchOrTemplateComponent } from './modal-new-job-scratch-or-template/modal-new-job-scratch-or-template.component';
import { ModalAddJobWithThreeStepComponent } from './modal-add-job-with-three-step/modal-add-job-with-three-step.component';
import { CreateJobStep1Component } from './create-job-step1/create-job-step1.component';
import { CreateJobStep2Component, NgbDateCustomStepParserFormatter } from './create-job-step2/create-job-step2.component';
import { ModalListPreviousJobsComponent } from './modal-list-previous-jobs/modal-list-previous-jobs.component';
import { CreateJobStep3Component } from './create-job-step3/create-job-step3.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ModalCropCompanyPhotoComponent } from './modal-crop-company-photo/modal-crop-company-photo.component';
import { ModalTakeAssessmentsToApplyComponent } from './modal-take-assessments-to-apply/modal-take-assessments-to-apply.component';
import { ModalViewImageComponent } from './modal-view-image/modal-view-image.component';
import { ZoomImageComponent } from './zoom-image/zoom-image.component';
import { LyImageCropperModule } from '@alyle/ui/image-cropper';
import {
  LyTheme2,
  StyleRenderer,
  LY_THEME,
  LY_THEME_NAME
} from '@alyle/ui';
import { ChartsModule } from 'ng2-charts';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { MinimaLight, MinimaDark } from '@alyle/ui/themes/minima';

import { FooterComponent } from './footer/footer.component';
import { UserSayingSliderComponent } from './user-saying-slider/user-saying-slider.component';
import { GetStartedTodayComponent } from './get-started-today/get-started-today.component';
import { FindYourNextJobComponent } from './find-your-next-job/find-your-next-job.component';
import { FeaturedAssessmentsComponent } from './featured-assessments/featured-assessments.component';
import { SkillWorksComponent } from './skill-works/skill-works.component';
import { FeaturedJobsComponent } from './featured-jobs/featured-jobs.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FollowEmployersComponent } from './follow-employers/follow-employers.component';
import { environment } from 'src/environments/environment';
import { MeasuredSkillsComponent } from './measured-skills/measured-skills.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JobEmployerComponent } from './job-employer/job-employer.component';
import { OurPricingComponent } from './our-pricing/our-pricing.component';
import { FreqentlyAskedQuestionsComponent } from './freqently-asked-questions/freqently-asked-questions.component';
import { HowMeasuredskillsHelpComponent } from './how-measuredskills-help/how-measuredskills-help.component';
import { DoughnutChartComponent } from './doughnut-chart/doughnut-chart.component';
import { OurBlogComponent } from './our-blog/our-blog.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UpdateProfileCompanyComponent } from './update-profile-company/update-profile-company.component';
import { UpdateInformationCompanyComponent } from './update-information-company/update-information-company.component';
import { CreateJobStep0Component } from './create-job-step0/create-job-step0.component';
import { QuillModule } from 'ngx-quill'

import { MsPreviewFileComponent } from './preview-file/preview-file.component';
import { ModalPreviewFileComponent } from './modal-preview-file/modal-preview-file.component';
import { ModalConfirmVerificationEmailComponent } from './modal-confirm-verification-email/modal-confirm-verification-email.component';
import { MsCandidateItemComponent } from './ms-candidate-item/ms-candidate-item.component';
import { ModalInviteJobCandidateComponent } from './modal-invite-job-candidate/modal-invite-job-candidate.component';
import { ModalChangeWeightAssessmentComponent } from './modal-change-weight-assessment/modal-change-weight-assessment.component';
import { EmployerFaqComponent } from './employer-faq/employer-faq.component';
import { FollowerChartComponent } from './follower-chart/follower-chart.component';
import { RecruitmentFunnelComponent } from './recruitment-funnel/recruitment-funnel.component';
import { ModalUpgrageJobPostingComponent, NgbDateCustomUpgradeParserFormatter } from './modal-upgrage-job-posting/modal-upgrage-job-posting.component';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { UpgradeJobStep0Component } from './upgrade-job-step0/upgrade-job-step0.component';
import { UpgradeJobStep1Component } from './upgrade-job-step1/upgrade-job-step1.component';
import { ModalStepShoppingCartComponent } from './modal-step-shopping-cart/modal-step-shopping-cart.component';
import { PaymentShoppingCartStep1Component } from './payment-shopping-cart-step1/payment-shopping-cart-step1.component';
import { HowMeasuredskillsComparesComponent } from './how-measuredskills-compares/how-measuredskills-compares.component';
import { NotificationComponent } from './notification/notification.component';
import { FooterBottomComponent } from './footer-bottom/footer-bottom.component';
import { ModalPaymentDirectMessageComponent } from './modal-payment-direct-message/modal-payment-direct-message.component';
import { ModalPaymentAssessmentComponent } from './modal-payment-assessment/modal-payment-assessment.component';
import { BillingInfomationComponent } from './billing-infomation/billing-infomation.component';
import { FormInputError } from './form-input-error/index.component';
import { JobCardPreviewEmployerComponent } from './job-card-preview-employer/job-card-preview-employer.component';
import { ModalConfirmFreePaymentComponent } from './modal-confirm-free-payment/modal-confirm-free-payment.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ModalAlertComponent } from './modal-alert/modal-alert.component';
import { PopupSignUpComponent } from './popup-sign-up/popup-sign-up.component';
import { ModalShareUserHistoryComponent } from './modal-share-user-history/modal-share-user-history.component';
import { ModalUserStoryViewComponent } from './modal-user-story-view/modal-user-story-view.component'

const customConfig: ShareButtonsConfig = {
  include: ['facebook', 'twitter', 'email'],
  theme: 'modern-light',
  // gaTracking: true,
};
const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};
@NgModule({
  declarations: [
    PrimaryMenuComponent,
    JobCardComponent,
    HowItWorkItemComponent,
    ModalVerfifyCodeComponent,
    ModalConfirmComponent,
    MessageCompleteComponent,
    JobCardEmployerComponent,
    AutocompleteSearchComponent,
    ModalAddJobComponent,
    SkillRequiredBoxComponent,
    LoadingJobDetailComponent,
    JobCardJobSeekerComponent,
    AssesmentCardComponent,
    AssessmentsTagComponent,
    AddNewAssessmentComponent,
    ModalEditAssessmentTagComponent,
    PaginationComponent,
    ModalReportCompanyComponent,
    JobCardDetailsComponent,
    JobBookmarkComponent,
    ModalApplyJobComponent,
    AddAssessmentsComponent,
    SearchAssessmentComponent,
    AssessmentsCardComponent,
    AssessmentItemComponent,
    LoadingAssessmentItemComponent,
    ModalAddAssessmentToExistsJobComponent,
    ModalNoteApplicantComponent,
    AssessmentsSearchComponent,
    LoadingJobDraftComponent,
    ModalTopUpComponent,
    ModalAddCreditCardComponent,
    ChangePasswordComponent,
    ModalAddMembersComponent,
    ModalInviteNewMemberComponent,
    ListIconInterviewComponent,
    AvatarUserComponent,
    NameUserComponent,
    LoadingConversationComponent,
    LoadingDataConversationComponent,
    ModalReportJobComponent,
    ModalPaymentConfirmationComponent,
    ModalReportUserComponent,
    PaymentMethodsComponent,
    LoadingBillingHistoryComponent,
    BillingHistoryComponent,
    ModalPaymentConfirmationComponentJobseeker,
    ModalPaymentAssessmentConfirmationComponent,
    FooterModalPaymentComponent,
    FormInputError,
    CustomAssessmentInfoComponent,
    CustomAssessmentQuestionComponent,
    TakeCustomeAssessmentInfoComponent,
    TakeCustomeAssessmentQuestionComponent,
    MyCreditsComponent,
    ResultTakeCustomAssessmentComponent,
    ModalInsertVideoLinkComponent,
    ModalWebsiteAndSocialLinkComponent,
    ModalAddApplicantsIntoPrivateJobComponent,
    ModalNewJobScratchOrTemplateComponent,
    ModalAddJobWithThreeStepComponent,
    CreateJobStep1Component,
    CreateJobStep2Component,
    ModalListPreviousJobsComponent,
    CreateJobStep3Component,
    ModalListPreviousJobsComponent,
    ModalCropCompanyPhotoComponent,
    ModalTakeAssessmentsToApplyComponent,
    ModalViewImageComponent,
    ZoomImageComponent,
    FooterComponent,
    UserSayingSliderComponent,
    GetStartedTodayComponent,
    FindYourNextJobComponent,
    FeaturedAssessmentsComponent,
    SkillWorksComponent,
    FeaturedJobsComponent,
    FollowEmployersComponent,
    MeasuredSkillsComponent,
    JobEmployerComponent,
    OurPricingComponent,
    FreqentlyAskedQuestionsComponent,
    HowMeasuredskillsHelpComponent,
    DoughnutChartComponent,
    OurBlogComponent,
    UpdateProfileCompanyComponent,
    UpdateInformationCompanyComponent,
    CreateJobStep0Component,
    MsPreviewFileComponent,
    ModalPreviewFileComponent,
    ModalConfirmVerificationEmailComponent,
    MsCandidateItemComponent,
    ModalInviteJobCandidateComponent,
    ModalChangeWeightAssessmentComponent,
    EmployerFaqComponent,
    FollowerChartComponent,
    RecruitmentFunnelComponent,
    HowMeasuredskillsComparesComponent,
    NotificationComponent,
    FooterBottomComponent,
    ModalUpgrageJobPostingComponent,
    UpgradeJobStep0Component,
    UpgradeJobStep1Component,
    ModalStepShoppingCartComponent,
    PaymentShoppingCartStep1Component,
    HowMeasuredskillsComparesComponent,
    ModalPaymentDirectMessageComponent,
    ModalPaymentAssessmentComponent,
    BillingInfomationComponent,
    JobCardPreviewEmployerComponent,
    ModalConfirmFreePaymentComponent,
    ModalAlertComponent,
    PopupSignUpComponent,
    ModalShareUserHistoryComponent,
    ModalUserStoryViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    ShareIconsModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularSvgIconModule.forRoot(),
    ShareButtonsModule.withConfig(customConfig),
    // ShareButtonsModule,
    FontAwesomeModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    DirectivesModule,
    ImageCropperModule,
    LyImageCropperModule,
    DragDropModule,
    QuillModule,
    RecaptchaV3Module,
    ImageViewerModule,
    NgSelectModule,
    SwiperModule,
    ChartsModule,
    YouTubePlayerModule,
    NgxDocViewerModule,
  ],
  exports: [
    PrimaryMenuComponent,
    JobCardComponent,
    HowItWorkItemComponent,
    ModalVerfifyCodeComponent,
    ModalConfirmComponent,
    MessageCompleteComponent,
    JobCardEmployerComponent,
    AutocompleteSearchComponent,
    ModalAddJobComponent,
    SkillRequiredBoxComponent,
    JobCardJobSeekerComponent,
    AssesmentCardComponent,
    JobCardJobSeekerComponent,
    LoadingJobDetailComponent,
    AssessmentsTagComponent,
    AddNewAssessmentComponent,
    ModalEditAssessmentTagComponent,
    PaginationComponent,
    ModalReportCompanyComponent,
    JobCardDetailsComponent,
    JobBookmarkComponent,
    AddAssessmentsComponent,
    SearchAssessmentComponent,
    AssessmentsCardComponent,
    AssessmentItemComponent,
    LoadingAssessmentItemComponent,
    ModalAddAssessmentToExistsJobComponent,
    ModalNoteApplicantComponent,
    LoadingJobDraftComponent,
    ModalTopUpComponent,
    ChangePasswordComponent,
    ModalAddMembersComponent,
    ModalInviteNewMemberComponent,
    ListIconInterviewComponent,
    AvatarUserComponent,
    NameUserComponent,
    LoadingConversationComponent,
    LoadingDataConversationComponent,
    ModalReportJobComponent,
    ModalPaymentConfirmationComponent,
    ModalReportUserComponent,
    PaymentMethodsComponent,
    LoadingBillingHistoryComponent,
    BillingHistoryComponent,
    ModalPaymentConfirmationComponentJobseeker,
    ModalPaymentAssessmentConfirmationComponent,
    FooterModalPaymentComponent,
    FormInputError,
    CustomAssessmentInfoComponent,
    CustomAssessmentQuestionComponent,
    TakeCustomeAssessmentInfoComponent,
    TakeCustomeAssessmentQuestionComponent,
    MyCreditsComponent,
    ResultTakeCustomAssessmentComponent,
    ModalWebsiteAndSocialLinkComponent,
    ModalInsertVideoLinkComponent,
    ModalAddApplicantsIntoPrivateJobComponent,
    ModalNewJobScratchOrTemplateComponent,
    ModalAddJobWithThreeStepComponent,
    CreateJobStep1Component,
    CreateJobStep2Component,
    CreateJobStep3Component,
    ModalListPreviousJobsComponent,
    ModalCropCompanyPhotoComponent,
    ModalTakeAssessmentsToApplyComponent,
    FooterComponent,
    UserSayingSliderComponent,
    GetStartedTodayComponent,
    FindYourNextJobComponent,
    FeaturedAssessmentsComponent,
    SkillWorksComponent,
    FeaturedJobsComponent,
    ModalViewImageComponent,
    FollowEmployersComponent,
    MeasuredSkillsComponent,
    JobEmployerComponent,
    OurPricingComponent,
    FreqentlyAskedQuestionsComponent,
    HowMeasuredskillsHelpComponent,
    DoughnutChartComponent,
    OurBlogComponent,
    UpdateProfileCompanyComponent,
    UpdateInformationCompanyComponent,
    CreateJobStep0Component,
    MsPreviewFileComponent,
    ModalPreviewFileComponent,
    ModalConfirmVerificationEmailComponent,
    MsCandidateItemComponent,
    ModalInviteJobCandidateComponent,
    ModalChangeWeightAssessmentComponent,
    EmployerFaqComponent,
    FollowerChartComponent,
    RecruitmentFunnelComponent,
    HowMeasuredskillsComparesComponent,
    NotificationComponent,
    FooterBottomComponent,
    ModalUpgrageJobPostingComponent,
    UpgradeJobStep0Component,
    UpgradeJobStep1Component,
    ModalStepShoppingCartComponent,
    PaymentShoppingCartStep1Component,
    HowMeasuredskillsComparesComponent,
    ModalPaymentDirectMessageComponent,
    ModalPaymentAssessmentComponent,
    BillingInfomationComponent,
    JobCardPreviewEmployerComponent,
    ModalConfirmFreePaymentComponent,
    ModalAlertComponent,
    PopupSignUpComponent,
    ModalShareUserHistoryComponent,
    ModalUserStoryViewComponent
  ],
  providers: [
    [LyTheme2],
    [StyleRenderer],
    { provide: LY_THEME_NAME, useValue: 'minima-light' },
    { provide: LY_THEME, useClass: MinimaLight, multi: true },
    { provide: LY_THEME, useClass: MinimaDark, multi: true },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomStepParserFormatter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomUpgradeParserFormatter },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    {
      provide: SWIPER_CONFIG,
      useValue: DEFAULT_SWIPER_CONFIG
    },
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.reCaptchaV3SiteKey
    }
  ]
})

export class ComponentsModule { }
