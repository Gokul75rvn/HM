import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const AUTH_STORAGE_KEY = 'hms.auth.state';
const LEGACY_KEYS = ['user', 'accessToken', 'refreshToken'];

export interface AuthState {
  isAuthenticated: boolean;
  role: string | null;
  user: {
    id: string;
    registrationId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    redirectPath?: string;
  } | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage;
  } catch (error) {
    console.warn('Unable to access localStorage', error);
    return null;
  }
};

const clearLegacyAuthKeys = () => {
  const storage = getStorage();
  if (!storage) return;
  LEGACY_KEYS.forEach((key) => storage.removeItem(key));
};

const readPersistedState = (): Partial<AuthState> => {
  const storage = getStorage();
  if (!storage) return {};
  clearLegacyAuthKeys();
  try {
    const raw = storage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    const isValidAuthFlag = typeof parsed?.isAuthenticated === 'boolean';
    const isValidRole = parsed?.role === null || typeof parsed?.role === 'string';

    if (!isValidAuthFlag || !isValidRole || (parsed.isAuthenticated && typeof parsed.role !== 'string')) {
      storage.removeItem(AUTH_STORAGE_KEY);
      return {};
    }

    return {
      isAuthenticated: parsed.isAuthenticated,
      role: parsed.role,
      user: parsed.user ?? null,
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
    };
  } catch (error) {
    console.warn('Failed to parse stored auth state', error);
    storage.removeItem(AUTH_STORAGE_KEY);
    return {};
  }
};

const persistAuthState = (state: AuthState) => {
  const storage = getStorage();
  if (!storage) return;
  clearLegacyAuthKeys();
  if (!state.isAuthenticated || !state.role) {
    storage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  const snapshot = {
    isAuthenticated: true,
    role: state.role,
    user: state.user,
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  };
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(snapshot));
};

const defaultState: AuthState = {
  isAuthenticated: false,
  role: null,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const initialState: AuthState = {
  ...defaultState,
  ...readPersistedState(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthState['user'];
        accessToken: string;
        refreshToken: string;
      }>,
    ) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.role = user?.role ?? null;
      state.isAuthenticated = Boolean(state.role);
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.error = null;
      persistAuthState(state);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.role = null;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.error = null;
      persistAuthState(state);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, setLoading, setError, clearError } = authSlice.actions;
export default authSlice.reducer;
