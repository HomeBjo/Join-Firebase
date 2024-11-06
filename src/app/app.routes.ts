
import { Routes } from '@angular/router';
import { SummaryComponent } from './components/summary/summary.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { BoardComponent } from './components/board/board.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/login/register/register.component';
import { ComponentsComponent } from './components/components.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { DatenschutzComponent } from './components/datenschutz/datenschutz.component';
import { DatenschutZComponent } from './components/login/datenschutz/datenschutz.component';
import { ImpressuMComponent } from './components/login/impressum/impressum.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'mainPage', component: ComponentsComponent },
    { path: 'summary', component: SummaryComponent },
    { path: 'addTask', component: AddTaskComponent },
    { path: 'board', component: BoardComponent },
    { path: 'contact', component: ContactsComponent },
    { path: 'impressum', component: ImpressumComponent },
    { path: 'impressumLogin', component: ImpressuMComponent },
    { path: 'datenschutz', component: DatenschutzComponent },
    { path: 'datenschutzLogin', component: DatenschutZComponent },
];
