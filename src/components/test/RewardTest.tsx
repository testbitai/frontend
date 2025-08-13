import React from 'react';
import { useRewards, useRewardStats } from '@/hooks/useRewards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RewardManagementSkeleton } from '@/components/ui/reward-skeleton';
import { AlertCircle, Gift } from 'lucide-react';

const RewardTest: React.FC = () => {
  const { data: rewardsData, isLoading: rewardsLoading, error: rewardsError } = useRewards();
  const { data: statsData, isLoading: statsLoading, error: statsError } = useRewardStats();

  if (rewardsLoading || statsLoading) {
    return <RewardManagementSkeleton />;
  }

  if (rewardsError || statsError) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">API Connection Test</h3>
          <p className="text-gray-600 mb-4">
            {rewardsError?.message || statsError?.message || 'Failed to connect to reward API'}
          </p>
          <div className="text-sm text-gray-500">
            <p>Rewards Error: {rewardsError ? 'Yes' : 'No'}</p>
            <p>Stats Error: {statsError ? 'Yes' : 'No'}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const rewards = rewardsData?.data?.rewards || [];
  const stats = statsData?.data || {};

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Reward System Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">API Connection Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Rewards API:</span>
                  <span className="text-green-600 font-medium">✓ Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Stats API:</span>
                  <span className="text-green-600 font-medium">✓ Connected</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Rewards:</span>
                  <span className="font-medium">{rewards.length}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Rewards:</span>
                  <span className="font-medium">{stats.totalRewards || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Rewards:</span>
                  <span className="font-medium">{stats.activeRewards || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Awards Given:</span>
                  <span className="font-medium">{stats.totalAwardsGiven || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rewarded Users:</span>
                  <span className="font-medium">{stats.uniqueRewardedUsers || 0}</span>
                </div>
              </div>
            </div>
          </div>
          
          {rewards.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Sample Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.slice(0, 4).map((reward: any) => (
                  <div key={reward._id} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{reward.icon}</span>
                      <span className="font-medium">{reward.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Type: {reward.type}</span>
                      <span>Status: {reward.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-green-800 font-medium">
              ✅ Reward Management System is working correctly!
            </p>
            <p className="text-green-700 text-sm mt-1">
              All API endpoints are responding and the frontend is properly connected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardTest;
