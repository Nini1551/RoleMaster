import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Character } from "../../../type";
import { map } from "rxjs";

export function uniqueCharacterNameValidator(characters: Character[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name = control.value;
    for (let character of characters) {
      if (character.name === name) {
        return { 'nameTaken': true };
      }
    }
    return null
  };
}