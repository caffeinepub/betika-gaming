import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useGetPendingWinners, useReleaseWinningsToUser } from '../hooks/useQueries';
import { toast } from 'sonner';
import { Loader2, CheckCircle, DollarSign, Calendar, User, Receipt } from 'lucide-react';
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

const TAX_RATE = 0.20; // 20% tax

export default function AdminFundsReleaseSection() {
  const { data: pendingWinners, isLoading } = useGetPendingWinners();
  const releaseMutation = useReleaseWinningsToUser();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const calculateTax = (amount: bigint): number => {
    return Math.floor(Number(amount) * TAX_RATE);
  };

  const calculateNetPayout = (amount: bigint): number => {
    return Number(amount) - calculateTax(amount);
  };

  const handleRelease = async (userPrincipal: string, username: string, amount: bigint) => {
    try {
      await releaseMutation.mutateAsync(userPrincipal);
      const netPayout = calculateNetPayout(amount);
      toast.success(`Successfully released KSh ${netPayout.toLocaleString()} (net after 20% tax) to ${username}`);
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
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-betika-green/50" />
            <p>No pending payouts at the moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingWinners.map((winner) => {
              const grossAmount = Number(winner.amount);
              const taxAmount = calculateTax(winner.amount);
              const netPayout = calculateNetPayout(winner.amount);

              return (
                <div
                  key={winner.user}
                  className="border rounded-lg p-4 hover:border-betika-green/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{winner.username}</span>
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs">Gross Winning Amount</p>
                          <p className="font-semibold text-lg">
                            KSh {grossAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs">Tax (20%)</p>
                          <p className="font-semibold text-lg text-orange-600">
                            - KSh {taxAmount.toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-muted-foreground text-xs">Net Payout</p>
                          <p className="font-bold text-lg text-betika-green">
                            KSh {netPayout.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Win Date: {winner.winDate}</span>
                      </div>
                    </div>

                    <AlertDialog
                      open={selectedUser === winner.user}
                      onOpenChange={(open) => setSelectedUser(open ? winner.user : null)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-betika-green hover:bg-betika-green-dark"
                          disabled={releaseMutation.isPending}
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
                          <AlertDialogTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-betika-green" />
                            Confirm Fund Release
                          </AlertDialogTitle>
                          <AlertDialogDescription asChild>
                            <div className="space-y-4 pt-4">
                              <p>
                                You are about to release winnings to <span className="font-semibold">{winner.username}</span>
                              </p>
                              
                              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                                <h4 className="font-semibold text-sm text-foreground">Payout Breakdown:</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground">Gross Winning Amount:</span>
                                    <span className="font-semibold text-foreground">
                                      KSh {grossAmount.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center py-2 border-b">
                                    <span className="text-muted-foreground">Tax (20%):</span>
                                    <span className="font-semibold text-orange-600">
                                      - KSh {taxAmount.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center py-3 bg-betika-green/10 rounded px-3">
                                    <span className="font-semibold text-betika-green">Net Payout Amount:</span>
                                    <span className="font-bold text-lg text-betika-green">
                                      KSh {netPayout.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground">
                                The net amount of KSh {netPayout.toLocaleString()} (after 20% tax deduction) will be released to the user's account.
                              </p>
                            </div>
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
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
