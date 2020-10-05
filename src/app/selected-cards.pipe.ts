import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectedCards'
})
export class SelectedCardsPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    console.log(value)
    return value.selected;
  }

}
