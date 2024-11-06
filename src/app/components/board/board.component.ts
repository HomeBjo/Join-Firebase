import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ToggleBooleansService } from '../../service/toggle-booleans.service';
import { OnDragHighlightDirective } from '../../directives/on-drag-highlight.directive';
import { TasksService } from '../../service/tasks.service';
import { TaskComponent } from './task/task.component';
import { FormsModule } from '@angular/forms';
import { BoardAddTaskComponent } from './board-add-task/board-add-task.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, OnDragHighlightDirective, TaskComponent, FormsModule, BoardAddTaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @ViewChild('openArea') open!: ElementRef;
  @ViewChild('closedArea') closed!: ElementRef;

  currentDraggedElement: string = '';
  filterTaskValue: string = '';
  toDoCategory: any[] = [];
  inProgressCategory: any[] = [];
  awaitFeedbackCategory: any[] = [];
  doneCategory: any[] = [];
  currentCategory: string = 'open';
  openAddNewTaskWindow: boolean = false;
  CategorY: string= '';
  filteredTasks: any[] = [];


  constructor(public toggleService: ToggleBooleansService, public taskService: TasksService) {}


  getToDOCategory() {
    this.toDoCategory = this.taskService.allTasks.filter((t) => t.category === 'toDo');
    if (this.toDoCategory.length > 0) {
      return true;
    }
    return false;
  }

  getInProgressCategory() {
    this.inProgressCategory = this.taskService.allTasks.filter((t) => t.category === 'inProgress');
    if (this.inProgressCategory.length > 0) {
      return true;
    }
    return false;
  }

  getAwaitFeedbackCategory() {
    this.awaitFeedbackCategory = this.taskService.allTasks.filter((t) => t.category === 'awaitFeedback');
    if (this.awaitFeedbackCategory.length > 0) {
      return true;
    }
    return false;
  }

  getDoneategory() {
    this.doneCategory = this.taskService.allTasks.filter((t) => t.category === 'done');
    if (this.doneCategory.length > 0) {
      return true;
    }
    return false;
  }

  startDragging(id: string) {
    this.currentDraggedElement = id; 
  }

  allowDrop(event: Event) {
    event.preventDefault();
  }

  moveTo(category: string) {
    const draggedIndex = this.currentDraggedElement;
    if (draggedIndex !== null) {
      const getCurrentTask = this.taskService.allTasks.filter((t) => t.id === this.currentDraggedElement);
      getCurrentTask[0].category = category;
      this.taskService.updateTaskCategors( getCurrentTask[0].id! ,category);
    }
  }

  highlight(category: string) {
    this.currentCategory = category;
    
  }
  
  removeHighlight(category: string) {
    this.currentCategory = category;
  }

  createNewTask(taskCategory: string){
    this.openAddNewTaskWindow = true;
    this.CategorY = taskCategory;
  }

  toggleBoolean(vlaue: boolean){
    this.openAddNewTaskWindow = vlaue;
  }

  filterExistingTask() {
    const filteredTasks = this.taskService.allTasks.filter(task =>
      task.title.replace(/\s/g, '').toLowerCase().includes(this.filterTaskValue.replace(/\s/g, '').toLowerCase())
    );

    if (filteredTasks.length === 1) {
      this.toDoCategory = [];
      this.inProgressCategory = [];
      this.awaitFeedbackCategory  = [];
      this.doneCategory = [];
      const singleTask = filteredTasks;
      this.updateCategoryLists(singleTask);
      return true;
    } else {
      this.toDoCategory = this.taskService.allTasks.filter(t => t.category === 'toDo');
      this.inProgressCategory = this.taskService.allTasks.filter(t => t.category === 'inProgress');
      this.awaitFeedbackCategory = this.taskService.allTasks.filter(t => t.category === 'awaitFeedback');
      this.doneCategory = this.taskService.allTasks.filter(t => t.category === 'done');    
      return false;
    }
  }


  updateCategoryLists(tasks : any) {
    this.toDoCategory = tasks.filter((task: any) => task.category === 'toDo');
    this.inProgressCategory = tasks.filter((task: any) => task.category === 'inProgress');
    this.awaitFeedbackCategory = tasks.filter((task: any) => task.category === 'awaitFeedback');
    this.doneCategory = tasks.filter((task: any) => task.category === 'done');
  }
}
