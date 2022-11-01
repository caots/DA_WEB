import { Directive, ElementRef, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[viewListJobs]'
})
export class ViewListJobsDirective {
  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
      this.el.nativeElement.parentNode.classList.toggle("active");
  }
  @Input() jobId: number
  @Input() groupId: number;
  @HostListener('click', ['$event.target'])
  onClick() {
    let parentElement = this.el.nativeElement.parentNode.parentNode;
    let arr = [...parentElement.children];
    arr.forEach(e => {
      if(e.classList[0] == this.jobId) {
        e.classList.toggle("active")
      }
    })
    //console.log(this.el.nativeElement)
 }
}
