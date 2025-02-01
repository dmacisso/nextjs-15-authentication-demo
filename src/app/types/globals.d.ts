export {}; //* This make the file a module

export type Roles = 'admin' | 'moderator';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}
