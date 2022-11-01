import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {
  transform(list, propertyName, query, type = 'equal'): unknown {
    if (!list && !list.length) {
      return list;
    }
    
    if (type) {
      switch (type) {
        case 'includes':
          list = list.filter(item => {
            return item[propertyName] && item[propertyName].includes(query);
          })
        default:
          if (!query || query == ''){
            return [];
          }
          if(query == 0) return list;
          list = list.filter(item => {
            return item[propertyName] == query;
          })
      }
    } else {
      list = list.filter(item => {
        return item[propertyName] == query;
      })
    }

    return list;
  }
}
