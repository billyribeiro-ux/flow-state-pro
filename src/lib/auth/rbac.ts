import { getDbUser } from "./clerk";

export type Role = "user" | "admin" | "super_admin";

const ROLE_HIERARCHY: Record<Role, number> = {
  user: 0,
  admin: 1,
  super_admin: 2,
};

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export async function requireRole(requiredRole: Role): Promise<{
  id: string;
  role: Role;
}> {
  const user = await getDbUser();
  const userRole = (user.role as Role) ?? "user";

  if (!hasRole(userRole, requiredRole)) {
    throw new Error(`Insufficient permissions. Required: ${requiredRole}, Current: ${userRole}`);
  }

  return { id: user.id, role: userRole };
}

export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getDbUser();
    return hasRole((user.role as Role) ?? "user", "admin");
  } catch {
    return false;
  }
}
