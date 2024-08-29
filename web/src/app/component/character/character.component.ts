import { Component, OnInit } from '@angular/core';
import { CharacterService } from '../../service/character.service';
import { ActivatedRoute } from '@angular/router';
import { Character } from '../../../type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {
  id: string = '0';
  character: Character = { id: '0', name: 'Loading...' };

  constructor(private characterService: CharacterService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.characterService.getCharacter(this.id).subscribe({
      next: (character: Character) => {
        this.character = character;
      }
    });
  }
}
