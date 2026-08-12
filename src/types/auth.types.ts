import type { Profile, Role, UserType } from './database.types';

/** Fully hydrated auth user with profile, roles, and permissions */
export interface AuthUser {
  id: string;
  email: string;
  profile: Profile;
  roles: Role[];
  permissions: PermissionWithConfig[];
}

/** Permission with its granted status and sub-permission configuration */
export interface PermissionWithConfig {
  code: string;
  name: string;
  module: string;
  granted: boolean;
  config: SubPermissionConfig;
}

/** Granular sub-permission configuration for a module */
export interface SubPermissionConfig {
  view?: boolean;
  add?: boolean;
  edit?: boolean;
  delete?: boolean;
}

/** Lightweight session user for quick access */
export interface SessionUser {
  id: string;
  email: string;
  userType: UserType;
  firstName: string;
  lastName: string;
}

/** Login credentials */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** Registration data */
export interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}
