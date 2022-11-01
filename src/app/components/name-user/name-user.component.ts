import { Component, OnInit, Input } from '@angular/core';
import { Applicants } from 'src/app/interfaces/applicants';
import { Candidate } from 'src/app/interfaces/candidate';
import { Conversation, Message } from 'src/app/interfaces/message';

@Component({
  selector: 'ms-name-user',
  templateUrl: './name-user.component.html',
  styleUrls: ['./name-user.component.scss']
})
export class NameUserComponent implements OnInit {
  @Input('applicant') applicant: Applicants;
  @Input('candidate') candidate: Candidate;
  @Input('message') message: Message;
  @Input('conversation') conversation: Conversation;
  @Input('canViewProfile') canViewProfile: number;
  @Input('isGroup') isGroup: string;
  
  constructor() { 
  }

  ngOnInit(): void {
  }
  ngOnChanges() { 
  }
}
