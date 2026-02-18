import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import DataTable from './DataTable';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';

export default function BettingHistorySection() {
  // Mock data for demonstration
  const bettingHistory = [
    {
      id: '1',
      gameType: 'Blackjack',
      stake: 500,
      outcome: 'Won',
      payout: 1000,
      timestamp: '2026-02-18 14:30',
    },
    {
      id: '2',
      gameType: 'Roulette',
      stake: 200,
      outcome: 'Lost',
      payout: 0,
      timestamp: '2026-02-18 13:15',
    },
    {
      id: '3',
      gameType: 'Slots',
      stake: 100,
      outcome: 'Won',
      payout: 350,
      timestamp: '2026-02-18 12:00',
    },
    {
      id: '4',
      gameType: 'Poker',
      stake: 1000,
      outcome: 'Won',
      payout: 2500,
      timestamp: '2026-02-17 18:45',
    },
    {
      id: '5',
      gameType: 'Blackjack',
      stake: 300,
      outcome: 'Lost',
      payout: 0,
      timestamp: '2026-02-17 16:20',
    },
  ];

  const columns = [
    { key: 'gameType', label: 'Game Type' },
    { key: 'stake', label: 'Stake (KSh)', format: (val: number) => val.toLocaleString() },
    {
      key: 'outcome',
      label: 'Outcome',
      format: (val: string) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            val === 'Won'
              ? 'bg-betika-green/10 text-betika-green'
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {val === 'Won' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {val}
        </span>
      ),
    },
    { key: 'payout', label: 'Payout (KSh)', format: (val: number) => val.toLocaleString() },
    { key: 'timestamp', label: 'Date & Time' },
  ];

  const totalStaked = bettingHistory.reduce((sum, bet) => sum + bet.stake, 0);
  const totalWon = bettingHistory.reduce((sum, bet) => sum + bet.payout, 0);
  const netProfit = totalWon - totalStaked;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Staked</p>
                <p className="text-2xl font-bold">KSh {totalStaked.toLocaleString()}</p>
              </div>
              <Trophy className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Won</p>
                <p className="text-2xl font-bold text-betika-green">KSh {totalWon.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-betika-green" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-betika-green' : 'text-destructive'}`}>
                  KSh {netProfit.toLocaleString()}
                </p>
              </div>
              {netProfit >= 0 ? (
                <TrendingUp className="h-8 w-8 text-betika-green" />
              ) : (
                <TrendingDown className="h-8 w-8 text-destructive" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Betting History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={bettingHistory} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
}
