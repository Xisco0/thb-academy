import 'server-only';
import { createClient } from '@/lib/supabase/server';

export async function getUserPermissions(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      role:roles!inner(
        id,
        name,
        role_permissions(
          granted,
          config,
          permission:permissions!inner(
            id,
            code,
            name,
            module,
            sub_permissions
          )
        )
      )
    `)
    .eq('user_id', userId);

  if (error || !data) return [];

  const permissionsMap = new Map<string, { code: string; name: string; module: string; granted: boolean; config: Record<string, boolean> }>();

  for (const userRole of data) {
    const role = userRole.role as any;
    if (!role?.role_permissions) continue;

    for (const rp of role.role_permissions) {
      if (!rp.permission || !rp.granted) continue;
      const perm = rp.permission;
      const existing = permissionsMap.get(perm.code);

      if (existing) {
        const mergedConfig = { ...existing.config };
        const newConfig = (rp.config || {}) as Record<string, boolean>;
        for (const [key, value] of Object.entries(newConfig)) {
          if (value === true) mergedConfig[key] = true;
        }
        permissionsMap.set(perm.code, { ...existing, config: mergedConfig });
      } else {
        permissionsMap.set(perm.code, {
          code: perm.code,
          name: perm.name,
          module: perm.module,
          granted: true,
          config: (rp.config || {}) as Record<string, boolean>,
        });
      }
    }
  }

  return Array.from(permissionsMap.values());
}

export async function hasPermission(userId: string, permissionCode: string): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  return permissions.some(p => p.code === permissionCode && p.granted);
}

export async function hasSubPermission(
  userId: string,
  permissionCode: string,
  subPermission: 'view' | 'add' | 'edit' | 'delete'
): Promise<boolean> {
  const permissions = await getUserPermissions(userId);
  const perm = permissions.find(p => p.code === permissionCode);
  if (!perm || !perm.granted) return false;
  if (!perm.config || Object.keys(perm.config).length === 0) return true;
  return perm.config[subPermission] === true;
}

export async function requirePermission(userId: string, permissionCode: string): Promise<void> {
  const allowed = await hasPermission(userId, permissionCode);
  if (!allowed) {
    throw new Error(`Unauthorized: Missing permission '${permissionCode}'`);
  }
}

export async function requireSubPermission(
  userId: string,
  permissionCode: string,
  subPermission: 'view' | 'add' | 'edit' | 'delete'
): Promise<void> {
  const allowed = await hasSubPermission(userId, permissionCode, subPermission);
  if (!allowed) {
    throw new Error(`Unauthorized: Missing permission '${permissionCode}:${subPermission}'`);
  }
}
