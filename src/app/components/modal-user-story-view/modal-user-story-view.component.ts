import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ms-modal-user-story-view',
  templateUrl: './modal-user-story-view.component.html',
  styleUrls: ['./modal-user-story-view.component.scss']
})
export class ModalUserStoryViewComponent implements OnInit {
  @Input() assessmentId: number;
  @Input() listAssessmentUserStory: any[];
  @Output() close = new EventEmitter();
  @Output() previewAssessment = new EventEmitter();
  assessmentSelect: any;
  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(): void {
    if(this.assessmentId >= 0){
      const index = this.listAssessmentUserStory.findIndex(ass => ass.id == this.assessmentId);
      if(index >= 0) this.assessmentSelect = this.listAssessmentUserStory[index];
    }
  }

  closeModal() {
    this.close.emit();
  }

  showPreviewAssessment(url){
    this.previewAssessment.emit(url);
  }

}
