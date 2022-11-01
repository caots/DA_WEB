import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

import { MessageService } from 'src/app/services/message.service';
import { HelperService } from 'src/app/services/helper.service';
import { MESSAGE } from 'src/app/constants/message';
@Component({
  selector: 'ms-modal-add-members',
  templateUrl: './modal-add-members.component.html',
  styleUrls: ['./modal-add-members.component.scss']
})
export class ModalAddMembersComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Input() groupId: number;
  listUser: any;
  listUserInvite: any;
  isSearching: boolean;
  constructor(
    public messageService: MessageService,
    private helperService: HelperService,

  ) { }

  ngOnInit(): void {
    this.getListUserCanInvite(this.groupId)
  }

  closeModal() {
    this.close.emit();
  }

  getListUserCanInvite(groupId) {
    // this.isLoadingListApplicants = true;
    this.messageService.getListUserCanInvite(groupId).subscribe(data => {
      this.listUser = data.results;
      this.listUser.forEach(element => {
        element.isInvite = true;
      });
    }, errorRes => {
      // this.isSearching = false;
      // this.isLoadingListApplicants = false;
      this.helperService.showToastError(errorRes);
    });
  }

  inviteToGroupChat(id, index, status = 'invited', ) {
    this.messageService.inviteUser(this.groupId, id, status).subscribe(res => {
      this.isSearching = false;
      // this.getListUserCanInvite(this.groupId);
      this.listUser[index].chat_group_member_id = status == 'invited' ? 1 : 0;
      const message = status == 'invited' ? MESSAGE.INVITE_USER_SUCCESS : MESSAGE.REMOVE_USER_SUCCESS
      this.helperService.showToastSuccess(message);
    }, errorRes => {
      this.isSearching = false;
      this.helperService.showToastError(errorRes);
    })
  }

}
