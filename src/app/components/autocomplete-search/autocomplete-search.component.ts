import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'ms-autocomplete-search',
  templateUrl: './autocomplete-search.component.html',
  styleUrls: ['./autocomplete-search.component.scss']
})
export class AutocompleteSearchComponent implements OnInit {
  @Input() query: string;
  @Input() placeholder: string;
  @Input() debounceTime: number;
  @Input() listSuggestion: Array<any>;
  @Output() search = new EventEmitter();
  @Output() getListSuggestion = new EventEmitter();
  @Output() queryChange = new EventEmitter<string>();
  subject = new Subject();
  showResult: boolean = false;
  activeRow: number = null;

  constructor() {
    this.placeholder = 'e.g: Azure Security';
    this.debounceTime = 500;
  }

  ngOnInit(): void {
    this.subject.pipe(debounceTime(this.debounceTime)).subscribe(keySearch => {
      this.doSearch(keySearch);
    })
  }

  change(newValue: string) {
    this.query = newValue;
    this.queryChange.emit(newValue);
    this.showResult = true;
    this.subject.next(this.query);
  }

  doSearch(keySearch) {
    if (!keySearch) {
      this.listSuggestion = [];
      return;
    }

    this.getListSuggestion.emit(this.query);
  }

  clickOutside() {
    this.showResult = false;
  }

  onEnter() {
    this.showResult = false;
    this.search.emit();
  }

  onClickResultDetail(result) {
    this.query = result.name;
    this.queryChange.emit(result.name);
    this.search.emit();
    this.showResult = false;
  }

  move(type) {
    if (this.activeRow === null) {
      this.activeRow = 0;
      this.query = this.listSuggestion[this.activeRow].name;
      this.queryChange.emit(this.listSuggestion[this.activeRow].name);
      return;
    }

    switch (type) {
      case 'UP':
        if (this.activeRow === 0) {
          this.activeRow = this.listSuggestion.length - 1;
        } else {
          this.activeRow--;
        }
        break;
      case 'DOWN':
        this.activeRow++;
        break;
      default:
        break;
    }

    this.activeRow = this.activeRow % this.listSuggestion.length;
    this.query = this.listSuggestion[this.activeRow].name;
    this.queryChange.emit(this.listSuggestion[this.activeRow].name);
  }
}
