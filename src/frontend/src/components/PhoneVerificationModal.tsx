import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { useVerifyPhoneCode, useResendVerificationCode } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, CheckCircle, Smartphone } from 'lucide-react';
import { formatPhoneNumber } from '../utils/phoneValidation';

interface PhoneVerificationModalProps {
  phoneNumber: string;
  onVerificationComplete: () => void;
}

export default function PhoneVerificationModal({ phoneNumber, onVerificationComplete }: PhoneVerificationModalProps) {
  const [code, setCode] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const verifyMutation = useVerifyPhoneCode();
  const resendMutation = useResendVerificationCode();

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendCountdown]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    try {
      await verifyMutation.mutateAsync({ phoneNumber, code });
      toast.success('Phone number verified successfully!');
      onVerificationComplete();
    } catch (error: any) {
      toast.error(error.message || 'Verification failed. Please check the code and try again.');
      setCode('');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await resendMutation.mutateAsync(phoneNumber);
      toast.success('Verification code resent!');
      setResendCountdown(60);
      setCanResend(false);
      setCode('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code. Please try again.');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-betika-green" />
            Verify Your Phone Number
          </DialogTitle>
          <DialogDescription>
            We've sent a 6-digit verification code to{' '}
            <span className="font-medium text-foreground">{formatPhoneNumber(phoneNumber)}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={code}
                onChange={(value) => setCode(value)}
                disabled={verifyMutation.isPending}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Enter the 6-digit code sent via SMS
            </p>
          </div>

          <Button
            onClick={handleVerify}
            className="w-full bg-betika-green hover:bg-betika-green-dark"
            disabled={code.length !== 6 || verifyMutation.isPending}
          >
            {verifyMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify Phone Number
              </>
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Didn't receive the code?</p>
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={!canResend || resendMutation.isPending}
              className="text-betika-green hover:text-betika-green-dark"
            >
              {resendMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resending...
                </>
              ) : canResend ? (
                'Resend Code'
              ) : (
                `Resend in ${resendCountdown}s`
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
