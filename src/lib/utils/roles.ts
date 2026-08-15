/**
 * Returns numeric hierarchy rank for role name:
 * - Super Admin: 100
 * - Admin / Director / Manager: 50
 * - Staff / Standard: 10
 */
export function getRoleRankByName(name: string): number {
  const normalized = (name || '').toLowerCase().trim();
  if (normalized.includes('super')) return 100;
  if (normalized.includes('admin') || normalized.includes('director') || normalized.includes('manager')) return 50;
  return 10;
}
