import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assesmentFilter'
})

export class AssesmentFilterPipe implements PipeTransform {
  transform(list, name, category): unknown {
    if (!list && !list.length) {
      return list;
    }

    if (name) {
      list = list.filter(item => {
        return item.name && item.name.toUpperCase().includes(name.toUpperCase());
      })
    }

    if (category) {
      list = list.filter(item => {
        return item.categoryId == category;
      })
    }

    return list;    
  }
}
