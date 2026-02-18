import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useGetPendingWinners, useReleaseWinningsToUser } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, CheckCircle, DollarSign, Calendar, User } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { useState } from 'react';

export default function AdminFundsReleaseSection() {
  const { data: pendingWinners, isLoading } = useGetPendingWinners();
  const releaseMutation = useReleaseWinningsToUser();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleRelease = async (userPrincipal: string, username: string, amount: bigint) => {
    try {
      await releaseMutation.mutateAsync(userPrincipal);
      toast.success(`Successfully released KSh ${Number(amount).toLocaleString()} to ${username}`);
      setSelectedUser(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to release winnings. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pending Payouts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-betika-green" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-betika-green" />
          Pending Payouts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!pendingWinners || pendingWinners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-betika-green" />
            <p>No pending payouts at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingWinners.map((winner) => (
              <div
                key={winner.user}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{winner.username}</span>
                    <Badge variant="outline" className="text-xs">Pending</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span className="font-semibold text-betika-green">
                        KSh {Number(winner.amount).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{winner.winDate}</span>
                    </div>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="bg-betika-green hover:bg-betika-green-dark"
                      disabled={releaseMutation.isPending}
                      onClick={() => setSelectedUser(winner.user)}
                    >
                      {releaseMutation.isPending && selectedUser === winner.user ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Releasing...
                        </>
                      ) : (
                        'Release Funds'
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Fund Release</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to release{' '}
                        <span className="font-semibold text-betika-green">
                          KSh {Number(winner.amount).toLocaleString()}
                        </span>{' '}
                        to <span className="font-semibold">{winner.username}</span>?
                        <br />
                        <br />
                        This action will transfer the funds from account 0116828013 to the user's balance.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleRelease(winner.user, winner.username, winner.amount)}
                        className="bg-betika-green hover:bg-betika-green-dark"
                      >
                        Confirm Release
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
