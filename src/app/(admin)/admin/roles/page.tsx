import { getAllRoles } from '@/lib/queries/admin';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Roles & Permissions | Admin'
};

export default async function RolesPage() {
  const roles = await getAllRoles() as Record<string, any>[];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminTopBar title="Roles & Permissions" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles?.map((role) => (
          <div key={role.id} className="bg-navy-800/80 border border-navy-700/50 rounded-xl p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-white">{role.name}</h3>
              {role.is_system && (
                <Badge variant="default" className="border-gold-500/50 text-gold-400">
                  System
                </Badge>
              )}
            </div>
            <p className="text-navy-300 text-sm mb-6 min-h-[40px]">
              {role.description || 'No description provided.'}
            </p>
            <div className="flex items-center justify-between border-t border-navy-700/50 pt-4">
              <span className="text-sm text-navy-400">Permissions</span>
              <Badge className="bg-navy-900 text-white">
                {role.role_permissions?.length || 0}
              </Badge>
            </div>
          </div>
        ))}
        {!roles?.length && (
          <div className="col-span-full py-12 text-center text-navy-300 bg-navy-800/30 rounded-xl border border-navy-700/30">
            No roles found.
          </div>
        )}
      </div>
    </div>
  );
}
