import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[shareButtonDir]'
})
export class SharesButtonDirective {
  constructor(private el: ElementRef) { }


  // @HostListener('mouseleave') onMouseLeave() {
  //   this.el.nativeElement.children[1].classList.remove("active");
  // }

  @HostListener('click', ['$event.target'])
  onClick() {
    this.el.nativeElement.children[1].classList.toggle("active");
  }
}