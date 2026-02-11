export type LocalCredential = {
  id: string;
  username: string;
  password: string;
  registrationId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  redirectPath: string;
};

const baseDomain = 'examplehospital.com';

export const LOCAL_USERS: Record<string, LocalCredential> = {
  superadmin: {
    id: 'user-superadmin',
    username: 'superadmin',
    password: 'super123',
    registrationId: 'SA-000001',
    firstName: 'Sara',
    lastName: 'Erickson',
    email: `superadmin@${baseDomain}`,
    role: 'SUPER_ADMIN',
    redirectPath: '/executive/overview',
  },
  admin: {
    id: 'user-admin',
    username: 'admin',
    password: 'admin123',
    registrationId: 'AD-000101',
    firstName: 'Alex',
    lastName: 'Daniels',
    email: `admin@${baseDomain}`,
    role: 'ADMIN',
    redirectPath: '/admin/overview',
  },
  doctor: {
    id: 'user-doctor',
    username: 'doctor',
    password: 'doctor123',
    registrationId: 'DR-245810',
    firstName: 'Derek',
    lastName: 'Reynolds',
    email: `doctor@${baseDomain}`,
    role: 'DOCTOR',
    redirectPath: '/doctor/overview',
  },
  patient: {
    id: 'user-patient',
    username: 'patient',
    password: 'patient123',
    registrationId: 'PT-558201',
    firstName: 'Priya',
    lastName: 'Thomas',
    email: `patient@${baseDomain}`,
    role: 'PATIENT',
    redirectPath: '/patient/overview',
  },
  lab: {
    id: 'user-lab',
    username: 'lab',
    password: 'lab123',
    registrationId: 'LB-337415',
    firstName: 'Liam',
    lastName: 'Baker',
    email: `lab@${baseDomain}`,
    role: 'LAB_TECH',
    redirectPath: '/lab/overview',
  },
  pharmacy: {
    id: 'user-pharmacy',
    username: 'pharmacy',
    password: 'pharmacy123',
    registrationId: 'PH-882134',
    firstName: 'Phoebe',
    lastName: 'Holt',
    email: `pharmacy@${baseDomain}`,
    role: 'PHARMACIST',
    redirectPath: '/pharmacy/overview',
  },
  accounts: {
    id: 'user-accounts',
    username: 'accounts',
    password: 'accounts123',
    registrationId: 'AC-771092',
    firstName: 'Aarav',
    lastName: 'Chopra',
    email: `accounts@${baseDomain}`,
    role: 'ACCOUNTANT',
    redirectPath: '/accounts/overview',
  },
};

export function authenticateLocalUser(username: string, password: string) {
  const normalizedKey = username.trim().toLowerCase();
  const record = LOCAL_USERS[normalizedKey];
  if (!record) {
    return null;
  }
  return record.password === password ? record : null;
}
