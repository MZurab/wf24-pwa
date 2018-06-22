import {Component, ElementRef, Input, OnInit, Renderer2, ViewChild} from '@angular/core';

@Component({
  selector: 'wf24-freeform-field-simple',
  templateUrl: './freeform-field-simple.component.html',
  styleUrls: ['./freeform-field-simple.component.scss']
})
export class FreeformFieldSimpleComponent implements OnInit {

  @Input('fieldid')   fieldid;
  @Input('objid')     objid;
  @Input('freeform')  freeform;
  @Input('disabled')  disabled;

  // @ViewChild('fieldContainer', {read: ElementRef }) fieldContainer;

  constructor(/*private renderer: Renderer2*/) { }

  // @HostBinding('class.someClass') someField: boolean = false;


  ngOnInit() {

  }

}
