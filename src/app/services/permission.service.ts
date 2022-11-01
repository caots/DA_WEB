import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

  constructor() { }

  checkMasterOrJobseeker(user){
    if(user.employer_id > 0  && user.permissions === null){
      return true;
    }
    return false;
  }

  checkCantPermissionUser(user, type){
    let check = true;
    if(!user) return check;
    if(user.permissions == null) return false;
    if(user.accountType == 0 && user.employerId == user.id ){
      return false;
    }else{
      user.permissions.map(per => {
        if(per == type){
          check = false;
        };
        
      })        
      return check;
    }
  }
  
}
