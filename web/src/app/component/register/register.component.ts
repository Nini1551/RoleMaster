import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  usernames: string[] = [];
  emails: string[] = [];


  constructor(private auth: AuthService) {  };

  ngOnInit() {
    this.auth.getUsers().subscribe(
      (data) => {
        this.usernames = data.map((user: any) => user.username);
        this.emails = data.map((user: any) => user.email);
      },
      (error) => {console.log(error)}
    );
  }

}
