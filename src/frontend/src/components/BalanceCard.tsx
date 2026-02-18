import { Card, CardContent } from './ui/card';
import { Wallet } from 'lucide-react';

interface BalanceCardProps {
  balance: bigint;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  const formatBalance = (bal: bigint) => {
    return Number(bal).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-betika-green to-betika-green-dark border-betika-green shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Account Balance</p>
            <p className="text-white text-4xl md:text-5xl font-bold">KSh {formatBalance(balance)}</p>
          </div>
          <div className="bg-white/20 p-4 rounded-full">
            <Wallet className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
