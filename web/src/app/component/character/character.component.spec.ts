import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterComponent } from './character.component';
import { CharacterService } from '../../service/character.service';

describe('CharacterComponent', () => {
  let component: CharacterComponent;
  let fixture: ComponentFixture<CharacterComponent>;
  let CharacterService: jasmine.SpyObj<CharacterService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CharacterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
