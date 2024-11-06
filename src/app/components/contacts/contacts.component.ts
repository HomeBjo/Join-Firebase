import { ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../../interface/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToggleBooleansService } from '../../service/toggle-booleans.service';
import { UsersService } from '../../service/users.service';


@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  allUsersArray: any[] = [];
  SortedContacts: any[] = [];
  name:string = '';
  email:string = '';
  phoneNr:any = undefined;
  editName:string = '';
  editEmail:string = '';
  editPhoneNr:any = undefined;
  firstName:string = '';
  lastName:string = '';
  firstChar:string = '';
  closeUserWindow:boolean = false;
  closeUserEditWindow:boolean = false;
  userDetails: any = '';
  getUserToEdit: any = '';
  searchBarUsersArray: any[] = [];
  searchBarUsersArraySorted: any[] = [];
  noUserFound: boolean = false;


  constructor(public toggleService: ToggleBooleansService, public userService: UsersService){}

  ngOnInit(){
    this.showUserContacts();    
  }

  getUserFirstLetter(user: User){
    return user?.firstName?.charAt(0).toUpperCase() || '';
  }

  getUserSecondLetter(user: User){
    return user?.lastName?.charAt(0).toUpperCase() || '';
  }

  saveUserData() {
    if (this.checkCurrentData()) {
      this.splitName(this.name);
      const user: User = {
        firstName: this.firstName,
        lastName: this.lastName || '',
        email: this.email,
        savedUsers: [],
        phoneNumber: this.phoneNr || '',
        status: false,
        color: this.generateRandomColor(),
        uid: (Math.random() * 341235).toString(),
      };
      this.userService.addNewContact([user]);
      this.showUserContacts();
      this.returnBack();
    }
  }

  splitName(fullName: string){
    const fullname: string[] = fullName.split(' ');
    this.firstName = fullname[0];
    this.lastName = fullname[1];
  }

  checkCurrentData() {
    if (this.name.length < 3) {
      return false;
    }
    if (!this.checkEmail()) {
      return false;
    }
    return true;
  }

  checkEmail(): boolean {
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.email);
  }

  returnBack(){
    this.name = '';
    this.email = '';
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phoneNr = undefined;
    this.closeUserWindow = false;
    this.closeUserEditWindow = false;
    this.userDetails = '';
  }

  openAddContactWindow(event: Event){
    event.stopPropagation();
    this.closeUserWindow = true;
  }

  generateRandomColor(){
    let hexArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
    let color = "";
    for(let i=0; i<6; i++){
      color += hexArray[Math.floor(Math.random()*16)];
    }
    return `#${color}`    
  }

  stopPropagation(event: Event){
    event.stopPropagation();
  }

  showContactDetails(user: User) {
    if (this.userDetails !== user) {
      this.userDetails = '';
      setTimeout(() => {
        this.userDetails = user;
      },300);
    } else if (this.userDetails === '') {
      this.userDetails = user;
    } else if(this.userDetails == user){
      this.userDetails = '';
    }
  }
  

  editContact(userDetails: User){
    this.getUserToEdit = userDetails;
    this.closeUserEditWindow = true;
    this.editName = this.getFullName(userDetails);
    this.editEmail = userDetails.email;
    this.editPhoneNr = userDetails.phoneNumber;
    this.checkEditData();
  }

  getFullName(userDetails: User){
    const fullName = userDetails.firstName + ' ' + userDetails.lastName;
    return fullName;
  }


  checkEditData(){
    if (this.editName.length < 3) {
      return false;
    }
    if (!this.checkEditEmail()) {
      return false;
    }
    return true;
  }

  checkEditEmail(): boolean {
    const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,}$/;
    return emailRegex.test(this.editEmail);
  }

  deleteContact(user: User) {
    const filteredUser = this.getCleanIDFromLogedInUSer();
    const contactIndex = filteredUser[0].savedUsers.filter((u: any) => u.uid === user.uid);
    this.userService.deleteContact(user, filteredUser);
    this.returnBack();
  }

  saveUserEditData(){
    this.splitName(this.editName);
    const user: User = {
      firstName: this.firstName,
      lastName: this.lastName || '',
      email: this.editEmail,
      savedUsers: [],
      phoneNumber: this.editPhoneNr || '',
      status: false,
      color: this.getUserToEdit.color,
      uid: this.getUserToEdit.uid
    };
    this.userService.updateEditContact([user]);
    this.showUserContacts();
    this.returnBack();
  }

  showUserContacts(){
    const currentUser = localStorage.getItem('currentUser');
    const filterUser = this.userService.allUsers.filter(u => u.id === this.userService.getCleanID(currentUser!))
    this.SortedContacts = this.sortByFirstLetter(filterUser[0].savedUsers);
    return this.SortedContacts;
  }

  sortByFirstLetter(contacts: User[]): User[] {
    return contacts.sort((a, b) => {
        const nameA = a.firstName.toUpperCase();
        const nameB = b.firstName.toUpperCase();
        return nameA.localeCompare(nameB);
    });
  }

  getFirstCharacter(user: User): string | null {
    const firstLetter = user.firstName.charAt(0).toUpperCase();
    if (this.firstChar.includes(firstLetter)) {
      return '';
    }
    this.firstChar = firstLetter;
    return this.firstChar;
  }
  
  getCleanIDFromLogedInUSer(){
    const currentUser = localStorage.getItem('currentUser');
    return this.userService.allUsers.filter((u) => u.id === this.userService.getCleanID(currentUser!));
  }
  
  getHeaderInputValue(event: KeyboardEvent) {
    this.searchBarUsersArray = [];
    if (this.toggleService.headerInputValue !== '' || event.keyCode == 	8) {
      // Filter current user's contacts
      const filteredUser = this.getCleanIDFromLogedInUSer();
      // Filter common users based on search input
      const filterUserExistingUserName = filteredUser[0].savedUsers.filter((user: any) => (user.firstName.toLowerCase().includes(this.toggleService.headerInputValue.toLowerCase())));
      const sortedFilterUserExistingUserName = this.sortFilterUserExistingUserName(filterUserExistingUserName);
      //------------------- 
      const filterUserToAddName = this.userService.commonUsers.filter((user: any) =>
        user.savedUsers[0].firstName.toLowerCase().includes(this.toggleService.headerInputValue.toLowerCase())
      );
      const sortedFilterUserToAddName = this.sortFilterUserToAddName(filterUserToAddName);
      this.checkDifferentUser(sortedFilterUserExistingUserName, sortedFilterUserToAddName);

      if (filterUserToAddName.length === 0) {
        this.noUserFound = true;
      } else {
        this.noUserFound = false;
      }
    } 
  }

  sortFilterUserExistingUserName(contacts: User[]): User[]{
    return contacts.sort((a, b) => {
      const nameA = a.firstName.toUpperCase();
      const nameB = b.firstName.toUpperCase();
      return nameA.localeCompare(nameB);
    });
  }

  sortFilterUserToAddName(contacts: User[]): User[]{
    return contacts.sort((a, b) => {
      const nameA = a.savedUsers![0].firstName.toUpperCase();
      const nameB = b.savedUsers![0].firstName.toUpperCase();
      const getName = nameA.localeCompare(nameB);
      this.searchBarUsersArraySorted.push(getName);
      return getName;
    });
  }


  checkDifferentUser(filterUserExistingUserName: User[], filterUserToAddName: User[]): void {
    this.searchBarUsersArray = [];
  
    for (let i = 0; i < filterUserToAddName.length; i++) {
      const userToAdd = filterUserToAddName[i].savedUsers![0];
      const existingUser = filterUserExistingUserName.find(
        (existing) => existing.uid === userToAdd.uid
      );
  
      if (!existingUser) {
        this.searchBarUsersArray.push(userToAdd);
      } else if (existingUser.uid !== userToAdd.uid) {
        this.searchBarUsersArray.push(userToAdd);
      }
    }
  
    this.noUserFound = this.searchBarUsersArray.length === 0;
  }
  

  checkInputInSidebar(){
    if (this.toggleService.headerInputValue) {
      return true;
    } else {
      return false;
    }
  }

  addUserToContacts(user: User, event: Event){
    event.stopPropagation();
    const filteredContact = this.searchBarUsersArray.filter(c => c.uid === user.uid);
    this.userService.updateEditContact(filteredContact);
    this.toggleService.headerInputValue = '';
  }

  checkWidthWindow(){
    if (window.innerWidth <= 1380) {
      return false;
    } else {
      return true;
    }
  }
  
  openEditDeleteWindow(event: Event){
    event.stopPropagation();
    this.toggleService.openEditDeleteWindow = true
  }
}
