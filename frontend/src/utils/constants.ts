export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Federación Mexicana de Pickleball';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_SUCCESS: '/registration/success',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  MEMBERSHIP: '/membership',
  TOURNAMENTS: '/tournaments',
  COURTS: '/courts',
  RANKINGS: '/rankings',
  PLAYER_FINDER: '/player-finder',
  MESSAGING: '/messaging',
} as const;

export const USER_ROLES = {
  PLAYER: 'player',
  COACH: 'coach',
  CLUB: 'club',
  PARTNER: 'partner',
  STATE: 'state',
  FEDERATION: 'federation',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

export const MEXICAN_STATES = [
  { id: 1, name: 'Aguascalientes', code: 'AGU' },
  { id: 2, name: 'Baja California', code: 'BCN' },
  { id: 3, name: 'Baja California Sur', code: 'BCS' },
  { id: 4, name: 'Campeche', code: 'CAM' },
  { id: 5, name: 'Chiapas', code: 'CHP' },
  { id: 6, name: 'Chihuahua', code: 'CHH' },
  { id: 7, name: 'Ciudad de México', code: 'CMX' },
  { id: 8, name: 'Coahuila', code: 'COA' },
  { id: 9, name: 'Colima', code: 'COL' },
  { id: 10, name: 'Durango', code: 'DUR' },
  { id: 11, name: 'Guanajuato', code: 'GTO' },
  { id: 12, name: 'Guerrero', code: 'GRO' },
  { id: 13, name: 'Hidalgo', code: 'HID' },
  { id: 14, name: 'Jalisco', code: 'JAL' },
  { id: 15, name: 'México', code: 'MEX' },
  { id: 16, name: 'Michoacán', code: 'MIC' },
  { id: 17, name: 'Morelos', code: 'MOR' },
  { id: 18, name: 'Nayarit', code: 'NAY' },
  { id: 19, name: 'Nuevo León', code: 'NLE' },
  { id: 20, name: 'Oaxaca', code: 'OAX' },
  { id: 21, name: 'Puebla', code: 'PUE' },
  { id: 22, name: 'Querétaro', code: 'QRO' },
  { id: 23, name: 'Quintana Roo', code: 'ROO' },
  { id: 24, name: 'San Luis Potosí', code: 'SLP' },
  { id: 25, name: 'Sinaloa', code: 'SIN' },
  { id: 26, name: 'Sonora', code: 'SON' },
  { id: 27, name: 'Tabasco', code: 'TAB' },
  { id: 28, name: 'Tamaulipas', code: 'TAM' },
  { id: 29, name: 'Tlaxcala', code: 'TLA' },
  { id: 30, name: 'Veracruz', code: 'VER' },
  { id: 31, name: 'Yucatán', code: 'YUC' },
  { id: 32, name: 'Zacatecas', code: 'ZAC' },
] as const;

export const NRTP_LEVELS = [
  '1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '7.0'
] as const;

export const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
] as const;