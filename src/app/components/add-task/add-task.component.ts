import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../../service/tasks.service';
import { ToggleBooleansService } from '../../service/toggle-booleans.service';
import { UsersService } from '../../service/users.service';
import { User } from '../../interface/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss',
})
export class AddTaskComponent {
  @ViewChild('taskWindoW') taskWindoW!: ElementRef;
  title: string = '';
  description: string = '';
  date: number = 0;
  priority: string = '';
  assignetTo: any[] = [];
  chackedUser: any[] = [];
  category: string = 'Technical Task';
  subtask: string = '';
  subtaskArray: any[] = [];
  addedUser: boolean = false;
  subtaskToLong: boolean = false;
  showUserWindow: null | false | true = null;
  showCategoryWindow: null | false | true = null;


  constructor(
    public taskService: TasksService,
    public toggleService: ToggleBooleansService,
    public userService: UsersService,
    private router: Router
  ) {}

  checkPrio(priority: string) {
    this.priority = priority;
  }

  checkValues(event: Event) {
    event.stopPropagation();
    if (this.checkAllValues()) {
      const unicTimestamp = new Date().getTime();
      const task = {
        title: this.title,
        description: this.description,
        date: this.date,
        priority: this.priority || 'low',
        assignetTo: this.chackedUser || [],
        categoryTask: this.category || 'Technical Task',
        subtasks: this.subtaskArray || [],
        publishedTimestamp: unicTimestamp,
        createtBy: this.showUserContacts(),
        category: 'toDo',
      };
      this.taskService.addTask([task]);
      this.clearValues(); 
      this.toggleService.openBoard = true;
      this.toggleService.selectedComponent = 'board';
    }
  }

  showUserContacts(){
    const currentUser = localStorage.getItem('currentUser');
    return currentUser!.replace(/"/g, '');
  }

  checkAllValues(){
    if (this.title == '') {
      return false;
    }
    if (this.description == '') {
      return false
    }
    if (this.date == 0) {
      return false
    }
    return true;
  }

  checkDateAddTask() {
    const today = new Date();
    const tomorrow = new Date(today.setDate(today.getDate() + 1));
    const input = document.getElementById('date') as HTMLInputElement;

    if (input) {
      input.setAttribute('min', tomorrow.toISOString().split('T')[0]);
    } else {
      console.error('Could not find input element with id="date"');
    }
  }

  openCategory(event: Event) {
    event.stopPropagation();
    this.showCategoryWindow = !this.showCategoryWindow;
  }

  openAssignedTo(event: Event) {
    event.stopPropagation();
    this.showUserWindow = !this.showUserWindow;
  }

  changeTask(task: string, event: Event) {
    event.stopPropagation();
    this.category = task;
    this.showCategoryWindow = false;
  }

  clearValues() {
    this.title = '';
    this.description = '';
    this.date = 0;
    this.priority = '';
    this.assignetTo = [];
    this.chackedUser = [];
    this.category = 'Technical Task';
    this.subtask = '';
    this.subtaskArray = [];
  }

  getUserFirstLetter(user: User): string {
    return user?.firstName?.charAt(0).toUpperCase() || '';
  }
  
  getUserSecondLetter(user: User): string {
    return user?.lastName?.charAt(0).toUpperCase() || '';
  }

  addUser(user: User, event: Event) {
    event.stopPropagation();
    const userIndex = this.chackedUser.findIndex(u => u.uid === user.uid);

    if (userIndex !== -1) {
      this.chackedUser.splice(userIndex, 1);
    } else {
      this.chackedUser.push(user);
    }
  }
  
  isChecked(user: User): boolean {
    const assignedUsers = this.chackedUser.filter(u => u.uid === user.uid);;
    return assignedUsers.some((assignedUser: any) => assignedUser.uid === user.uid);
  }
  
  getContactsFromCurrenUser(){
    const currentUser = localStorage.getItem('currentUser');
    const cleanUserID = currentUser!.replace(/"/g, '');
    const filteredUser = this.userService.allUsers.filter(u => u.id === cleanUserID);
    const filteredContacts = this.sortFilterUserExistingUserName(filteredUser[0].savedUsers);
    return filteredContacts;
  }

  sortFilterUserExistingUserName(contacts: User[]): User[]{
    return contacts.sort((a, b) => {
      const nameA = a.firstName.toUpperCase();
      const nameB = b.firstName.toUpperCase();
      return nameA.localeCompare(nameB);
    });
  }

  checkSubtaskLength(){
    if (this.subtask.length <= 50) {
      this.subtaskToLong = true;
      return true;
    } else{
      this.subtaskToLong = false;
      return false;
    }
  }
  
  addSubtask(){
    if (this.subtaskToLong && this.subtask !=='') {
      const subtaskValue = {subtask: this.subtask, subtaskDone : false};
      this.subtaskArray.push(subtaskValue);
      this.subtask = ''; 
    }
  }

  deleteSubtask(task: string){
    const taskMsg = this.subtaskArray.indexOf(task);
    if (taskMsg !== -1) {
      this.subtaskArray.splice(taskMsg, 1);
      // this.chackedUser.splice(taskMsg, 1); 
    }
  }

  addSubtaskByEnter(event: KeyboardEvent){
    if (event.keyCode == 13) {
      this.addSubtask();
    }
  }

  dontCloseWindow(event: Event){
    event.stopPropagation();
  }

}
