import { Role } from './role';

export class User {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  persona: JSON;
  roles: Array<any>;
  token?: string;
  estado: string;
}
