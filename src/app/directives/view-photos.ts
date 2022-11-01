import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[viewPhotoDir]'
})
export class ViewPhotoDirective {
  constructor(private el: ElementRef) { 
  }


  @HostListener('mouseleave') onMouseLeave() {
  }

  @HostListener('click', ['$event.target'])
  onClick() {
    this.el.nativeElement.parentNode.classList.toggle("active");
 }
}