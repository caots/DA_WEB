import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
@Component({
  selector: 'ms-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})

export class EmailVerificationComponent implements OnInit {
  title: string;
  message: string;
  isCallingApi: boolean = true;

  constructor(
    private router: Router,
  ) { 
  }

  ngOnInit(): void {
    
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
    
}
