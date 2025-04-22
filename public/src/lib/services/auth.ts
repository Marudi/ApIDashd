import { DatabaseService } from "./database";
import { z } from "zod";

export const UserRoleSchema = z.enum(['admin', 'editor', 'viewer']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: UserRoleSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastLogin: z.string().datetime().optional(),
  isActive: z.boolean().default(true),
});

export type User = z.infer<typeof UserSchema>;

export const PermissionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  resource: z.string().min(1),
  action: z.enum(['create', 'read', 'update', 'delete', 'manage']),
});

export type Permission = z.infer<typeof PermissionSchema>;

export class AuthService {
  private static instance: AuthService;
  private db: DatabaseService;
  private currentUser: User | null = null;

  private constructor() {
    this.db = DatabaseService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  public async initialize(): Promise<void> {
    await this.db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
        last_login TIMESTAMP WITH TIME ZONE,
        is_active BOOLEAN DEFAULT true
      );

      CREATE TABLE IF NOT EXISTS permissions (
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        resource VARCHAR(255) NOT NULL,
        action VARCHAR(20) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS role_permissions (
        role VARCHAR(20) NOT NULL,
        permission_id UUID NOT NULL REFERENCES permissions(id),
        PRIMARY KEY (role, permission_id)
      );

      -- Create default roles if they don't exist
      INSERT INTO role_permissions (role, permission_id)
      SELECT 'admin', id FROM permissions
      WHERE NOT EXISTS (SELECT 1 FROM role_permissions WHERE role = 'admin');

      INSERT INTO role_permissions (role, permission_id)
      SELECT 'editor', id FROM permissions
      WHERE resource IN ('apis', 'keys') AND action IN ('create', 'read', 'update')
      AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role = 'editor');

      INSERT INTO role_permissions (role, permission_id)
      SELECT 'viewer', id FROM permissions
      WHERE resource IN ('apis', 'keys') AND action = 'read'
      AND NOT EXISTS (SELECT 1 FROM role_permissions WHERE role = 'viewer');
    `);
  }

  public async login(email: string, password: string): Promise<User> {
    // In a real application, you would hash the password and verify it
    const user = await this.db.query<User>(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (!user[0]) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    await this.db.query(
      'UPDATE users SET last_login = $1 WHERE id = $2',
      [new Date().toISOString(), user[0].id]
    );

    this.currentUser = user[0];
    localStorage.setItem('currentUser', JSON.stringify(user[0]));
    return user[0];
  }

  public async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  public getCurrentUser(): User | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.currentUser = UserSchema.parse(JSON.parse(storedUser));
      }
    }
    return this.currentUser;
  }

  public async hasPermission(resource: string, action: string): Promise<boolean> {
    const user = this.getCurrentUser();
    if (!user) {
      return false;
    }

    if (user.role === 'admin') {
      return true;
    }

    const result = await this.db.query(
      `SELECT 1 FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role = $1 AND p.resource = $2 AND p.action = $3`,
      [user.role, resource, action]
    );

    return result.length > 0;
  }

  public async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLogin'>): Promise<User> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const newUser: User = {
      ...user,
      id,
      createdAt: now,
      updatedAt: now,
    };

    await this.db.query(
      `INSERT INTO users (id, email, name, role, created_at, updated_at, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        newUser.id,
        newUser.email,
        newUser.name,
        newUser.role,
        newUser.createdAt,
        newUser.updatedAt,
        newUser.isActive,
      ]
    );

    return newUser;
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const now = new Date().toISOString();
    const existing = await this.db.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );

    if (!existing[0]) {
      return null;
    }

    const updated: User = {
      ...existing[0],
      ...updates,
      updatedAt: now,
    };

    await this.db.query(
      `UPDATE users 
       SET email = $1, name = $2, role = $3, updated_at = $4, is_active = $5
       WHERE id = $6`,
      [
        updated.email,
        updated.name,
        updated.role,
        updated.updatedAt,
        updated.isActive,
        id,
      ]
    );

    return updated;
  }

  public async deleteUser(id: string): Promise<boolean> {
    const result = await this.db.query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    return result.length > 0;
  }

  public async listUsers(): Promise<User[]> {
    return this.db.query<User>('SELECT * FROM users ORDER BY created_at DESC');
  }

  public async createPermission(permission: Omit<Permission, 'id'>): Promise<Permission> {
    const id = crypto.randomUUID();
    
    const newPermission: Permission = {
      ...permission,
      id,
    };

    await this.db.query(
      `INSERT INTO permissions (id, name, description, resource, action)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        newPermission.id,
        newPermission.name,
        newPermission.description,
        newPermission.resource,
        newPermission.action,
      ]
    );

    return newPermission;
  }

  public async assignPermissionToRole(role: UserRole, permissionId: string): Promise<void> {
    await this.db.query(
      `INSERT INTO role_permissions (role, permission_id)
       VALUES ($1, $2)
       ON CONFLICT (role, permission_id) DO NOTHING`,
      [role, permissionId]
    );
  }

  public async removePermissionFromRole(role: UserRole, permissionId: string): Promise<void> {
    await this.db.query(
      'DELETE FROM role_permissions WHERE role = $1 AND permission_id = $2',
      [role, permissionId]
    );
  }
}
