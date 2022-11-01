import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ms-message-complete',
  templateUrl: './message-complete.component.html',
  styleUrls: ['./message-complete.component.scss']
})

export class MessageCompleteComponent implements OnInit {
  @Input() title: string;
  @Input() message: string;
  @Input() btnText: string;
  @Output() goTo = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  go() {
    this.goTo.emit();
  }
}
