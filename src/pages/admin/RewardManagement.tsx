
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, Coins, Star, Edit } from "lucide-react";

const RewardManagement = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reward Management</h1>
          <p className="text-muted-foreground">Configure coins, badges, and streak rewards</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span>Coin Settings</span>
              </CardTitle>
              <CardDescription>Configure how students earn coins</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Coins per test completion</Label>
                <Input type="number" defaultValue="10" />
              </div>
              <div className="space-y-2">
                <Label>Bonus coins for {'>'}80% score</Label>
                <Input type="number" defaultValue="50" />
              </div>
              <div className="space-y-2">
                <Label>Daily streak bonus</Label>
                <Input type="number" defaultValue="20" />
              </div>
              <Button className="w-full">Save Coin Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-orange-500" />
                <span>Badge Management</span>
              </CardTitle>
              <CardDescription>Create and manage achievement badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Star className="h-6 w-6 text-yellow-500" />
                    <div>
                      <div className="font-medium">First Test</div>
                      <div className="text-sm text-gray-500">Complete first test</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Trophy className="h-6 w-6 text-orange-500" />
                    <div>
                      <div className="font-medium">High Achiever</div>
                      <div className="text-sm text-gray-500">Score {'>'}90% on any test</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="w-full">Create New Badge</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RewardManagement;
