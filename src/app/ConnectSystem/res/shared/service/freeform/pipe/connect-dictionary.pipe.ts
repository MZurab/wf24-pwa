import {Pipe, PipeTransform} from '@angular/core'

@Pipe({ name : 'connectDictionary'})

export class ConnectDictionaryPipe implements PipeTransform {
  transform (value: any) {
    let r =  this.get(value);
    return r;
  }

  get (iNtext: object | string | null = null): string {
    // get error from language box
    //**LATER add many languages and fixed this func
    let r = null,
        text = iNtext;

    if (typeof text === 'string') {
      r = text;
    } else if (
      typeof text === 'object' &&
      typeof text['*'] === 'string'
    ) {
      r = text['*'];
    }
    return r;
  }
}
