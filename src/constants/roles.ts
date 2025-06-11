export const USER_ROLES = {
  USER_DEPT: 'user_dept',
  HOD: 'hod',
  STORE: 'store',
  REGISTRAR: 'registrar',
  CPD: 'cpd',
  OFFICER: 'officer',
  MANAGEMENT: 'management',
  VENDOR: 'vendor'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const ROLE_ROUTES = {
  [USER_ROLES.USER_DEPT]: '/users',
  [USER_ROLES.HOD]: '/hod',
  [USER_ROLES.STORE]: '/store',
  [USER_ROLES.REGISTRAR]: '/registrar',
  [USER_ROLES.CPD]: '/cpd',
  [USER_ROLES.OFFICER]: '/officer',
  [USER_ROLES.MANAGEMENT]: '/management',
  [USER_ROLES.VENDOR]: '/vendor'
};

export const ROLE_NAMES = {
  [USER_ROLES.USER_DEPT]: 'User Department',
  [USER_ROLES.HOD]: 'Head of Department',
  [USER_ROLES.STORE]: 'Store Department',
  [USER_ROLES.REGISTRAR]: 'Registrar/Principal',
  [USER_ROLES.CPD]: 'CPD Officer',
  [USER_ROLES.OFFICER]: 'Purchase Officer',
  [USER_ROLES.MANAGEMENT]: 'Management',
  [USER_ROLES.VENDOR]: 'Vendor'
};

export const INDENT_STATUS = {
  DRAFT: 'draft',
  PENDING_HOD: 'pending_hod',
  PENDING_STORE: 'pending_store',
  PENDING_REGISTRAR: 'pending_registrar',
  PENDING_CPD: 'pending_cpd',
  PENDING_MANAGEMENT: 'pending_management',
  APPROVED: 'approved',
  REJECTED: 'rejected'
} as const;

export type IndentStatus = typeof INDENT_STATUS[keyof typeof INDENT_STATUS];
