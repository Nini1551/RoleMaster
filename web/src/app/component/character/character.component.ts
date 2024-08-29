import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CharacterService } from '../../service/character.service';
import { Character } from '../../../type';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [],
  templateUrl: './character.component.html',
  styleUrl: './character.component.scss'
})
export class CharacterComponent {
  @Input() character!: Character;
  @Output() delete = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.character.id);
  }
}
