import { useState } from 'react';
import { type Profile } from '../backend';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import PersonalInfoSection from './PersonalInfoSection';
import BettingHistorySection from './BettingHistorySection';
import TransactionHistorySection from './TransactionHistorySection';
import SettingsSection from './SettingsSection';
import DepositSection from './DepositSection';
import { User, History, CreditCard, Settings, Wallet } from 'lucide-react';

interface ProfileTabsProps {
  profile: Profile | null;
}

export default function ProfileTabs({ profile }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-5 mb-8">
        <TabsTrigger value="personal" className="gap-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Personal Info</span>
          <span className="sm:hidden">Info</span>
        </TabsTrigger>
        <TabsTrigger value="deposit" className="gap-2">
          <Wallet className="h-4 w-4" />
          <span className="hidden sm:inline">Deposit</span>
          <span className="sm:hidden">Add</span>
        </TabsTrigger>
        <TabsTrigger value="betting" className="gap-2">
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">Betting History</span>
          <span className="sm:hidden">Bets</span>
        </TabsTrigger>
        <TabsTrigger value="transactions" className="gap-2">
          <CreditCard className="h-4 w-4" />
          <span className="hidden sm:inline">Transactions</span>
          <span className="sm:hidden">Txns</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="gap-2">
          <Settings className="h-4 w-4" />
          Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal">
        <PersonalInfoSection profile={profile} />
      </TabsContent>

      <TabsContent value="deposit">
        <DepositSection />
      </TabsContent>

      <TabsContent value="betting">
        <BettingHistorySection />
      </TabsContent>

      <TabsContent value="transactions">
        <TransactionHistorySection />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsSection profile={profile} />
      </TabsContent>
    </Tabs>
  );
}
