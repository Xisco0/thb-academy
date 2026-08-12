import { getAllAdminUsers } from '@/lib/queries/admin';
import { AdminTopBar } from '@/components/admin/top-bar';
import { Badge } from '@/components/ui/badge';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Users | Admin'
};

export default async function AdminsPage() {
  const admins = await getAllAdminUsers() as Record<string, any>[];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <AdminTopBar title="Admin Users" />
      <div className="bg-navy-800/50 border border-navy-700/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-navy-900/50 text-navy-200">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-700/30 text-white">
              {admins?.map((admin) => (
                <tr key={admin.id} className="hover:bg-navy-800/80 transition-colors">
                  <td className="px-6 py-4">
                    {admin.profile?.first_name} {admin.profile?.last_name}
                  </td>
                  <td className="px-6 py-4 text-navy-300">{admin.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-gold-400">
                      {admin.user_roles?.[0]?.role?.name || 'No Role'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="default" className={admin.is_active ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"}>
                      {admin.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                </tr>
              ))}
              {!admins?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-navy-300">
                    No admin users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
