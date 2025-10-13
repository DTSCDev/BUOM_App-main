import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileIdentityHeader() {
  const { profile } = useProfile();
  const { user } = useAuth();

  const displayName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ') || (user?.email ?? 'Member');

  const initials = (displayName || 'M')
    .split(' ')
    .map(s => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const buomId = profile?.membership_id || localStorage.getItem('buomMembershipNumber') || '—';

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      <div className="h-10 w-10 rounded-full bg-[#030227] text-white flex items-center justify-center text-sm font-bold">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#030227] truncate">{displayName}</span>
          <span className="text-xs bg-[#4FF456] text-gray-800 font-bold px-1.5 py-0.5 rounded">Gen²</span>
        </div>
        <div className="text-xs text-gray-600 truncate">BUOM ID: {buomId}</div>
      </div>
    </div>
  );
}