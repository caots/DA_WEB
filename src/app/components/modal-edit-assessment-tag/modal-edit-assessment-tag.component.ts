import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ASSESSMENT_POINT_RANGE } from 'src/app/constants/config';
import { Assesment } from 'src/app/interfaces/assesment';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'ms-modal-edit-assessment-tag',
  templateUrl: './modal-edit-assessment-tag.component.html',
  styleUrls: ['./modal-edit-assessment-tag.component.scss']
})

export class ModalEditAssessmentTagComponent implements OnInit {
  formEditAssessment: FormGroup;
  pointRange = ASSESSMENT_POINT_RANGE;
  @Input() assessment: Assesment;
  @Output() update = new EventEmitter();
  @Output() close = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    public helperService: HelperService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    if (this.assessment) {
      this.formEditAssessment.get('name').setValue(this.assessment.name);
      this.formEditAssessment.get('point').setValue(this.assessment.point);
    }
  }

  initForm() {
    this.formEditAssessment = this.fb.group({
      name: ['', [Validators.required]],
      point: ['', [Validators.required, Validators.min(ASSESSMENT_POINT_RANGE.MIN), Validators.max(ASSESSMENT_POINT_RANGE.MAX)]]
    })
  }

  submit(form) {
    this.helperService.markFormGroupTouched(this.formEditAssessment);
    if (this.formEditAssessment.invalid) {
      return;
    }

    this.update.emit({
      id: this.assessment.id,
      name: form.name,
      point: form.point
    })
  }

  closeModal() {
    this.close.emit();
  }
}
