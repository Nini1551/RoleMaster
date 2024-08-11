import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/auth/register/register.component';
import { LoginComponent } from './component/auth/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  }
];
