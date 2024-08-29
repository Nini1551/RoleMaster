import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CharacterComponent } from './character.component';
import { CharacterService } from '../../service/character.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';


describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;
  let characterServiceMock: any;

  beforeEach(async () => {
    characterServiceMock = {
      getCharacter: jasmine.createSpy('getCharacter').and.returnValue(of({ id: '1', name: 'John Doe' })),
      getNotes: jasmine.createSpy('getNotes').and.returnValue(of([])),
      createNote: jasmine.createSpy('createNote').and.returnValue(of({})),
      deleteNote: jasmine.createSpy('deleteNote').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CharacterComponent],
      providers: [
        FormBuilder,
        HttpClient,
        provideHttpClientTesting(),
        HttpHandler,
        { provide: CharacterService, useValue: characterServiceMock },
        { provide: ActivatedRoute, useValue: { params: of({ id: '1' }) } },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct character', () => {
    expect(component.character.name).toBe('John Doe');
    expect(characterServiceMock.getCharacter).toHaveBeenCalledWith('1');
  });

  it('should initialize the form', () => {
    expect(component.noteForm).toBeDefined();
    expect(component.noteForm.controls['name']).toBeTruthy();
    expect(component.noteForm.controls['note']).toBeTruthy();
  });

  it('should fetch notes on initialization', () => {
    expect(characterServiceMock.getNotes).toHaveBeenCalledWith('1');
    expect(component.characterNotes.length).toBe(0);
  });

  it('should create a note when form is valid and submitted', () => {
    component.noteForm.controls['name'].setValue('Note 1');
    component.noteForm.controls['note'].setValue('This is a test note');
    component.onSubmit();
    expect(characterServiceMock.createNote).toHaveBeenCalledWith('1', 'Note 1', 'This is a test note');
  });

  it('should not create a note when form is invalid', () => {
    component.noteForm.controls['name'].setValue('');
    component.onSubmit();
    expect(component.noteForm.invalid).toBeTrue();
    expect(characterServiceMock.createNote).not.toHaveBeenCalled();
  });

  it('should handle errors when creating a note', () => {
    characterServiceMock.createNote.and.returnValue(throwError(() => new Error('Error creating note')));
    component.noteForm.controls['name'].setValue('Note 1');
    component.onSubmit();
    expect(component.errorMessage).toBe('Une erreur est survenue lors de la création de la note.');
  });

  it('should delete a note', () => {
    component.deleteNote('noteId');
    expect(characterServiceMock.deleteNote).toHaveBeenCalledWith('1', 'noteId');
  });
});
