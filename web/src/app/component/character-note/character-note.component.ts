import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CharacterNote } from '../../../type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-note',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-note.component.html',
  styleUrl: './character-note.component.scss'
})
export class CharacterNoteComponent {
  @Input() note!: CharacterNote;
  @Output() delete = new EventEmitter<string>();

  onDelete(): void {
    this.delete.emit(this.note.id);
  }
}
