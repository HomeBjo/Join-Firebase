import { Component, Input } from '@angular/core';
import { User } from '../../../../../interface/user';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../../service/users.service';
import { ToggleBooleansService } from '../../../../../service/toggle-booleans.service';
import { TasksService } from '../../../../../service/tasks.service';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-details.component.html',
  styleUrl: './card-details.component.scss'
})
export class CardDetailsComponent {
  // @Input() category: any;
  // @Input() category: string = '';
  // @Input() id: string = '';
  // @Input() createtBy: string = '';
  // @Input() date: string = '';
  // @Input() description: string = '';
  // @Input() priority: string = '';
  // @Input() title: string = '';
  // @Input() assignetTo: User[] = [];
  // @Input() subtasks: any[] = [];

  constructor(private userService: UsersService, public toggleService: ToggleBooleansService, public taskService: TasksService){}

  getProiImg(){
    if(this.taskService.clickedTask[0].priority === 'low'){
      return 'prio_baja.svg';
    } else if (this.taskService.clickedTask[0].priority === 'medium') {
      return 'prio_media.svg';
    } else if (this.taskService.clickedTask[0].priority === 'high') {
      return 'prio_alta.svg';
    }
    return '';
  }

  getUserFirstLetter(user: User): string {
    return user!.firstName.charAt(0).toUpperCase() || '';
  }
  
  getUserSecondLetter(user: User): string {
    return user!.lastName.charAt(0).toUpperCase() || '';
  }

  getuserName(){
    const currentUser = localStorage.getItem('currentUser');
    const filterUser = this.userService.allUsers.filter(u => u.id === this.userService.getCleanID(currentUser!))
    return `Task created by: ${filterUser[0].firstName} ${filterUser[0].lastName}`;
  }

  closeWindow(){
    this.toggleService.openWhiteBox = false;
  }

  editCard(){
    this.toggleService.openEditCard = true;
  }

  subtaskDone(index : number){
    const task = this.taskService.clickedTask[0].subtasks;
    if (index >= 0 && index < task.length) {
      task[index].subtaskDone = this.checkSubtaskValue(index);
      this.taskService.updateSubtasks(task, this.taskService.clickedTask[0].id);
    } else {
      console.error('Subtask not found at index:', index);
    }
  }

  checkSubtaskValue(index: number){
    const task = this.taskService.clickedTask[0].subtasks;
    if(task[index].subtaskDone){
      return false;
    } else {
      return true;
    }
  }

  deleteTask(){
    const id = this.taskService.clickedTask[0].id;
    this.taskService.deleteTask(id);
    this.closeWindow();
  }

  chechWidth(){
    if (window.innerWidth >= 780) {
      return true;
    } else {
      return false;
    }
  }
}
