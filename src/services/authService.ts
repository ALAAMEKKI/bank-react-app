export const login = (username: string, password: string): { success: boolean; token?: string } => {
    if (username === 'alaamekki' && password === 'password') {
      const token = 'fake-jwt-token';
      localStorage.setItem('token', token);
      return { success: true, token };
    }
    return { success: false };
  };
  
  export const logout = (): void => {
    localStorage.removeItem('token');
  };
  
  export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
  };
  