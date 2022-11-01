import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ms-job-bookmark',
  templateUrl: './job-bookmark.component.html',
  styleUrls: ['./job-bookmark.component.scss']
})
export class JobBookmarkComponent implements OnInit {
  @Input() loading: boolean;
  @Input() bookmark: boolean;
  @Output() onAddBookmark = new EventEmitter<any>();
  @Output() onRemoveBookmark = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }
  addBookmark() {
    this.onAddBookmark.emit();
  }
  deleteBookmark() {
    this.onRemoveBookmark.emit();
  }

}
