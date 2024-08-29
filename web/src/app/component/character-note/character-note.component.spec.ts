import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterNoteComponent } from './character-note.component';

describe('CharacterNoteComponent', () => {
  let component: CharacterNoteComponent;
  let fixture: ComponentFixture<CharacterNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
