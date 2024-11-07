import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleBooleansService } from '../../../service/toggle-booleans.service';
import { User } from '../../../interface/user';
import { UsersService } from '../../../service/users.service';
import { TasksService } from '../../../service/tasks.service';

@Component({
  selector: 'app-board-add-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board-add-task.component.html',
  styleUrl: './board-add-task.component.scss'
})
export class BoardAddTaskComponent {
  @Input() CategorY: string = '';
  @Input() openAddNewTaskWindow!: boolean;
  @Output() closeBigWindow = new EventEmitter<boolean>();
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

  constructor(public toggleService: ToggleBooleansService, private userService: UsersService, public taskService: TasksService){}

  checkPrio(priority: string) {
    this.priority = priority;
  }

  closeWindow(){
    this.openAddNewTaskWindow = false;
    this.closeBigWindow.emit(this.openAddNewTaskWindow);
    this.clearValues();
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

  openAssignedTo(event: Event) {
    event.stopPropagation();
    this.showUserWindow = !this.showUserWindow;
    this.showCategoryWindow = false;
  }

  getUserFirstLetter(user: User): string {
    return user?.firstName?.charAt(0).toUpperCase() || '';
  }
  
  getUserSecondLetter(user: User): string {
    return user?.lastName?.charAt(0).toUpperCase() || '';
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
  
  openCategory(event: Event) {
    event.stopPropagation();
    this.showCategoryWindow = !this.showCategoryWindow;
    this.showUserWindow = false;
  }

  changeTask(task: string, event: Event) {
    event.stopPropagation();
    this.category = task;
    this.showCategoryWindow = false;
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

  deleteSubtask(task: string){
    const taskMsg = this.subtaskArray.indexOf(task);
    if (taskMsg !== -1) {
      this.subtaskArray.splice(taskMsg, 1);
    }
  }

  addSubtaskByEnter(event: KeyboardEvent){
    if(event.keyCode == 13){
      this.addSubtask();
    }
  }

  addSubtask(){
    if (this.subtaskToLong && this.subtask !=='') {
      const subtaskValue = {subtask: this.subtask, subtaskDone : false};
      this.subtaskArray.push(subtaskValue);
      this.subtask = ''; 
    }
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
      this.closeWindow();
    }
  }

  showUserContacts(){
    const currentUser = localStorage.getItem('currentUser');
    return currentUser!.replace(/"/g, '');
  }

}
