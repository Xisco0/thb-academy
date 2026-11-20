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
          <h1 className="text-3xl font-heading font-bold text-[#142544] tracking-tight">My Profile</h1>
          <p className="text-[#647084] mt-1 text-sm">Manage your personal information and student preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E7E5DF] text-center shadow-sm">
            <div className="w-24 h-24 rounded-full bg-[#F5F0E6] border-2 border-[#C58A19]/30 flex items-center justify-center text-[#C58A19] font-bold text-3xl mx-auto mb-4 font-heading">
              {profile?.first_name?.charAt(0) || 'S'}
            </div>
            <h2 className="text-xl font-bold text-[#142544] font-heading">
              {profile?.first_name} {profile?.last_name}
            </h2>
            <p className="text-[#C58A19] text-sm font-medium mt-1">Academy Student</p>
            <div className="mt-4 pt-4 border-t border-[#E7E5DF] text-xs text-[#647084]">
              Status: <span className="text-[#23845B] font-semibold">Active Enrollment</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#E7E5DF] bg-[#F8F7F4]/60">
              <h3 className="font-bold text-[#142544] flex items-center gap-2 font-heading">
                <User className="w-5 h-5 text-[#C58A19]" />
                Personal Information
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647084] mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#C58A19]" /> Email Address
                </span>
                <span className="text-[#142544] font-medium text-sm">{user?.email || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647084] mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#C58A19]" /> Phone Number
                </span>
                <span className="text-[#142544] font-medium text-sm">{profile?.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647084] mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C58A19]" /> Date of Birth
                </span>
                <span className="text-[#142544] font-medium text-sm">{profile?.date_of_birth || 'N/A'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647084] mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C58A19]" /> Residential Address
                </span>
                <span className="text-[#142544] font-medium text-sm">{profile?.address || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#E7E5DF] bg-[#F8F7F4]/60">
              <h3 className="font-bold text-[#142544] flex items-center gap-2 font-heading">
                <Music className="w-5 h-5 text-[#C58A19]" />
                Musical Profile
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#647084] mb-1 block">Experience Level</span>
                  <span className="text-[#142544] font-medium capitalize text-sm">{profile?.experience_level || 'Beginner'}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#647084] mb-1 block">Primary Instrument Track</span>
                  <span className="text-[#142544] font-medium text-sm">{profile?.primary_interest || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E7E5DF] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#E7E5DF] bg-[#F8F7F4]/60">
              <h3 className="font-bold text-[#142544] flex items-center gap-2 font-heading">
                <HeartPulse className="w-5 h-5 text-[#DC2626]" />
                Emergency Contact
              </h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647084] mb-1 block">Contact Name</span>
                <span className="text-[#142544] font-medium text-sm">{profile?.emergency_contact_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647084] mb-1 block">Contact Phone</span>
                <span className="text-[#142544] font-medium text-sm">{profile?.emergency_contact_phone || 'N/A'}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#647084] mb-1 block">Relationship</span>
                <span className="text-[#142544] font-medium text-sm">{profile?.emergency_contact_relationship || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
