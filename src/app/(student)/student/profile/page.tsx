import { getUser } from '@/lib/auth/session';
import { getStudentProfile } from '@/lib/queries/student';
import { User, Mail, Phone, MapPin, Calendar, HeartPulse, Music } from 'lucide-react';

export const metadata = {
  title: 'My Profile | Student Portal'
};

export default async function ProfilePage() {
  const user = await getUser();
  const profile = await getStudentProfile(user?.id || '');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
          <p className="text-slate-400 mt-1">Manage your personal information.</p>
        </div>
        <button className="px-4 py-2 bg-navy-800 hover:bg-navy-700 text-white rounded-lg transition-colors border border-navy-700/50 text-sm font-medium">
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-navy-800/80 rounded-xl p-6 border border-navy-700/50 text-center">
            <div className="w-24 h-24 rounded-full bg-brand-500/20 border-2 border-brand-500/50 flex items-center justify-center text-brand-400 font-semibold text-3xl mx-auto mb-4">
              {profile?.first_name?.charAt(0) || 'S'}
            </div>
            <h2 className="text-xl font-bold text-white">
              {profile?.first_name} {profile?.last_name}
            </h2>
            <p className="text-brand-400 text-sm mt-1">Student</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-navy-800/80 rounded-xl border border-navy-700/50 overflow-hidden">
            <div className="p-5 border-b border-navy-700/50">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-brand-400" />
                Personal Information
              </h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <span className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                  <Mail className="w-4 h-4" /> Email
                </span>
                <span className="text-white">{user?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                  <Phone className="w-4 h-4" /> Phone
                </span>
                <span className="text-white">{profile?.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> Date of Birth
                </span>
                <span className="text-white">{profile?.date_of_birth || 'N/A'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> Address
                </span>
                <span className="text-white">{profile?.address || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-navy-800/80 rounded-xl border border-navy-700/50 overflow-hidden">
            <div className="p-5 border-b border-navy-700/50">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Music className="w-5 h-5 text-brand-400" />
                Musical Profile
              </h3>
            </div>
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <span className="block text-sm text-slate-400 mb-1">Experience Level</span>
                  <span className="text-white capitalize">{profile?.experience_level || 'Beginner'}</span>
                </div>
                <div>
                  <span className="block text-sm text-slate-400 mb-1">Primary Instrument Interest</span>
                  <span className="text-white">{profile?.primary_interest || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-navy-800/80 rounded-xl border border-navy-700/50 overflow-hidden">
            <div className="p-5 border-b border-navy-700/50">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-danger-400" />
                Emergency Contact
              </h3>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <span className="block text-sm text-slate-400 mb-1">Name</span>
                <span className="text-white">{profile?.emergency_contact_name || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-sm text-slate-400 mb-1">Phone</span>
                <span className="text-white">{profile?.emergency_contact_phone || 'N/A'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="block text-sm text-slate-400 mb-1">Relationship</span>
                <span className="text-white">{profile?.emergency_contact_relationship || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
