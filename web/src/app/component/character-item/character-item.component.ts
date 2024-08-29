import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Character } from '../../../type';

@Component({
  selector: 'app-character-item',
  standalone: true,
  imports: [],
  templateUrl: './character-item.component.html',
  styleUrl: './character-item.component.scss'
})
export class CharacterItemComponent {
  @Input() character!: Character;
  @Output() delete = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.character.id);
  }
}
