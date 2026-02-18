import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import AccessDeniedScreen from '../components/AccessDeniedScreen';
import ProfileSetupModal from '../components/ProfileSetupModal';
import PhoneVerificationModal from '../components/PhoneVerificationModal';
import ProfileHeader from '../components/ProfileHeader';
import ProfileTabs from '../components/ProfileTabs';
import MemberCountCard from '../components/MemberCountCard';
import { useQueryClient } from '@tanstack/react-query';

export default function ProfilePage() {
  const { identity, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const [phoneVerificationRequired, setPhoneVerificationRequired] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const handlePhoneVerificationComplete = () => {
    setPhoneVerificationRequired(null);
    queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
  };

  // Show access denied for unauthenticated users
  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  // Show phone verification modal if required
  if (phoneVerificationRequired) {
    return (
      <PhoneVerificationModal
        phoneNumber={phoneVerificationRequired}
        onVerificationComplete={handlePhoneVerificationComplete}
      />
    );
  }

  // Show profile setup modal for authenticated users without a profile
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <ProfileSetupModal
        onPhoneVerificationRequired={(phoneNumber) => setPhoneVerificationRequired(phoneNumber)}
      />
    );
  }

  // Show loading state
  if (profileLoading || !isFetched) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-betika-green mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  // At this point, userProfile is either Profile or null (not undefined)
  const profile = userProfile ?? null;

  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader profile={profile} onLogout={handleLogout} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <MemberCountCard />
        </div>
        <ProfileTabs profile={profile} />
      </div>
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Betika Casino. Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-betika-green hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
