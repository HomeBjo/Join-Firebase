import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { Task } from '../interface/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  firestore: Firestore = inject(Firestore);
  allTasks: Task[] = [];
  allTasksCopy: Task[] = [];
  clickedTask: any;
  clickedTaskCopy: any;
  subtaskLenghtValue: number = 0;

  unsubTasks;
  constructor() {
    this.unsubTasks = this.subTaskList();
  }

  subTaskList() {
    return onSnapshot(collection(this.firestore, 'tasks'), (list) => {
      this.allTasks = [];
      this.allTasksCopy = [];
      list.forEach((element) => {
        const userWithId = { id: element.id, ...element.data() } as Task;
        this.allTasks.push(userWithId);
        this.allTasksCopy.push(userWithId);
      });
    });
  }

  async addTask(task: Task[]){
    const usersCollection = collection(this.firestore, 'tasks');
    try {
      await addDoc(usersCollection, task[0]);
    } catch (error) {
      console.error('Create task failed');
      
    }
  }

  async updateTaskCategors(id: string, taskCategory: string){
    const docRef = doc(this.firestore, `tasks/${id}`);
    try {
      await updateDoc(docRef,  { 
        category: taskCategory
       });
    } catch (error) {
      console.error('Update taskCategory failed');
    }
  }

  async updateSubtasks(subtasks: any, id: string){
    const docRef = doc(this.firestore, `tasks/${id}`);
    try {
      await updateDoc(docRef,  { 
        subtasks: subtasks
       });
    } catch (error) {
      console.error('Update subtask failed');
    }
  }


  async updateTask(task: Task[]){
    const docRef = doc(this.firestore, `tasks/${task[0].id}`);
    try {
      await updateDoc(docRef,  { ...task[0] });
    } catch (error) {
      console.error('Update task failed');
    }
  }

  async deleteTask(id :string){
    try {
      await deleteDoc(doc(this.firestore, `tasks/${id}`));
    } catch (error) {
      console.error('Delete task failed');
    }
  }

  ngOnDestroy() {
    this.subTaskList();
  }
}
