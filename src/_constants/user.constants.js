export const userConstants = {
  REGISTER_REQUEST: 'USERS_REGISTER_REQUEST',
  REGISTER_SUCCESS: 'USERS_REGISTER_SUCCESS',
  REGISTER_FAILURE: 'USERS_REGISTER_FAILURE',

  LOGIN_REQUEST: 'USERS_LOGIN_REQUEST',
  LOGIN_SUCCESS: 'USERS_LOGIN_SUCCESS',
  LOGIN_FAILURE: 'USERS_LOGIN_FAILURE',

  LOGOUT: 'USERS_LOGOUT',

  GET_OWN_DATA_REQUEST: 'GET_OWN_DATA_REQUEST',
  GET_OWN_DATA_SUCCESS: 'GET_OWN_DATA_SUCCESS',
  GET_OWN_DATA_FAILURE: 'GET_OWN_DATA_FAILURE',

  DELETE_REQUEST: 'USERS_DELETE_REQUEST',
  DELETE_SUCCESS: 'USERS_DELETE_SUCCESS',
  DELETE_FAILURE: 'USERS_DELETE_FAILURE',

  ADMIN_ROLES: [
    'ROLE_ADMIN',
    'ROLE_SUPERVISOR',
  ],
  HR_ROLES: [
    'ROLE_ADMIN',
    'ROLE_SUPERVISOR',
    'ROLE_HR',
  ],
  DEPARTMENT_MANAGER_ROLES: [
    'ROLE_ADMIN',
    'ROLE_SUPERVISOR',
    'ROLE_HR',
    'ROLE_DEPARTMENT_MANAGER',
  ],
  SECTION_MANAGER_ROLES: [
    'ROLE_ADMIN',
    'ROLE_SUPERVISOR',
    'ROLE_HR',
    'ROLE_DEPARTMENT_MANAGER',
    'ROLE_SECTION_MANAGER',
  ],
  SECRETARY_ROLES: [
    'ROLE_ADMIN',
    'ROLE_SUPERVISOR',
    'ROLE_HR',
    'ROLE_DEPARTMENT_MANAGER',
    'ROLE_SECTION_MANAGER',
    'ROLE_SECRETARY',
  ],
  STATIC_ROLES: [
    'ROLE_USER',
  ],

  ROLES: {
    ROLE_ADMIN: 'ROLE_ADMIN',
    ROLE_SUPERVISOR: 'ROLE_SUPERVISOR',
    ROLE_HR: 'ROLE_HR',
    ROLE_DEPARTMENT_MANAGER: 'ROLE_DEPARTMENT_MANAGER',
    ROLE_SECTION_MANAGER: 'ROLE_SECTION_MANAGER',
    ROLE_SECRETARY: 'ROLE_SECRETARY',
    ROLE_USER: 'ROLE_USER',
  },
};
