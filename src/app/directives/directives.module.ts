import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoadingButtonDirective } from './loading-button.directive';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { IntegersOnlyDirective } from './integers-only.directive';
import { IgnoreEmojiIconDirective } from './ignore-emoji-icon.directive';
import { SharesButtonDirective } from './shares-button.directive';
import { ViewMoreDirective } from './view-more.directive';
import { ViewPhotoDirective } from './view-photos';
import { ViewListJobsDirective } from './messages-view-list-job';
import { ToggleAccordionDirective } from './toggle-accordion-directive';
import { DragAndDropDirective } from './drag-and-drop.directive';

@NgModule({
  declarations: [
    LoadingButtonDirective,
    NumbersOnlyDirective,
    IntegersOnlyDirective,
    IgnoreEmojiIconDirective,
    SharesButtonDirective,
    ViewMoreDirective,
    ViewPhotoDirective,
    ViewListJobsDirective,
    ToggleAccordionDirective,
    DragAndDropDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    LoadingButtonDirective,
    NumbersOnlyDirective,
    IntegersOnlyDirective,
    IgnoreEmojiIconDirective,
    SharesButtonDirective,
    ViewMoreDirective,
    ViewPhotoDirective,
    ViewListJobsDirective,
    ToggleAccordionDirective,
    DragAndDropDirective
  ]
})
export class DirectivesModule { }
