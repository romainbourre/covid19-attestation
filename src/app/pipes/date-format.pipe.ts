import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'dateFormat'
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string): any {
    return moment(value, 'DD/MM/YYYY').format('MM/DD/YYYY');
  }
}
