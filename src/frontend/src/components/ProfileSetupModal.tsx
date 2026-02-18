import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, Smartphone, Globe } from 'lucide-react';
import { validateAfricanPhoneNumber, detectCountry, detectCarrier, formatPhoneNumber, normalizePhoneNumber } from '../utils/phoneValidation';

interface ProfileSetupModalProps {
  onPhoneVerificationRequired: (phoneNumber: string) => void;
}

export default function ProfileSetupModal({ onPhoneVerificationRequired }: ProfileSetupModalProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    walletAddress: '',
    phoneNumber: '',
  });
  const [phoneError, setPhoneError] = useState('');

  const saveProfileMutation = useSaveCallerUserProfile();

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: value }));
    
    // Real-time validation
    if (value.trim() === '') {
      setPhoneError('');
      return;
    }
    
    if (!validateAfricanPhoneNumber(value)) {
      setPhoneError('Invalid phone number format. Please enter a valid African phone number.');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error('Username is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error('Phone number is required');
      return;
    }

    if (!validateAfricanPhoneNumber(formData.phoneNumber)) {
      toast.error('Please enter a valid African phone number');
      return;
    }

    try {
      // Save profile first (without phone verification)
      await saveProfileMutation.mutateAsync({
        username: formData.username,
        email: formData.email,
        walletAddress: formData.walletAddress,
      });
      
      // Trigger phone verification flow
      const normalizedPhone = normalizePhoneNumber(formData.phoneNumber);
      onPhoneVerificationRequired(normalizedPhone);
      
      toast.success('Profile created! Please verify your phone number.');
    } catch (error) {
      toast.error('Failed to create profile. Please try again.');
      console.error('Profile creation error:', error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const detectedCountry = formData.phoneNumber ? detectCountry(formData.phoneNumber) : null;
  const carrier = formData.phoneNumber && detectedCountry === 'Kenya' ? detectCarrier(formData.phoneNumber) : null;

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to Betika Casino!</DialogTitle>
          <DialogDescription>
            Let's set up your profile to get started. Please provide your information below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="setup-username">Username *</Label>
            <Input
              id="setup-username"
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="setup-email">Email *</Label>
            <Input
              id="setup-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="setup-phone">Phone Number *</Label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="setup-phone"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="+254 7XX XXX XXX or local format"
                className={`pl-10 ${phoneError ? 'border-destructive' : ''}`}
                required
              />
            </div>
            {phoneError && (
              <p className="text-sm text-destructive">{phoneError}</p>
            )}
            {detectedCountry && !phoneError && (
              <p className="text-sm text-betika-green flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                <span className="font-medium">{detectedCountry}</span> number detected
                {carrier && carrier !== 'Unknown' && ` (${carrier})`}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Supports phone numbers from all African countries
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="setup-wallet">Wallet Address (Optional)</Label>
            <Input
              id="setup-wallet"
              type="text"
              value={formData.walletAddress}
              onChange={(e) => handleChange('walletAddress', e.target.value)}
              placeholder="Enter your wallet address"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-betika-green hover:bg-betika-green-dark"
            disabled={saveProfileMutation.isPending || !!phoneError}
          >
            {saveProfileMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Profile...
              </>
            ) : (
              'Create Profile & Verify Phone'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
