export class CustomAuthValidators {
  static validateEmail(email: string): string | null {
    if (!email) return 'Email is required.';
   
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Please enter a valid email address.';
    return null;
  }

  static validatePassword(password: string): string | null {
    if (!password) return 'Password is required.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    return null;
  }
}
