export const ROUTES = {
  HOME: '/',
  PATIENT: {
    DASHBOARD: '/patient',
    METRICS: '/patient/metrics',
    APPOINTMENTS: '/patient/appointments',
    PRESCRIPTIONS: '/patient/prescriptions',
    MESSAGES: '/patient/messages',
    PROFILE: '/patient/profile',
  },
  DOCTOR: {
    DASHBOARD: '/doctor',
    ANALYTICS: '/doctor/analytics',
    APPOINTMENTS: '/doctor/appointments',
    MESSAGES: '/doctor/messages',
    PATIENTS: '/doctor/patients',
    PRESCRIPTIONS: '/doctor/prescriptions',
  },
  CLINIC: {
    DASHBOARD: '/clinic',
    REPORTS: '/clinic/reports',
    ALERTS: '/clinic/alerts',
    PATIENTS: '/clinic/patients',
    DOCTORS: '/clinic/doctors',
  },
  ADMIN: {
    DASHBOARD: '/admin',
    CLINICS: '/admin/clinics',
    USERS: '/admin/users',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
  },
};
