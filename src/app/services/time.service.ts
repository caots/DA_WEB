import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class TimeService {
  constructor() { }

  getStartTimeOfDate(date = new Date().toString()) {
    let start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  getEndTimeOfDate(date = new Date().toString()) {
    let end = new Date(date);
    end.setHours(23, 59, 59, 999);
    return end;
  }

  formatAMPM(date) {
    var hours = date.getHours();
        // let hours = myDate.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

}
