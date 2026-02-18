import { Card, CardContent } from './ui/card';
import { Users } from 'lucide-react';
import { useGetTotalMemberCount } from '../hooks/useQueries';
import { Skeleton } from './ui/skeleton';

export default function MemberCountCard() {
  const { data: memberCount, isLoading, isError } = useGetTotalMemberCount();

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-betika-green to-betika-green-dark border-betika-green shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-white/20" />
              <Skeleton className="h-10 w-24 bg-white/30" />
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return null;
  }

  const formattedCount = memberCount ? Number(memberCount).toLocaleString() : '0';

  return (
    <Card className="bg-gradient-to-br from-betika-green to-betika-green-dark border-betika-green shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Total Members</p>
            <p className="text-white text-4xl font-bold">{formattedCount}</p>
            <p className="text-white/70 text-xs mt-1">Registered users</p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <Users className="h-8 w-8 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
