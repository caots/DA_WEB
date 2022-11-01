import { Component, OnInit, Input } from '@angular/core';

import { SkillRequired } from 'src/app/interfaces/skillRequired';

@Component({
  selector: 'ms-skill-required-box',
  templateUrl: './skill-required-box.component.html',
  styleUrls: ['./skill-required-box.component.scss']
})

export class SkillRequiredBoxComponent implements OnInit {
  @Input() skill: SkillRequired;
  
  constructor() { }

  ngOnInit(): void {
  }
}
