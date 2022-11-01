import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ms-complete-forgot-password',
  templateUrl: './complete-forgot-password.component.html',
  styleUrls: ['./complete-forgot-password.component.scss']
})

export class CompleteForgotPasswordComponent implements OnInit {
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  goToHomePage() {
    this.router.navigate(['/']);
  }
}
