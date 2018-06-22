import { NgModule } from '@angular/core';
import {ConnectDictionaryPipe} from '../service/freeform/pipe/connect-dictionary.pipe';

import {TextMaskModule} from 'angular2-text-mask';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ConnectDatePipe} from '../pipe/connect-date.pipe';

@NgModule({
  exports: [
    // text mask (https://www.npmjs.com/package/angular2-text-mask)
    TextMaskModule,
    ConnectDictionaryPipe,
    ConnectDatePipe,

    // forms module
    FormsModule,
    ReactiveFormsModule,
  ],
  imports: [
    // text mask (https://www.npmjs.com/package/angular2-text-mask)
    TextMaskModule,

    // forms module
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    // connect dictionary pipes
    ConnectDictionaryPipe,
    ConnectDatePipe
  ],
  entryComponents: [
  ],
  providers: [
  ]
})
export class ConnectSharedModule { }
