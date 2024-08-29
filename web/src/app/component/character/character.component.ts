import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../service/character.service';
import { ActivatedRoute } from '@angular/router';
import { Character, CharacterNote } from '../../../type';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CharacterNoteComponent } from "../character-note/character-note.component";

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CharacterNoteComponent],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {
  id: string = '0';
  character: Character = { id: '0', name: 'Loading...' };
  characterNotes: CharacterNote[] = [];
  noteForm!: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private characterService: CharacterService, private route: ActivatedRoute, private formBuilder: FormBuilder) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.characterService.getCharacter(this.id).subscribe({
      next: (character: Character) => {
        this.character = character;
      }
    });

    this.getNotes();
  }

  ngOnInit() {
    this.noteForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      note: [''],
    });
  }

  getNotes() {
    this.characterService.getNotes(this.id).subscribe({
      next: (notes: CharacterNote[]) => {
        this.characterNotes = notes;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  deleteNote(noteId: string) {
    this.characterService.deleteNote(this.id, noteId).subscribe({
      next: () => {
        this.getNotes();
        this.errorMessage = null;
        this.successMessage = null;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  createNote(name: string, note: string) {
    this.characterService.createNote(this.character.id, name, note).subscribe({
      next: () => {
        this.getNotes();
        this.errorMessage = null;
        this.successMessage = `La note '${name}' a bien été créée !`
      },
      error: (error) => {
        this.submitted = false;
        this.successMessage = null;
        this.errorMessage = 'Une erreur est survenue lors de la création de la note.';
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.noteForm.invalid) {
      return;
    }
    this.createNote(this.noteForm.value.name, this.noteForm.value.note);
  }
}
