import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useInitiateDeposit } from '../hooks/useQueries';
import { Copy, CheckCircle, Wallet, ArrowRight, Info, Smartphone, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { Currency } from '../backend';

const MPESA_PAYBILL = '400004';
const ACCOUNT_NUMBER = '0116828013';

// Currency display names and symbols
const currencyInfo: Record<Currency, { name: string; symbol: string }> = {
  [Currency.KES]: { name: 'Kenyan Shilling', symbol: 'KSh' },
  [Currency.USD]: { name: 'US Dollar', symbol: '$' },
  [Currency.EUR]: { name: 'Euro', symbol: '€' },
  [Currency.GBP]: { name: 'British Pound', symbol: '£' },
  [Currency.UGX]: { name: 'Ugandan Shilling', symbol: 'USh' },
  [Currency.TZS]: { name: 'Tanzanian Shilling', symbol: 'TSh' },
  [Currency.MWK]: { name: 'Malawian Kwacha', symbol: 'MK' },
  [Currency.ZAR]: { name: 'South African Rand', symbol: 'R' },
  [Currency.ZMW]: { name: 'Zambian Kwacha', symbol: 'ZK' },
};

// Exchange rates (per 100 units of foreign currency to KES)
const exchangeRates: Record<Currency, number> = {
  [Currency.KES]: 100,
  [Currency.USD]: 15035,
  [Currency.EUR]: 17375,
  [Currency.GBP]: 19800,
  [Currency.UGX]: 4,
  [Currency.TZS]: 5,
  [Currency.MWK]: 13,
  [Currency.ZAR]: 793,
  [Currency.ZMW]: 5885,
};

export default function DepositSection() {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<Currency>(Currency.KES);
  const [transactionId, setTransactionId] = useState<bigint | null>(null);
  const [depositDetails, setDepositDetails] = useState<{
    originalAmount: number;
    currency: Currency;
    kesAmount: number;
    rate: number;
  } | null>(null);
  
  const initiateDeposit = useInitiateDeposit();

  const handleCopyPaybill = () => {
    navigator.clipboard.writeText(MPESA_PAYBILL);
    toast.success('Paybill number copied to clipboard!');
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(ACCOUNT_NUMBER);
    toast.success('Account number copied to clipboard!');
  };

  const calculateKESAmount = (amount: number, currency: Currency): number => {
    const rate = exchangeRates[currency];
    return Math.floor((amount * rate) / 100);
  };

  const handleInitiateDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const txId = await initiateDeposit.mutateAsync({
        currency,
        amount: BigInt(Math.floor(amountNum)),
      });
      
      const kesAmount = calculateKESAmount(amountNum, currency);
      const rate = exchangeRates[currency] / 100;
      
      setTransactionId(txId);
      setDepositDetails({
        originalAmount: amountNum,
        currency,
        kesAmount,
        rate,
      });
      
      toast.success('Deposit initiated! Please complete the M-PESA payment.');
    } catch (error) {
      toast.error('Failed to initiate deposit. Please try again.');
      console.error(error);
    }
  };

  const handleNewDeposit = () => {
    setTransactionId(null);
    setAmount('');
    setCurrency(Currency.KES);
    setDepositDetails(null);
  };

  if (transactionId !== null && depositDetails) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-betika-green to-betika-green-dark border-betika-green shadow-lg">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="bg-white/20 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold mb-2">Deposit Initiated</h3>
                <p className="text-white/90 text-sm">Transaction ID: {transactionId.toString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency Conversion Summary */}
        {depositDetails.currency !== Currency.KES && (
          <Card className="border-2 border-betika-green/30 bg-betika-green/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Banknote className="h-5 w-5 text-betika-green" />
                Currency Conversion Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Original Amount:</span>
                <span className="font-semibold text-lg">
                  {currencyInfo[depositDetails.currency].symbol} {depositDetails.originalAmount.toLocaleString()} {depositDetails.currency}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Exchange Rate:</span>
                <span className="font-medium">
                  1 {depositDetails.currency} = {depositDetails.rate.toFixed(2)} KES
                </span>
              </div>
              <div className="flex justify-between items-center py-3 bg-betika-green/10 rounded-lg px-3">
                <span className="font-semibold text-betika-green">Amount to be Credited:</span>
                <span className="font-bold text-xl text-betika-green">
                  KSh {depositDetails.kesAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center pt-2">
                Your deposit of {currencyInfo[depositDetails.currency].symbol}{depositDetails.originalAmount.toLocaleString()} {depositDetails.currency} will be converted to KSh {depositDetails.kesAmount.toLocaleString()} at the rate of {depositDetails.rate.toFixed(2)}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-betika-green" />
              M-PESA Payment Instructions
            </CardTitle>
            <CardDescription>Complete your deposit using M-PESA paybill</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* Prominent PayBill Display */}
              <div className="bg-gradient-to-br from-betika-green to-betika-green-dark p-6 rounded-xl text-center space-y-3 shadow-lg border-2 border-betika-green">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Smartphone className="h-6 w-6 text-white" />
                  <p className="text-white font-semibold text-lg">M-PESA PayBill Number</p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-white text-5xl font-bold tracking-wider">{MPESA_PAYBILL}</p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyPaybill}
                  className="bg-white/90 hover:bg-white text-betika-green font-semibold"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy PayBill Number
                </Button>
                <p className="text-white/90 text-sm">Use this PayBill to deposit funds</p>
              </div>

              <div className="bg-muted/50 border-2 border-betika-green/30 p-5 rounded-lg space-y-4">
                <h4 className="font-semibold text-betika-green text-lg mb-3">Step-by-Step Instructions:</h4>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-betika-green text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Go to M-PESA Menu</p>
                      <p className="text-sm text-muted-foreground">On your phone, dial *334# or open M-PESA app</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-betika-green text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Select Lipa na M-PESA</p>
                      <p className="text-sm text-muted-foreground">Choose "Pay Bill" option</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-betika-green text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">Enter Business Number</p>
                      <div className="bg-white dark:bg-gray-900 p-3 rounded flex items-center justify-between">
                        <span className="text-2xl font-bold text-betika-green">{MPESA_PAYBILL}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyPaybill}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-betika-green text-white flex items-center justify-center font-bold text-sm">
                      4
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-2">Enter Account Number</p>
                      <div className="bg-white dark:bg-gray-900 p-3 rounded flex items-center justify-between">
                        <span className="text-xl font-bold">{ACCOUNT_NUMBER}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyAccount}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-betika-green text-white flex items-center justify-center font-bold text-sm">
                      5
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Enter Amount</p>
                      <p className="text-sm text-muted-foreground">
                        Enter <span className="font-semibold text-betika-green">KSh {depositDetails.kesAmount.toLocaleString()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-betika-green text-white flex items-center justify-center font-bold text-sm">
                      6
                    </div>
                    <div className="flex-1">
                      <p className="font-medium mb-1">Enter M-PESA PIN</p>
                      <p className="text-sm text-muted-foreground">Confirm the transaction with your PIN</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <Info className="inline h-4 w-4 mr-1" />
                    You will receive an M-PESA confirmation message. Your account will be credited within 5 minutes.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleNewDeposit}
              variant="outline"
              className="w-full"
            >
              Make Another Deposit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-betika-green" />
          Deposit Funds
        </CardTitle>
        <CardDescription>Add money to your Betika Casino account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleInitiateDeposit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="currency">Select Currency</Label>
            <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
              <SelectTrigger id="currency" className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(currencyInfo).map(([code, info]) => (
                  <SelectItem key={code} value={code}>
                    {info.symbol} {info.name} ({code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              All deposits are converted to Kenyan Shillings (KES)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ({currencyInfo[currency].symbol})</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Enter amount in ${currency}`}
              required
            />
            {amount && parseFloat(amount) > 0 && currency !== Currency.KES && (
              <p className="text-sm text-betika-green font-medium">
                ≈ KSh {calculateKESAmount(parseFloat(amount), currency).toLocaleString()} will be credited to your account
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-betika-green hover:bg-betika-green-dark"
            disabled={initiateDeposit.isPending}
          >
            {initiateDeposit.isPending ? (
              <>
                <Wallet className="mr-2 h-4 w-4 animate-pulse" />
                Initiating Deposit...
              </>
            ) : (
              <>
                Continue to Payment
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4 text-betika-green" />
            Payment Information
          </h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between py-2 border-b">
              <span>M-PESA PayBill:</span>
              <span className="font-bold text-betika-green text-lg">{MPESA_PAYBILL}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Account Number:</span>
              <span className="font-semibold text-foreground">{ACCOUNT_NUMBER}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
