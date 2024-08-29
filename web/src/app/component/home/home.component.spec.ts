import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { CharacterService } from '../../service/character.service';
import { Character } from '../../../type';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let characterService: jasmine.SpyObj<CharacterService>;

  const mockCharacters: Character[] = [
    { id: '1', name: 'Character_1' },
    { id: '2', name: 'Character_2' },
  ];

  beforeEach(async () => {
    // Create a spy for CharacterService with methods: getCharacters, create, delete
    const characterServiceSpy = jasmine.createSpyObj('CharacterService', ['getCharacters', 'create', 'delete']);

    await TestBed.configureTestingModule({
      declarations: [],
      imports: [ReactiveFormsModule],  // Import ReactiveFormsModule for form handling
      providers: [{ provide: CharacterService, useValue: characterServiceSpy }, HttpClient, HttpHandler, provideHttpClientTesting()],  // Provide the spy as CharacterService
    }).compileComponents();

    // Inject the mocked CharacterService
    characterService = TestBed.inject(CharacterService) as jasmine.SpyObj<CharacterService>;

    // Mock the API calls
    characterService.getCharacters.and.returnValue(of(mockCharacters));  // Mock getCharacters to return mock data
    characterService.create.and.returnValue(of(mockCharacters));  // Mock create to simulate a successful creation
    characterService.delete.and.returnValue(of({message: 'Character deleted'}));  // Mock delete to simulate successful deletion

    fixture = TestBed.createComponent(HomeComponent);  // Create the component
    component = fixture.componentInstance;
    fixture.detectChanges();  // Trigger change detection to initialize the component
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();  // Check if the component is created successfully
  });

  it('should fetch characters on initialization', () => {
    // Verify that getCharacters was called during initialization
    expect(characterService.getCharacters).toHaveBeenCalled();
    // Verify that the characters are loaded into the component
    expect(component.characters).toEqual(mockCharacters);
  });

  it('should display success message on character creation', () => {
    // Set the form value
    component.characterForm.setValue({ name: 'New_Character' });
    // Simulate form submission
    component.onSubmit();

    // Check if the create method was called with the correct argument
    expect(characterService.create).toHaveBeenCalledWith('New_Character');
    // Verify that the success message is set
    expect(component.successMessage).toBe("Le personnage 'New_Character' a bien été créé !");
  });

  it('should handle error during character creation', () => {
    // Mock create to simulate an error
    characterService.create.and.returnValue(throwError(() => new Error('Error')));
    // Set the form value
    component.characterForm.setValue({ name: 'New_Character' });
    // Simulate form submission
    component.onSubmit();

    // Check if the create method was called with the correct argument
    expect(characterService.create).toHaveBeenCalledWith('New_Character');
    // Verify that the error message is set
    expect(component.errorMessage).toBe('Une erreur est survenue lors de la création du personnage.');
  });

  it('should delete a character and update the character list', () => {
    // Simulate character deletion
    component.deleteCharacter('1');

    // Check if the delete method was called with the correct argument
    expect(characterService.delete).toHaveBeenCalledWith('1');
    // Verify that the success message is cleared
    expect(component.successMessage).toBeNull();
    // Verify that the error message is cleared
    expect(component.errorMessage).toBeNull();
  });
});
