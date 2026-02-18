import { type Profile } from '../backend';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import BalanceCard from './BalanceCard';
import { LogOut, Shield } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useIsCallerAdmin } from '../hooks/useQueries';

interface ProfileHeaderProps {
  profile: Profile | null;
  onLogout: () => void;
}

export default function ProfileHeader({ profile, onLogout }: ProfileHeaderProps) {
  const navigate = useNavigate();
  const { data: isAdmin } = useIsCallerAdmin();

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative">
      {/* Banner Background */}
      <div
        className="h-48 md:h-64 bg-cover bg-center relative"
        style={{
          backgroundImage: 'url(/assets/generated/profile-header.dim_1200x300.png)',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60"></div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-20 md:-mt-24">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-6">
            {/* Avatar */}
            <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
              <AvatarImage src="/assets/generated/profile-avatar.dim_200x200.png" alt={profile?.username} />
              <AvatarFallback className="bg-betika-green text-white text-3xl font-bold">
                {profile ? getInitials(profile.username) : 'U'}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {profile?.username || 'User'}
              </h1>
              <p className="text-muted-foreground">{profile?.email || 'No email provided'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isAdmin && (
                <Button
                  onClick={() => navigate({ to: '/admin' })}
                  variant="outline"
                  className="gap-2 border-betika-green text-betika-green hover:bg-betika-green hover:text-white"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Button>
              )}
              <Button onClick={onLogout} variant="outline" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          {/* Balance Card */}
          <BalanceCard balance={profile?.balance || BigInt(0)} />
        </div>
      </div>
    </div>
  );
}
