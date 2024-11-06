import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToggleBooleansService {

  constructor() { }

  openBoard:boolean = false;
  showCategoryWindow:boolean = false;
  showUserWindow:boolean = false;
  slideInRightWindow:boolean = false;
  openEditCard:boolean = false;
  openWhiteBox:boolean = false;
  openWindowHeader:boolean = false;
  selectedComponent: string = 'summary';
  headerInputValue: string  = '';
  clickedTask: string = '';
  openEditDeleteWindow:boolean = false;
  openWindowSwitshTask:boolean = false;

}
