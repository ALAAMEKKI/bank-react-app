// authService.test.ts
import { login, logout, isAuthenticated } from '../services/authService';

describe('AuthService', () => {
  test('login should return success for correct credentials', () => {
    const { success, token } = login('admin', 'password');
    expect(success).toBe(true);
    expect(token).toBe('fake-jwt-token');
    expect(localStorage.getItem('token')).toBe('fake-jwt-token');
  });

  test('login should return failure for incorrect credentials', () => {
    const { success } = login('admin', 'wrongpassword');
    expect(success).toBe(false);
  });

  test('isAuthenticated should return true after successful login', () => {
    login('admin', 'password');
    expect(isAuthenticated()).toBe(true);
  });

  test('isAuthenticated should return false if no token is present', () => {
    expect(isAuthenticated()).toBe(false);
  });

  test('logout should remove the token from localStorage', () => {
    login('admin', 'password');
    logout();
    expect(isAuthenticated()).toBe(false);
    expect(localStorage.getItem('token')).toBeNull();
  });
});
