import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import DataTable from './DataTable';
import { ArrowDownCircle, ArrowUpCircle, CheckCircle, Clock, Smartphone, Gift } from 'lucide-react';

export default function TransactionHistorySection() {
  // Mock data for demonstration - includes currency conversion info
  const transactions = [
    {
      id: '1',
      type: 'Deposit',
      originalAmount: 5000,
      originalCurrency: 'KES',
      kesAmount: 5000,
      status: 'Completed',
      paymentMethod: 'M-PESA Paybill 400004',
      timestamp: '2026-02-18 10:00',
    },
    {
      id: '2',
      type: 'Winnings Release',
      originalAmount: 15000,
      originalCurrency: 'KES',
      kesAmount: 15000,
      status: 'Completed',
      paymentMethod: 'Admin Release',
      timestamp: '2026-02-18 09:30',
    },
    {
      id: '3',
      type: 'Deposit',
      originalAmount: 100,
      originalCurrency: 'USD',
      kesAmount: 15035,
      status: 'Completed',
      paymentMethod: 'M-PESA Paybill 400004',
      timestamp: '2026-02-17 18:45',
    },
    {
      id: '4',
      type: 'Withdrawal',
      originalAmount: 2000,
      originalCurrency: 'KES',
      kesAmount: 2000,
      status: 'Completed',
      paymentMethod: 'M-PESA',
      timestamp: '2026-02-17 15:30',
    },
    {
      id: '5',
      type: 'Deposit',
      originalAmount: 50,
      originalCurrency: 'EUR',
      kesAmount: 8688,
      status: 'Completed',
      paymentMethod: 'M-PESA Paybill 400004',
      timestamp: '2026-02-16 14:20',
    },
    {
      id: '6',
      type: 'Deposit',
      originalAmount: 10000,
      originalCurrency: 'KES',
      kesAmount: 10000,
      status: 'Completed',
      paymentMethod: 'M-PESA Paybill 400004',
      timestamp: '2026-02-14 11:45',
    },
  ];

  const columns = [
    {
      key: 'type',
      label: 'Type',
      format: (val: string) => (
        <span className="inline-flex items-center gap-2">
          {val === 'Deposit' ? (
            <ArrowDownCircle className="h-4 w-4 text-betika-green" />
          ) : val === 'Winnings Release' ? (
            <Gift className="h-4 w-4 text-betika-green" />
          ) : (
            <ArrowUpCircle className="h-4 w-4 text-blue-500" />
          )}
          {val}
        </span>
      ),
    },
    {
      key: 'originalAmount',
      label: 'Original Amount',
      format: (val: number, row: any) => (
        <span className="font-medium">
          {val.toLocaleString()} {row.originalCurrency}
        </span>
      ),
    },
    {
      key: 'kesAmount',
      label: 'KES Equivalent',
      format: (val: number, row: any) => (
        <span className={row.type === 'Deposit' || row.type === 'Winnings Release' ? 'text-betika-green font-semibold' : 'text-foreground font-semibold'}>
          {row.type === 'Deposit' || row.type === 'Winnings Release' ? '+' : '-'}
          KSh {val.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      format: (val: string) => (
        <span className="inline-flex items-center gap-1.5 text-sm">
          <Smartphone className="h-3.5 w-3.5 text-betika-green" />
          {val}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      format: (val: string) => (
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            val === 'Completed'
              ? 'bg-betika-green/10 text-betika-green'
              : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
          }`}
        >
          {val === 'Completed' ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
          {val}
        </span>
      ),
    },
    { key: 'timestamp', label: 'Date & Time' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable data={transactions} columns={columns} />
      </CardContent>
    </Card>
  );
}
