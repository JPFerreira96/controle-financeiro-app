export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

