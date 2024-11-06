import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnDragHighlight]',
  standalone: true
})
export class OnDragHighlightDirective {

  elementRef: ElementRef;

  constructor( private element: ElementRef) {
    this.elementRef = element;
  }

  @HostListener("dragover", ["$event"]) onDragOver(evt: any){
    evt.stopPropagation();
    this.elementRef.nativeElement.classList.add("dragAreaHighlight");
  }

  @HostListener("dragleave", ["$event"]) onDragLeave(evt: any){
    evt.stopPropagation();
    this.elementRef.nativeElement.classList.remove("dragAreaHighlight");
  }

  @HostListener("drop", ["$event"]) onDragDrop(evt: any){
    evt.stopPropagation();
    this.elementRef.nativeElement.classList.remove("dragAreaHighlight");
  }
}
