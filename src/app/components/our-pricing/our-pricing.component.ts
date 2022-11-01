import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardSettings } from 'src/app/interfaces/cardInfo';

@Component({
  selector: 'ms-our-pricing',
  templateUrl: './our-pricing.component.html',
  styleUrls: ['./our-pricing.component.scss']
})
export class OurPricingComponent implements OnInit {
  @Input() settingsCard: CardSettings;
  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  goToLogin(){
    this.router.navigate(['/register']);
  }
}

// featured_price: 2
// private_job_price: 1
// standard_price: 1
// urgent_hiring_price: 3