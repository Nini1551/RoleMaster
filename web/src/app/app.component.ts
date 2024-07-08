import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './service/api.service';
import { HeaderComponent } from './component/layout/header/header.component';
import { HomeComponent } from './component/home/home.component';
import { FooterComponent } from './component/layout/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'RoleMaster';
  message: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getHello().subscribe(data => {
      this.message = data.message;
    });
  }
}
