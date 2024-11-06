import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../interface/user';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CardComponent } from './card/card.component';
import { ToggleBooleansService } from '../../../service/toggle-booleans.service';
import { TasksService } from '../../../service/tasks.service';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [ CommonModule, FormsModule, MatProgressBarModule, CardComponent],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent {

  @Input() category: string = '';
  @Input() createtBy: string = '';
  @Input() date: string = '';
  @Input() description: string = '';
  @Input() priority: string = '';
  @Input() title: string = '';
  @Input() id: string = '';
  @Input() assignetTo: User[] = [];
  @Input() subtasks: any[] = [];
  currentTask: any;
  taskDone: number = 0;
  currentDraggedElement: string = '';
  
  constructor(public toggleService: ToggleBooleansService, private taskService: TasksService){}
  openCard: boolean = false;

  getUserFirstLetter(user: User): string {
    return user!.firstName.charAt(0).toUpperCase() || '';
  }
  
  getUserSecondLetter(user: User): string {
    return user!.lastName.charAt(0).toUpperCase() || '';
  }

  checkAmountOfSubtasks(){
    if (this.subtasks) {
      return this.subtasks.length;
    } else {
      return '';
    }
  }

  openTaskCatd(taskID: string){
    const getTask = this.taskService.allTasks.filter(t => t.id === taskID);
    const getTaskCopy = JSON.parse(JSON.stringify(getTask)); 
    this.taskService.clickedTask = getTask;
    this.taskService.clickedTaskCopy = getTaskCopy;
    this.toggleService.openWhiteBox = true;    
  }

  checkCategory(){
    if (this.category === 'Technical Task') {
      return true;
    } else {
      return false;
    }
  }

  chackPercentage(): number {
    if (!this.subtasks || this.subtasks.length === 0) {
      return 0; 
    }
  
    this.taskDone = this.subtasks.filter(task => task.subtaskDone === true).length;
    const totalTasks = this.subtasks.length;
  
    const percentage = Math.round((this.taskDone / totalTasks) * 100);
    return percentage;
  }
  
  checkScreanWidth(){
    if (window.innerWidth <= 1380) {
      return true;
    } else {
      return false;
    }
  }

  
  openWindowToSwitshTask(event: Event){
    event.stopPropagation();
    this.toggleService.clickedTask = this.id;
  }

  moveTo(event: Event, category: string) {
    event.stopPropagation();
    const draggedIndex = this.id;
    if (draggedIndex !== null) {
      const getCurrentTask = this.taskService.allTasks.filter((t) => t.id === draggedIndex);
      getCurrentTask[0].category = category;
      this.taskService.updateTaskCategors( getCurrentTask[0].id! ,category);
    }
    this.toggleService.clickedTask = '';
  }

  closeSmallWindow(event: Event){
    event.stopPropagation();
    this.toggleService.clickedTask = '';
  }
}
