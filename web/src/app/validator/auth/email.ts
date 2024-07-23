import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function emailValidator(control: AbstractControl): ValidationErrors | null {
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (control.value && !emailRegex.test(control.value)) {
    return { emailInvalid: true };
  }
  return null;
}

export function uniqueEmailValidator(emails: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const username = control.value;
    const isUnique = emails.indexOf(username) === -1;
    return isUnique ? null : { 'emailTaken': true };
  };
}