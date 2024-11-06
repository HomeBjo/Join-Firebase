import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardAddTaskComponent } from './board-add-task.component';

describe('BoardAddTaskComponent', () => {
  let component: BoardAddTaskComponent;
  let fixture: ComponentFixture<BoardAddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardAddTaskComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoardAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
