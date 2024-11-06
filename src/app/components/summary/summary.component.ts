import { Component } from '@angular/core';
import { TasksService } from '../../service/tasks.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../service/users.service';
import { Task } from 'zone.js/lib/zone-impl';
import { ToggleBooleansService } from '../../service/toggle-booleans.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent {
  currentValues: any;

  constructor(private taskService: TasksService, private userService: UsersService, private toggleService: ToggleBooleansService ){}


  getTime(){
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    let greetingMessage = '';
    this.getTasksValues();

    if (currentHour >= 5 && currentHour < 12) {
      return  greetingMessage = 'Good morning, ';
    } else if (currentHour >= 12 && currentHour < 18) {
      return  greetingMessage = 'Good afternoon, ';
    } else {
      return  greetingMessage = 'Good evening, ';
    }
  }


  getUserName() {
    const userID = this.showUserContacts();
    const getUser = this.userService.allUsers.filter(u => u.id === userID);
    return `${getUser[0]?.firstName || ''} ${getUser[0]?.lastName || ''}`;
  }
  

  showUserContacts(){
    const currentUser = localStorage.getItem('currentUser');
    return currentUser!.replace(/"/g, '');
  }

  getTasksValues(){
    let tasks = this.taskService.allTasks;
    let valueToDo = 0;
    let valueProgress = 0;
    let valueFeedBack = 0;
    let valueDone = 0;

    tasks.forEach(task => {
        if (task.category === "toDo") {
            valueToDo++;
        } else if (task.category === "inProgress") {
            valueProgress++;
        } else if (task.category === "awaitFeedback") {
            valueFeedBack++;
        } else if (task.category === "done") {
            valueDone++;
        }});

    this.currentValues = {
        todo: valueToDo,
        progress: valueProgress,
        feedBack: valueFeedBack,
        done: valueDone
      };
  }


  getUrbanTasksNumber(){
    const tasks = this.taskService.allTasks.filter((task) => task.priority === 'high');
    return tasks.length;
  }


  getDate() {
    const tasks = this.taskService.allTasks;
  
    // Filter tasks with high priority and a valid date
    const tasksWithHighPrioAndDate = tasks.filter(
      (task) => task.priority === 'high' && task.date !== undefined && task.date !== null
    );
  
    // Handle the case where no tasks with high priority and date exist
    if (tasksWithHighPrioAndDate.length === 0) {
      return null;
    }
  
    // Find the task with the earliest date
    let earliestTask = tasksWithHighPrioAndDate[0];
    for (const task of tasksWithHighPrioAndDate) {
      const currentTaskDate = new Date(task.date);
      if (earliestTask) {
        const earliestTaskDate = new Date(earliestTask.date);
        if (currentTaskDate < earliestTaskDate) {
          earliestTask = task;
        }
      }
    }
  
    // Format the earliest date if a task is found
    if (earliestTask) {
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(earliestTask.date));
      return formattedDate;
    }
  
    return null;
  }


  showTaskOnBoard(){
    return this.taskService.allTasks.length;
  }


  amountTaskToDo(){
    return `${this.currentValues.todo || ''}`;
  }


  amountTaskProgress(){
    return `${this.currentValues.progress || ''}`;
  }


  amountTaskFeedback(){
    return `${this.currentValues.feedBack || ''}`;
  }


  amountTaskDone(){
    return `${this.currentValues.done || ''}`;
  }

  routeToBoard(){
    this.toggleService.selectedComponent = 'board';
    this.toggleService.openBoard = true;
  }
}
