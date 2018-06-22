import {Pipe, PipeTransform} from '@angular/core'
import * as moment from 'moment';

@Pipe({ name : 'connectDate'})
export class ConnectDatePipe implements PipeTransform {
  transform (value: any, format: string = 'LL', lang: string  = 'ru') {
    let timeStamp =  parseInt(value);

    return moment(timeStamp).locale(lang).format(format);
    // moment().la
  }
}
