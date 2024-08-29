import { Component } from '@angular/core';
import { Character } from '../../../type';
import { CharacterService } from '../../service/character.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { noWhiteSpaceValidator } from '../../validator/auth/username.validator';
import { uniqueCharacterNameValidator } from '../../validator/auth/character.validator';
import { CharacterItemComponent } from '../character-item/character-item.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CharacterItemComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  characters: Character[] = [];
  submitted = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  characterForm!: FormGroup;

  constructor(private characterService: CharacterService, private formBuilder: FormBuilder) {
    this.getCharacters();
  }

  ngOnInit() {
    this.characterForm = this.formBuilder.group({
      name: ['', [
        Validators.required, 
        noWhiteSpaceValidator.bind(this),
        uniqueCharacterNameValidator(this.characters).bind(this),
      ]],
    });
  }
  get f() { return this.characterForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.characterForm.invalid) {
      return;
    }
    this.createCharacter(this.characterForm.value.name);
  }

  getCharacters() {
    this.characterService.getCharacters().subscribe({
      next: (characters: Character[]) => {
        this.characters = characters;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  createCharacter(name: string) {

    this.characterService.create(name).subscribe({
      next: () => {
        this.getCharacters();
        this.errorMessage = null;
        this.successMessage = `Le personnage '${name}' a bien été créé !`;
      },
      error: (error) => {
        console.error(error);
        this.successMessage = null;
        this.submitted = false;
        this.errorMessage = 'Une erreur est survenue lors de la création du personnage.';
      },
    });
  }

  deleteCharacter(id: string) {
    this.characterService.delete(id).subscribe({
      next: () => {
        this.getCharacters();
        this.errorMessage = null;
        this.successMessage = null;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
