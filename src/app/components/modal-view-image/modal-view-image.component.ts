import {cloneDeep} from 'lodash';
import { Component, OnInit, Output, EventEmitter, Input, Optional, Inject, HostListener } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ImageService } from 'src/app/services/image.service'
import { ImageViewerConfig, CustomEvent } from './image-viewer-config.model';

const DEFAULT_CONFIG: ImageViewerConfig = {
  btnClass: 'default',
  zoomFactor: 0.1,
  containerBackgroundColor: '#000',
  wheelZoom: true,
  allowFullscreen: false,
  allowKeyboardNavigation: false,
  btnShow: {
    zoomIn: true,
    zoomOut: true,
    rotateClockwise: false,
    rotateCounterClockwise: false,
    next: false,
    prev: false
  },
  btnIcons: {
    zoomIn: 'fa fa-plus',
    zoomOut: 'fa fa-minus',
    rotateClockwise: 'fa fa-repeat',
    rotateCounterClockwise: 'fa fa-undo',
    next: 'fa fa-arrow-right',
    prev: 'fa fa-arrow-left',
    fullscreen: 'fa fa-arrows-alt',
  }
};
@Component({
  selector: 'ms-modal-view-image',
  templateUrl: './modal-view-image.component.html',
  styleUrls: ['./modal-view-image.component.scss']
})
export class ModalViewImageComponent implements OnInit {
  @Input() linkImage: any;
  @Input() title: any;
  @Output() close = new EventEmitter();
  zoomValue = 50;
  index = 0;
  images: any;
  src: string[];
  config: ImageViewerConfig;
  indexChange: EventEmitter<number> = new EventEmitter();
  configChange: EventEmitter<ImageViewerConfig> = new EventEmitter();
  customEvent: EventEmitter<CustomEvent> = new EventEmitter();
  public style = { transform: '', msTransform: '', oTransform: '', webkitTransform: '' };
  public fullscreen = false;
  public loading = true;
  scale = 0.7;
  minScale = 0.7;
  maxScale = 2;
  private rotation = 0;
  private translateX = 0;
  private translateY = 0;
  private prevX: number;
  private prevY: number;
  private hovered = false;

  constructor(
    private activeModal: NgbActiveModal,
    public imageService: ImageService,
    @Optional() @Inject('config') public moduleConfig: ImageViewerConfig
  ) { }

  ngOnInit(): void {
    this.src = [this.linkImage]
    //console.log(this.linkImage);
    const merged = this.mergeConfig(DEFAULT_CONFIG, this.moduleConfig);
    this.config = this.mergeConfig(merged, this.config);
    this.triggerConfigBinding();
    this.updateStyle();
  }

  closeModal() {
    this.activeModal.close(false);
  }
  zoomIn() {
    let scale = cloneDeep(this.scale);
    scale = scale + this.config.zoomFactor;
    if(scale > this.maxScale) {
      scale = this.maxScale;
    }
    this.scale = scale;
    this.updateStyle();
  }

  zoomOut() {
    if (this.scale > this.minScale ) {
      // this.scale /= (1 + this.config.zoomFactor);
      this.scale = this.scale - this.config.zoomFactor;
    }
    
    this.updateStyle();
  }

  scrollZoom(evt) {
    if (this.config.wheelZoom) {
      evt.deltaY > 0 ? this.zoomOut() : this.zoomIn();
      return false;
    }
  }

  rotateClockwise() {
    this.rotation += 90;
    this.updateStyle();
  }

  rotateCounterClockwise() {
    this.rotation -= 90;
    this.updateStyle();
  }

  onLoad() {
    this.loading = false;
  }

  onLoadStart() {
    this.loading = true;
  }

  onDragOver(evt) {
    this.translateX += (evt.clientX - this.prevX);
    this.translateY += (evt.clientY - this.prevY);
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
    this.updateStyle();
  }

  onDragStart(evt) {
    // if (evt.dataTransfer && evt.dataTransfer.setDragImage) {
    //   evt.dataTransfer.setDragImage(evt.target.nextElementSibling, 0, 0);
    // }
    this.prevX = evt.clientX;
    this.prevY = evt.clientY;
  }

  toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
    if (!this.fullscreen) {
      this.reset();
    }
  }

  triggerIndexBinding() {
    this.indexChange.emit(this.index);
  }

  triggerConfigBinding() {
    this.configChange.next(this.config);
  }

  fireCustomEvent(name, imageIndex) {
    this.customEvent.emit(new CustomEvent(name, imageIndex));
  }

  reset() {
    this.scale = this.minScale;
    this.rotation = 0;
    this.translateX = 0;
    this.translateY = 0;
    this.updateStyle();
  }

  @HostListener('mouseover')
  private onMouseOver() {
    this.hovered = true;
  }

  @HostListener('mouseleave')
  private onMouseLeave() {
    this.hovered = false;
  }

  private canNavigate(event: any) {
    return event == null ||  (this.config.allowKeyboardNavigation && this.hovered);
  }

  private updateStyle() {
    this.style.transform = `translate(${this.translateX}px, ${this.translateY}px) rotate(${this.rotation}deg) scale(${this.scale})`;
    this.style.msTransform = this.style.transform;
    this.style.webkitTransform = this.style.transform;
    this.style.oTransform = this.style.transform;
    
  }

  private mergeConfig(defaultValues: ImageViewerConfig, overrideValues: ImageViewerConfig): ImageViewerConfig {
    let result: ImageViewerConfig = { ...defaultValues };
    if (overrideValues) {
      result = { ...defaultValues, ...overrideValues };

      if (overrideValues.btnIcons) {
        result.btnIcons = { ...defaultValues.btnIcons, ...overrideValues.btnIcons };
      }
    }
    return result;
  }
  zoomInOut(scale) {
    this.scale = scale;
    this.updateStyle();
  }
}
