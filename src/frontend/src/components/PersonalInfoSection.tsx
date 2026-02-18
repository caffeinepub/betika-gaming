import { type Profile } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Mail, Wallet, Calendar, User } from 'lucide-react';

interface PersonalInfoSectionProps {
  profile: Profile | null;
}

export default function PersonalInfoSection({ profile }: PersonalInfoSectionProps) {
  if (!profile) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          No profile information available
        </CardContent>
      </Card>
    );
  }

  const infoItems = [
    {
      icon: User,
      label: 'Username',
      value: profile.username,
    },
    {
      icon: Mail,
      label: 'Email',
      value: profile.email,
    },
    {
      icon: Wallet,
      label: 'Wallet Address',
      value: profile.walletAddress || 'Not provided',
    },
    {
      icon: Calendar,
      label: 'Member Since',
      value: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
            <div className="bg-betika-green/10 p-3 rounded-full">
              <item.icon className="h-5 w-5 text-betika-green" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
              <p className="text-base font-medium text-foreground">{item.value}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
