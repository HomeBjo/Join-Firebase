import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ContactsComponent } from './components/contacts/contacts.component';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ContactsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Join';

  constructor( private route: Router, private longinService:LoginService){
  }
  ngOnInit() {
    this.checkIfUserIsLoggedin();
  }


  checkIfUserIsLoggedin() {
    if (this.longinService.getCurrentUserId() === undefined) {
      this.route.navigateByUrl('/login');
    } else {
      this.route.navigateByUrl('/mainPage');
      // this.route.navigateByUrl('/board');
    }
  }
}
