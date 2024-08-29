import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function noWhiteSpaceValidator(control: AbstractControl): ValidationErrors | null { // Vérifie si la valeur contient des espaces
  if (control.value && control.value.indexOf(' ') >= 0) {
    return { hasWhiteSpace: true };
  }
  return null;
}

export function minLengthValidator(control: AbstractControl): ValidationErrors | null { // Vérifie si la longueur de la valeur est inférieure à 3 caractères
  const MIN_LENGTH = 3;
  if (control.value && control.value.length < MIN_LENGTH) {
    return { isTooShort: true };
  }
  return null;
}

export function uniqueUsernameValidator(usernames: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const username = control.value;
    const isUnique = usernames.indexOf(username) === -1;
    return isUnique ? null : { 'usernameTaken': true };
  };
}