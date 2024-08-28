import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../../../service/auth.service';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Création des mocks
    authServiceMock = {
      isAuthenticated$: jasmine.createSpy('isAuthenticated$').and.returnValue(of(false)),
      getUserName$: jasmine.createSpy('getUserName$').and.returnValue(of(null)),
      checkAuthStatus: jasmine.createSpy('checkAuthStatus').and.returnValue(of({ authenticated: false })),
      logout: jasmine.createSpy('logout').and.returnValue(of({}))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should be create', () => {
    expect(component).toBeTruthy();
  });

  it('should set isAuthenticated to true when the user is authenticated', () => {
    authServiceMock.isAuthenticated$.and.returnValue(of(true));
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.isAuthenticated).toBeTrue();
  });

  it('should set username when the user is authenticated', () => {
    const testUsername = 'John Doe';
    authServiceMock.isAuthenticated$.and.returnValue(of(true));
    authServiceMock.getUserName$.and.returnValue(of(testUsername));
    fixture.detectChanges();
    component.ngOnInit();

    expect(component.username).toBe(testUsername);
  });

  it('should set username to null when the user is not authenticated', () => {
    authServiceMock.isAuthenticated$.and.returnValue(of(false));
    fixture.detectChanges();

    expect(component.username).toBeNull();
  });

  it('should navigate to login and clear user data on logout', () => {
    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.isAuthenticated).toBeFalse();
    expect(component.username).toBeNull();
  });


  it('should display [register button] and [login button] when not authenticated and should hide  [username profil link]&[logout button]', () => {
    authServiceMock.isAuthenticated$.and.returnValue(of(false));
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.navbar-right .nav-button[href="/register"]')).toBeTruthy();
    expect(compiled.querySelector('.navbar-right .nav-button[href="/login"]')).toBeTruthy();
    
    expect(compiled.querySelector('.nav-profile')).toBeNull(); 
    expect(compiled.querySelector("navbar-right .nav-button[href='/logout'")).toBeNull();
  })
});

 