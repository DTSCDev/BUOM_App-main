import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

export default function ProfileIdentityHeader() {
  const { profile } = useProfile();
  const { user } = useAuth();

  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(' ') || (user?.email ?? 'Member');

  const greeting = `Hi ${profile?.first_name || 'Member'}`;

  const initials = (fullName || 'M')
    .split(' ')
    .map((s: string) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Determine generation from date_of_birth or fallback age 42
  const nowYear = new Date().getFullYear();
  const birthYear = profile?.date_of_birth ? new Date(profile.date_of_birth).getFullYear() : undefined;
  const approxAge = birthYear ? (nowYear - birthYear) : 42;

  type GenInfo = { label: 'GEN A' | 'GEN Z' | 'GEN Y' | 'GEN X' | 'BOOMER'; color: string };
  const getGenInfo = (by?: number): GenInfo => {
    const y = by ? by : (nowYear - approxAge);
    if (y >= 2013) return { label: 'GEN A', color: '#A855F7' }; // vibrant purple
    if (y >= 1997) return { label: 'GEN Z', color: '#22C55E' }; // vibrant green
    if (y >= 1981) return { label: 'GEN Y', color: '#3B82F6' }; // vibrant blue
    if (y >= 1965) return { label: 'GEN X', color: '#F59E0B' }; // vibrant amber
    if (y >= 1946) return { label: 'BOOMER', color: '#FF6B6B' }; // vibrant coral
    return { label: 'GEN Y', color: '#3B82F6' }; // sensible default
  };

  const gen = getGenInfo(birthYear);

  return (
    <div
      className="flex items-center gap-2 px-0 py-1 border rounded-md"
      style={{ borderColor: gen.color }}
    >
      {/* Polygon avatar with generation-colored border */}
      <div
        className="h-10 w-10 bg-[#030227] text-white flex items-center justify-center text-sm font-bold"
        style={{
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          border: `2px solid ${gen.color}`,
        }}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          <span className="font-semibold text-[#030227] truncate">{greeting}</span>
        </div>
        <div className="mt-0.5">
          {/* Horizontal Generation Badge placed under greeting */}
          <span
            aria-label="Generation badge"
            className="text-xs font-bold px-2 py-0.5 rounded-full border bg-transparent"
            style={{ borderColor: gen.color, color: gen.color }}
          >
            {gen.label}
          </span>
        </div>
      </div>
    </div>
  );
}