import { Component, Input } from '@angular/core';
import { User } from '../../../../../interface/user';
import { ToggleBooleansService } from '../../../../../service/toggle-booleans.service';
import { TasksService } from '../../../../../service/tasks.service';
import { UsersService } from '../../../../../service/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from 'zone.js/lib/zone-impl';

@Component({
  selector: 'app-card-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-edit.component.html',
  styleUrl: './card-edit.component.scss'
})
export class CardEditComponent {
  // @Input() category: string = '';
  // @Input() id: string = '';
  // @Input() createtBy: string = '';
  // @Input() date: string = '';
  // @Input() description: string = '';
  // @Input() priority: string = '';
  // @Input() title: string = '';
  // @Input() assignetTo: User[] = [];
  // @Input() subtasks: string[] = [];
  // @Input() currentTask: any;

  priority: string = '';
  category: string = 'Technical Task';
  chackedUserArray: any[] = [];
  subtaskToLong: boolean = false;
  subtask: string = '';
  subtaskArray: any[] = [];
  chackedUser: any[] = [];
  disabledButton: boolean = false;
  showUserWindow: null | false | true = null;
  showCategoryWindow: null | false | true = null;

  constructor(private userService: UsersService, public toggleService: ToggleBooleansService, public taskService: TasksService){}

  
  checkPrio(priority: string) {
    this.priority = priority;
  }

  openAssignedTo(event: Event) {
    event.stopPropagation();
    this.showUserWindow = !this.showUserWindow;
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
  

  getChackedUserArray(){
    this.chackedUser = this.taskService.clickedTaskCopy[0].assignetTo;
    return this.chackedUser;
  }

  chackAssigedToContacts(){
    const arrayLenght = this.taskService.clickedTaskCopy[0].assignetTo;
    if (arrayLenght.length > 0) {
      return true;
    }
    return false;
  }

  openCategory(event: Event) {
    event.stopPropagation();
    this.toggleService.showCategoryWindow =
      !this.toggleService.showCategoryWindow;
  }

  changeTask(task: string, event: Event) {
    event.stopPropagation();
    this.taskService.clickedTaskCopy[0].categoryTask = task;
    this.toggleService.showCategoryWindow = false;
  }

  checkSubtaskLength(){
    if (this.taskService.clickedTaskCopy[0].subtasks.length <= 50) {
      this.subtaskToLong = true;
      return true;
    } else{
      this.subtaskToLong = false;
      return false;
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

  deleteSubtask(task: string){
    const taskMsg = this.subtaskArray.indexOf(task);
    if (taskMsg !== -1) {
      this.subtaskArray.splice(taskMsg, 1);
      // this.chackedUser.splice(taskMsg, 1); 
    }
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

  closeWindow(){
    this.toggleService.openWhiteBox = false;
    this.toggleService.openEditCard = false;
  }

  checkIfVluesChanged(){
    const currentTaskIdCopy = this.taskService.clickedTaskCopy[0];
    const currentTaskID = this.taskService.clickedTask[0];
    if(this.checkArray(currentTaskIdCopy, currentTaskID)){
      return false;
    }
    if (currentTaskIdCopy.title == '') {
      return false;
    }
    if (currentTaskIdCopy.description == '') {
      return false
    }
    if (currentTaskIdCopy.date == 0) {
      return false
    }
    return true;
  }
  
  checkArray(currentTaskIdCopy: any, currentTaskID: any){
    return  currentTaskIdCopy.title === currentTaskID.title &&
    currentTaskIdCopy.description === currentTaskID.description &&
    currentTaskIdCopy.date === currentTaskID.date &&
    currentTaskIdCopy.priority === currentTaskID.priority &&
    currentTaskIdCopy.category === currentTaskID.category &&
    JSON.stringify(currentTaskIdCopy.assignetTo) === JSON.stringify(currentTaskID.assignetTo) &&
    JSON.stringify(currentTaskIdCopy.subtasks) === JSON.stringify(currentTaskID.subtasks);
  }

  getSubtaskArrayData(){
    this.subtaskArray = this.taskService.clickedTaskCopy[0].subtasks;
    return this.subtaskArray;
  }

  isChecked(user: User): boolean {
    const assignedUsers = this.taskService.clickedTaskCopy[0].assignetTo;
    return assignedUsers.some((assignedUser: any) => assignedUser.uid === user.uid);
  }
  
  saveEditTask(event: Event){
    event.stopPropagation();
    if (this.checkIfVluesChanged()) {
      const unicTimestamp = new Date().getTime();
      const task = {
        title: this.taskService.clickedTaskCopy[0].title,
        description: this.taskService.clickedTaskCopy[0].description,
        date: this.taskService.clickedTaskCopy[0].date,
        priority: this.taskService.clickedTaskCopy[0].priority || 'low',
        assignetTo: this.taskService.clickedTaskCopy[0].assignetTo || [],
        categoryTask: this.taskService.clickedTaskCopy[0].categoryTask,
        subtasks: this.taskService.clickedTaskCopy[0].subtasks || [],
        publishedTimestamp: unicTimestamp,
        createtBy: this.taskService.clickedTaskCopy[0].createtBy,
        category: this.taskService.clickedTaskCopy[0].category,
        id: this.taskService.clickedTaskCopy[0].id,
        edit: this.showUserContacts()
      };
      this.taskService.updateTask([task]);
    }
    this.toggleService.openEditCard = false;
    this.toggleService.openWhiteBox = false;
  }

  showUserContacts(){
    const currentUser = localStorage.getItem('currentUser');
    return currentUser!.replace(/"/g, '');
  }
}
