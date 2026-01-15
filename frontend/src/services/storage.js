const STORAGE_KEYS = {
  TOKEN: 'towerspace_token',
  USER: 'towerspace_user',
  THEME: 'towerspace_theme',
  LANGUAGE: 'towerspace_language'
};

class StorageService {
  // Token Management
  setToken(token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  removeToken() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  // User Management
  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  }

  removeUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Theme Management
  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  }

  // Clear All
  clearAll() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    // Don't clear theme preference
  }

  // Session Storage (for temporary data)
  setSession(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getSession(key) {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeSession(key) {
    sessionStorage.removeItem(key);
  }

  clearSession() {
    sessionStorage.clear();
  }
}

export default new StorageService();