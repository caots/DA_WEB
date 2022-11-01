import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ms-zoom-image',
  templateUrl: './zoom-image.component.html',
  styleUrls: ['./zoom-image.component.scss']
})
export class ZoomImageComponent implements OnInit {
  @Output() zoomInOut = new EventEmitter();
  zoomValue: number = 0;
  zoomMin: number = 0;
  zoomMax: number = 100;
  constructor() { }

  ngOnInit(): void {
  }

  changeValue(isPlus: boolean) {
    if (isPlus) {
      this.zoomValue += 10;
      if (this.zoomValue > this.zoomMax) {
        this.zoomValue = this.zoomMax;
      }
    } else {
      this.zoomValue -= 10;
      if (this.zoomValue < this.zoomMin) {
        this.zoomValue = this.zoomMin;
      }
    }
    this.zoomInOut.emit(this.zoomValue);
  }

  onChange(value) {
    this.zoomInOut.emit(value);
  }
}
