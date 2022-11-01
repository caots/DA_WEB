import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'ms-our-blog',
  templateUrl: './our-blog.component.html',
  styleUrls: ['./our-blog.component.scss']
})
export class OurBlogComponent implements OnInit {
  API_S3 = environment.api_s3;
  
  constructor() { }

  ngOnInit(): void {
  }

}
