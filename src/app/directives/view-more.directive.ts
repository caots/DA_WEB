import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[viewMoreDir]'
})
export class ViewMoreDirective {
  constructor(private el: ElementRef) { 
  }


  @HostListener('mouseleave') onMouseLeave() {
    // this.el.nativeElement.children[1].classList.remove("active");
  }

  @HostListener('click', ['$event.target'])
  onClick() {
    this.el.nativeElement.classList.add("active");
 }
}