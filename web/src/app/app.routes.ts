import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { RegisterComponent } from './component/auth/register/register.component';
import { LoginComponent } from './component/auth/login/login.component';
import { ProfileComponent } from './component/profile/profile.component';
import { authGuard } from './guard/auth.guard';
import { CharacterComponent } from './component/character/character.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard]
  },
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [authGuard]
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
    component: ProfileComponent, 
    canActivate: [authGuard]
  },
  {
    path: 'character/:id',
    component: CharacterComponent,
    canActivate: [authGuard]
  }
];
