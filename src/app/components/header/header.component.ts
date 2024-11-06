import { Component } from '@angular/core';
import { LoginService } from '../../service/login.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../interface/user';
import { UsersService } from '../../service/users.service';
import { RouterLink } from '@angular/router';
import { ToggleBooleansService } from '../../service/toggle-booleans.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  currentUser: User[] = [];
  firstLetter: string = '';
  secondLetter: string = '';
  openWindow: boolean = false;

  constructor(public loginService: LoginService, public userService: UsersService, public toggleService: ToggleBooleansService) {
  }

   getUserLetters(){
    const currentUserFromStorage = localStorage.getItem('currentUser');
    let cleanUserID = this.getCleanID(currentUserFromStorage!);
    let user = this.userService.allUsers!.filter(user => user.id === cleanUserID);
    if (user.length > 0) {
      this.getUserInitials(user); 
      return true;
    }
    return false;
  }

  getCleanID(currentUserFromStorage: string){
    return currentUserFromStorage.replace(/"/g, '');
  }

  getUserInitials(user: User[]) {
    if (user.length > 0) {
        this.firstLetter = user[0].firstName !.charAt(0).toUpperCase();
        this.secondLetter = user[0].lastName?.charAt(0).toUpperCase();
    }
  }

  splitNameValue(getName:string) {
    const fullname: string[] = getName.split(' ');
    const newFirstName: string = fullname[0];
    let newLastName: string = fullname[1];
    if (fullname[2]) {
      newLastName += ' ' + fullname[2];
    }
    return [newFirstName, newLastName];
  }

  openOptionWindow(event: Event){
    event.stopPropagation();
    this.toggleService.openWindowHeader = true;
  }

  closeWhiteWindow(event: Event){
    event.stopPropagation();
    this.toggleService.openWindowHeader = false;
  }

  changeRout(component: string){
    this.toggleService.selectedComponent = component;
  }
}
