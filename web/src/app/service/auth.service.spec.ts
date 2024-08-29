import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CookieService } from 'ngx-cookie-service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        CookieService,
        AuthService
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign up a user', () => {
    const mockUser = { username: 'testuser', email: 'test@example.com', password: 'password123' };
    const mockResponse = { success: true };

    service.signup(mockUser).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/users/signup');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);

    req.flush(mockResponse);
  });

  afterEach(() => {
    httpMock.verify();
  });
  
  it('should log in a user and update authenticatedSubject and usernameSubject', () => {
    const mockResponse = { authenticated: true, username: 'testuser' };
    const mockData = { email: 'test@example.com', password: 'password123' };
    service.login(mockData.email, mockData.password).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResponse);

    service.isAuthenticated$().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeTrue();
    });

    service.getUserName$().subscribe(username => {
      expect(username).toBe('testuser');
    });
  });

  it('should check auth status and update subjects', () => {
    const mockResponse = { authenticated: true, user: 'testuser' };

    service.checkAuthStatus().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/check-auth`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResponse);

    service.isAuthenticated$().subscribe(isAuthenticated => {
      expect(isAuthenticated).toBeTrue();
    });

    service.getUserName$().subscribe(username => {
      expect(username).toBe('testuser');
    });
  });

  it('should log out a user', () => {
    const mockResponse = { success: true };

    service.logout().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/logout`);
    expect(req.request.method).toBe('POST');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockResponse);
  });

  it('should get user profile', () => {
    const mockProfile = { username: 'testuser', email: 'test@example.com' };

    service.getUserProfile().subscribe(profile => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/userProfile`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBeTrue();
    req.flush(mockProfile);
  });

  it('should change password', () => {
    const mockResponse = { success: true };
    const mockRequest = { oldPassword: 'oldPass123', newPassword: 'newPass123' };

    service.changePasswordRequest(mockRequest.oldPassword, mockRequest.newPassword).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/changePassword`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should change username', () => {
    const mockResponse = { success: true };
    const mockRequest = { newUsername: 'newUsername123' };

    service.changeUsernameRequest(mockRequest.newUsername).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/changeUsername`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should change email', () => {
    const mockResponse = { success: true };
    const mockRequest = { newEmail: 'newemail@example.com' };

    service.changeEmailRequest(mockRequest.newEmail).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['baseUrl']}/changeEmail`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.withCredentials).toBeTrue();
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  }); 

  

  
});
