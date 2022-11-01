import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { get } from 'lodash';

@Injectable({
    providedIn: 'root'
  })
export class PreviousRouteService {

  private previousUrl: string;
  private currentUrl: string;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private location: Location) {
    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      }
    });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }
  public getCurrentUrl() {
    return this.currentUrl;
  }
  public replaceStage(path: string) {
    // //console.log(this.location);
    this.location.replaceState(path);
  }
}
