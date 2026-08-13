import * as Yup from 'yup';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';

// ── LocalStorage helpers ─────────────────────────────────────────────────────

export function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// ── Active Session Management ─────────────────────────────────────────────────

export function getCurrentUser() {
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user) {
  if (!user) return;
  const { password, ...safeUser } = user;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  window.dispatchEvent(new CustomEvent('authChange'));
}

export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new CustomEvent('authChange'));
}

export function getUserInitials(user) {
  if (!user) return '';
  const first = user.firstName ? user.firstName.trim().charAt(0).toUpperCase() : '';
  const last  = user.lastName ? user.lastName.trim().charAt(0).toUpperCase() : '';
  const initials = `${first}${last}`.trim();
  if (initials) return initials;
  if (user.email) return user.email.trim().charAt(0).toUpperCase();
  return 'U';
}

// ── Yup Schemas ──────────────────────────────────────────────────────────────

const registerSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName:  Yup.string().required('Last name is required'),
  email:     Yup.string().email('Invalid email address').required('Email is required'),
  password:  Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

const loginSchema = Yup.object({
  email:    Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

// ── Auth Actions ─────────────────────────────────────────────────────────────

/**
 * Validates and registers a new user in localStorage.
 * Throws a Yup-shaped error object on failure.
 */
export async function registerUser({ firstName, lastName, email, password }) {
  // Yup validation
  await registerSchema.validate({ firstName, lastName, email, password }, { abortEarly: false });

  // Check email uniqueness
  const users = getUsers();
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    const err = new Yup.ValidationError('This email is already registered', email, 'email');
    throw err;
  }

  // Save
  const newUser = { firstName, lastName, email, password };
  users.push(newUser);
  saveUsers(users);

  // Set active session
  setCurrentUser(newUser);

  return newUser;
}

/**
 * Validates credentials and returns the user on success.
 * Throws a Yup-shaped error object on failure.
 */
export async function loginUser({ email, password }) {
  // Yup validation
  await loginSchema.validate({ email, password }, { abortEarly: false });

  // Check credentials
  const users = getUsers();
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Yup.ValidationError('Invalid email or password', null, 'general');
  }

  // Set active session
  setCurrentUser(user);

  return user;
}
