/**
 * User type for authentication
 */
export interface AuthUser {
  uid: string;
  email: string | null;
  name: string | null;
  image: string | null;
}