import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null;
  }

  const hasMinLength = value.length >= 8;
  const hasUpperCase = value.split('').some((char : string) => char >= 'A' && char <= 'Z');
  const hasLowerCase = value.split('').some((char : string) => char >= 'a' && char <= 'z');
  const hasNumeric = value.split('').some((char : string) => char >= '0' && char <= '9');
  const hasSpecial = value.split('').some((char : string) => '!@#$%^&*(),.?":{}|<>'.includes(char));

  const passwordValid = hasMinLength && hasUpperCase && hasLowerCase && hasNumeric && hasSpecial;

  return !passwordValid ? { 'passwordInvalid': true } : null;
}

export function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;

  return password === confirmPassword ? null : { 'passwordMismatch': true };
}