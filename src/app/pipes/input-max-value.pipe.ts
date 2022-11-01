import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputMaxValue'
})
export class InputMaxValuePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
