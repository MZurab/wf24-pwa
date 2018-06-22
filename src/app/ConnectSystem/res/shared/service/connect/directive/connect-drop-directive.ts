import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

console.log('ConnectDropDirective - start');
@Directive(
  {
    selector: '[connectFileDrop]'
  }
)
export class ConnectDropDirective {

  @Output() filesDropped =  new EventEmitter<FileList>();
  @Output() filesHovered =  new EventEmitter<boolean>();

  constructor() {
    console.log('ConnectDropDirective - $event');
  }

  @HostListener('drop', ['$event'])
  onDrop($event) {
    $event.preventDefault();

    let transfer = $event.dataTransfer;
    this.filesDropped.emit(transfer.files);
    if (this.lastState !== false) {
      this.filesHovered.emit(this.lastState = false );
    }
  }

  lastState = false;
  @HostListener('dragover', ['$event'])
  onDragOver ($event) {
    event.preventDefault();

    if (this.lastState !== true) {
      this.filesHovered.emit(this.lastState = true );
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    if (this.lastState !== false) {
      this.filesHovered.emit(this.lastState = false );
    }
  }


}
