import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../../../interface/user';
import { CommonModule } from '@angular/common';
import { CardDetailsComponent } from './card-details/card-details.component';
import { CardEditComponent } from './card-edit/card-edit.component';
import { ToggleBooleansService } from '../../../../service/toggle-booleans.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule, FormsModule, CardDetailsComponent, CardEditComponent],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {

  // @Input() currentTask: any;
  @Input() id: string = '';
  @Input() category: string = '';
  @Input() createtBy: string = '';
  @Input() date: string = '';
  @Input() description: string = '';
  @Input() priority: string = '';
  @Input() title: string = '';
  @Input() assignetTo: User[] = [];
  @Input() subtasks: any[] = [];

  @Input() openCard!: boolean;
  @Output() closeBigWindow = new EventEmitter<boolean>();

  constructor(public toggleService: ToggleBooleansService){}

  // closeWindow(){
  //   this.openCard = false;
  //   this.closeBigWindow.emit(this.openCard);
  // }
  closeWindow(){
    this.toggleService.openWhiteBox = false;
    this.toggleService.openEditCard = false;
  }
}
