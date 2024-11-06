import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SummaryComponent } from './summary/summary.component';
import { AddTaskComponent } from './add-task/add-task.component';
import { BoardComponent } from './board/board.component';
import { ContactsComponent } from './contacts/contacts.component';
import { HeaderComponent } from './header/header.component';
import { ToggleBooleansService } from '../service/toggle-booleans.service';
import { FormsModule } from '@angular/forms';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [
    CommonModule,
    SummaryComponent,
    AddTaskComponent,
    BoardComponent,
    ContactsComponent,
    HeaderComponent,
    FormsModule, 
    ImpressumComponent,
    DatenschutzComponent
  ],
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss',
})
export class ComponentsComponent {
  clickCategory: string = '';

  constructor(public toggleService: ToggleBooleansService){
  }

  selectComponent(componentName: string) {
    this.toggleService.selectedComponent = componentName;
    this.clickCategory = componentName;
  }

  checkBooleansSummary(){
    this.toggleService.openBoard = false;
  }

  checkBooleansAddTask(){
    this.toggleService.openBoard = false;
  }

  checkBooleansBoard(){
    this.toggleService.openBoard = true;
  }

  checkBooleansContacts(){
    this.toggleService.openBoard = false;
  }

  toggleBooleans(){
    this.toggleService.showCategoryWindow = false;
    this.toggleService.showUserWindow = false;
    this.toggleService.slideInRightWindow = false;
    this.toggleService.openEditDeleteWindow = false;
    this.toggleService.headerInputValue = '';
    this.toggleService.clickedTask = '';
    this.toggleService.openWindowHeader = false;
  }
}
