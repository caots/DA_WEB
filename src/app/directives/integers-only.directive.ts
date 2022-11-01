import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from "@angular/forms";

@Directive({
  selector: '[msIntegersOnly]'
})

export class IntegersOnlyDirective {
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this.el.nativeElement.value;
    let replaceValue = initalValue.replace(/[^0-9]*/g, '');
    this.el.nativeElement.value = replaceValue;
    if (initalValue !== replaceValue) {
      this.control.control.setValue(replaceValue);
      event.stopPropagation();
    }
  }
}