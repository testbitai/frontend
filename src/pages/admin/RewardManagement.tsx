import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Award,
  Users,
  Trophy,
  Star,
  Zap,
  Target,
  Calendar,
  Eye,
  EyeOff,
  Download,
  Upload,
  Settings,
  BarChart3,
  TrendingUp,
  Gift,
  Crown,
  Medal,
  Coins,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { RewardManagementSkeleton } from "@/components/ui/reward-skeleton";
import {
  useRewards,
  useRewardStats,
  useCreateReward,
  useUpdateReward,
  useDeleteReward,
  useAwardReward,
  useBulkUpdateRewards,
  type Reward,
  type RewardFilters,
  type CreateRewardData,
  type UpdateRewardData,
} from "@/hooks/useRewards";

const RewardManagement: React.FC = () => {
  // State for filters and UI
  const [filters, setFilters] = useState<RewardFilters>({
    page: 1,
    limit: 12,
    search: '',
    type: 'all',
    category: 'all',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    isAutoAwarded: 'all',
    isVisible: 'all',
  });

  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [awardDialog, setAwardDialog] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [selectedRewards, setSelectedRewards] = useState<string[]>([]);

  // Form states
  const [createForm, setCreateForm] = useState<CreateRewardData>({
    name: '',
    description: '',
    type: 'badge',
    category: 'performance',
    status: 'draft',
    icon: '🏆',
    color: '#3b82f6',
    coinValue: 0,
    criteria: [],
    isAutoAwarded: false,
    isVisible: true,
    sortOrder: 0,
  });

  const [editForm, setEditForm] = useState<UpdateRewardData>({});
  const [awardForm, setAwardForm] = useState({
    userIds: [] as string[],
    reason: '',
  });

  // React Query hooks
  const { data: rewardsData, isLoading, error } = useRewards(filters);
  const { data: statsData } = useRewardStats();
  const createMutation = useCreateReward();
  const updateMutation = useUpdateReward();
  const deleteMutation = useDeleteReward();
  const awardMutation = useAwardReward();
  const bulkUpdateMutation = useBulkUpdateRewards();

  // Helper functions
  const getTypeIcon = (type: string): JSX.Element => {
    const icons = {
      badge: <Medal className="h-4 w-4" />,
      coin: <Coins className="h-4 w-4" />,
      achievement: <Trophy className="h-4 w-4" />,
      streak: <Zap className="h-4 w-4" />,
      level: <Crown className="h-4 w-4" />,
    };
    return icons[type as keyof typeof icons] || <Gift className="h-4 w-4" />;
  };

  const getCategoryColor = (category: string): string => {
    const colors = {
      performance: 'bg-blue-100 text-blue-800',
      engagement: 'bg-green-100 text-green-800',
      milestone: 'bg-purple-100 text-purple-800',
      special: 'bg-orange-100 text-orange-800',
      seasonal: 'bg-pink-100 text-pink-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      draft: 'bg-yellow-100 text-yellow-800',
      archived: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string): JSX.Element => {
    const icons = {
      active: <CheckCircle className="h-3 w-3" />,
      inactive: <XCircle className="h-3 w-3" />,
      draft: <Clock className="h-3 w-3" />,
      archived: <AlertCircle className="h-3 w-3" />,
    };
    return icons[status as keyof typeof icons] || <Clock className="h-3 w-3" />;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Event handlers
  const handleFilterChange = (key: keyof RewardFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: key !== 'page' ? 1 : value, // Reset page when other filters change
    }));
  };

  const handleSelectReward = (rewardId: string, checked: boolean) => {
    setSelectedRewards(prev => 
      checked 
        ? [...prev, rewardId]
        : prev.filter(id => id !== rewardId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && rewardsData?.data?.rewards) {
      setSelectedRewards(rewardsData.data.rewards.map((r: Reward) => r._id));
    } else {
      setSelectedRewards([]);
    }
  };

  const handleCreateReward = async () => {
    try {
      await createMutation.mutateAsync(createForm);
      setCreateDialog(false);
      setCreateForm({
        name: '',
        description: '',
        type: 'badge',
        category: 'performance',
        status: 'draft',
        icon: '🏆',
        color: '#3b82f6',
        coinValue: 0,
        criteria: [],
        isAutoAwarded: false,
        isVisible: true,
        sortOrder: 0,
      });
    } catch (error) {
      console.error('Error creating reward:', error);
    }
  };

  const handleEditReward = async () => {
    if (!selectedReward) return;
    
    try {
      await updateMutation.mutateAsync({
        rewardId: selectedReward._id,
        data: editForm,
      });
      setEditDialog(false);
      setSelectedReward(null);
      setEditForm({});
    } catch (error) {
      console.error('Error updating reward:', error);
    }
  };

  const handleDeleteReward = async (rewardId: string) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      try {
        await deleteMutation.mutateAsync(rewardId);
      } catch (error) {
        console.error('Error deleting reward:', error);
      }
    }
  };

  const handleAwardReward = async () => {
    if (!selectedReward) return;
    
    try {
      await awardMutation.mutateAsync({
        rewardId: selectedReward._id,
        data: awardForm,
      });
      setAwardDialog(false);
      setSelectedReward(null);
      setAwardForm({ userIds: [], reason: '' });
    } catch (error) {
      console.error('Error awarding reward:', error);
    }
  };

  const handleBulkUpdate = async (updates: any) => {
    if (selectedRewards.length === 0) return;
    
    try {
      await bulkUpdateMutation.mutateAsync({
        rewardIds: selectedRewards,
        updates,
      });
      setSelectedRewards([]);
    } catch (error) {
      console.error('Error bulk updating rewards:', error);
    }
  };

  const openEditDialog = (reward: Reward) => {
    setSelectedReward(reward);
    setEditForm({
      name: reward.name,
      description: reward.description,
      type: reward.type,
      category: reward.category,
      status: reward.status,
      icon: reward.icon,
      image: reward.image,
      color: reward.color,
      coinValue: reward.coinValue,
      criteria: reward.criteria,
      isAutoAwarded: reward.isAutoAwarded,
      maxAwards: reward.maxAwards,
      validFrom: reward.validFrom,
      validUntil: reward.validUntil,
      isVisible: reward.isVisible,
      sortOrder: reward.sortOrder,
      metadata: reward.metadata,
    });
    setEditDialog(true);
  };

  const openAwardDialog = (reward: Reward) => {
    setSelectedReward(reward);
    setAwardDialog(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <AdminLayout>
        <RewardManagementSkeleton />
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Rewards</h2>
          <p className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : 'An unexpected error occurred'}
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const rewards = rewardsData?.data?.rewards || [];
  const pagination = rewardsData?.data?.pagination || {};
  const stats = statsData?.data || {};

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Reward Management</h1>
            <p className="text-muted-foreground">
              Create, manage, and award rewards to motivate students
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {selectedRewards.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Bulk Actions ({selectedRewards.length})
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleBulkUpdate({ status: 'active' })}>
                    Activate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkUpdate({ status: 'inactive' })}>
                    Deactivate Selected
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkUpdate({ isVisible: true })}>
                    Make Visible
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkUpdate({ isVisible: false })}>
                    Hide Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            <Dialog open={createDialog} onOpenChange={setCreateDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Reward
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Reward</DialogTitle>
                  <DialogDescription>
                    Create a new reward to motivate and recognize student achievements.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="create-name">Name *</Label>
                      <Input
                        id="create-name"
                        value={createForm.name}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter reward name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="create-icon">Icon *</Label>
                      <Input
                        id="create-icon"
                        value={createForm.icon}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, icon: e.target.value }))}
                        placeholder="🏆"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="create-description">Description *</Label>
                    <Textarea
                      id="create-description"
                      value={createForm.description}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what this reward is for..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="create-type">Type *</Label>
                      <Select value={createForm.type} onValueChange={(value: any) => setCreateForm(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="badge">Badge</SelectItem>
                          <SelectItem value="coin">Coin</SelectItem>
                          <SelectItem value="achievement">Achievement</SelectItem>
                          <SelectItem value="streak">Streak</SelectItem>
                          <SelectItem value="level">Level</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="create-category">Category *</Label>
                      <Select value={createForm.category} onValueChange={(value: any) => setCreateForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Performance</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="milestone">Milestone</SelectItem>
                          <SelectItem value="special">Special</SelectItem>
                          <SelectItem value="seasonal">Seasonal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="create-status">Status</Label>
                      <Select value={createForm.status} onValueChange={(value: any) => setCreateForm(prev => ({ ...prev, status: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="create-color">Color</Label>
                      <Input
                        id="create-color"
                        type="color"
                        value={createForm.color}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, color: e.target.value }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="create-coinValue">Coin Value</Label>
                      <Input
                        id="create-coinValue"
                        type="number"
                        min="0"
                        value={createForm.coinValue}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, coinValue: parseInt(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={createForm.isAutoAwarded}
                        onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, isAutoAwarded: checked }))}
                      />
                      <Label>Auto Award</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={createForm.isVisible}
                        onCheckedChange={(checked) => setCreateForm(prev => ({ ...prev, isVisible: checked }))}
                      />
                      <Label>Visible to Users</Label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreateReward}
                      disabled={createMutation.isPending || !createForm.name || !createForm.description}
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Reward'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rewards</p>
                  <p className="text-2xl font-bold">{stats.totalRewards || 0}</p>
                </div>
                <Gift className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Rewards</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeRewards || 0}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Awards Given</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalAwardsGiven || 0}</p>
                </div>
                <Award className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Rewarded Users</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.uniqueRewardedUsers || 0}</p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <div className="lg:col-span-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Search rewards..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="badge">Badge</SelectItem>
                    <SelectItem value="coin">Coin</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="streak">Streak</SelectItem>
                    <SelectItem value="level">Level</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Created Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="totalAwarded">Awards Given</SelectItem>
                    <SelectItem value="coinValue">Coin Value</SelectItem>
                    <SelectItem value="sortOrder">Sort Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Grid */}
        <div className="space-y-4">
          {/* Select All Checkbox */}
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedRewards.length === rewards.length && rewards.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <Label className="text-sm text-gray-600">
              Select All ({rewards.length} rewards)
            </Label>
          </div>

          {/* Rewards Grid */}
          {rewards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rewards.map((reward: Reward) => (
                <Card key={reward._id} className="relative group hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedRewards.includes(reward._id)}
                          onCheckedChange={(checked) => handleSelectReward(reward._id, checked as boolean)}
                        />
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                          style={{ backgroundColor: reward.color + '20', color: reward.color }}
                        >
                          {reward.icon}
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(reward)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openAwardDialog(reward)}>
                            <Award className="mr-2 h-4 w-4" />
                            Award to Users
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteReward(reward._id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{reward.name}</CardTitle>
                        {!reward.isVisible && <EyeOff className="h-4 w-4 text-gray-400" />}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {reward.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getStatusColor(reward.status)}>
                        {getStatusIcon(reward.status)}
                        <span className="ml-1 capitalize">{reward.status}</span>
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(reward.category)}>
                        {getTypeIcon(reward.type)}
                        <span className="ml-1 capitalize">{reward.type}</span>
                      </Badge>
                      <Badge variant="secondary" className={getCategoryColor(reward.category)}>
                        <span className="capitalize">{reward.category}</span>
                      </Badge>
                    </div>

                    {/* Reward Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Coin Value</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Coins className="h-3 w-3 text-yellow-500" />
                          {reward.coinValue}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Times Awarded</p>
                        <p className="font-semibold">{reward.awardCount || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Auto Award</p>
                        <p className="font-semibold">
                          {reward.isAutoAwarded ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Max Awards</p>
                        <p className="font-semibold">
                          {reward.maxAwards || 'Unlimited'}
                        </p>
                      </div>
                    </div>

                    {/* Criteria */}
                    {reward.criteria && reward.criteria.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Criteria:</p>
                        <div className="space-y-1">
                          {reward.criteria.slice(0, 2).map((criterion, index) => (
                            <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                              {criterion.description}
                            </div>
                          ))}
                          {reward.criteria.length > 2 && (
                            <p className="text-xs text-gray-500">
                              +{reward.criteria.length - 2} more criteria
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Validity Period */}
                    {(reward.validFrom || reward.validUntil) && (
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {reward.validFrom && `From ${formatDate(reward.validFrom)}`}
                            {reward.validFrom && reward.validUntil && ' - '}
                            {reward.validUntil && `Until ${formatDate(reward.validUntil)}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Recent Awards */}
                    {reward.recentAwards && reward.recentAwards.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Recent Awards:</p>
                        <div className="space-y-1">
                          {reward.recentAwards.slice(0, 3).map((award, index) => (
                            <div key={index} className="text-xs flex items-center gap-2">
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                {award.user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="truncate">{award.user.name}</span>
                              <span className="text-gray-500">
                                {formatDate(award.awardedAt)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="pt-2 border-t text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Created {formatDate(reward.createdAt)}</span>
                        <span>by {reward.createdBy.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Rewards Found</h3>
                <p className="text-gray-600 mb-4">
                  {filters.search || filters.type !== 'all' || filters.category !== 'all' || filters.status !== 'all'
                    ? 'No rewards match your current filters.'
                    : 'Get started by creating your first reward.'}
                </p>
                <Button onClick={() => setCreateDialog(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create First Reward
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
              {pagination.totalCount} rewards
            </p>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleFilterChange('page', page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Edit Reward Dialog */}
        <Dialog open={editDialog} onOpenChange={setEditDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Reward</DialogTitle>
              <DialogDescription>
                Update reward details and settings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Name *</Label>
                  <Input
                    id="edit-name"
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter reward name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-icon">Icon *</Label>
                  <Input
                    id="edit-icon"
                    value={editForm.icon || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="🏆"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this reward is for..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-type">Type *</Label>
                  <Select value={editForm.type} onValueChange={(value: any) => setEditForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="badge">Badge</SelectItem>
                      <SelectItem value="coin">Coin</SelectItem>
                      <SelectItem value="achievement">Achievement</SelectItem>
                      <SelectItem value="streak">Streak</SelectItem>
                      <SelectItem value="level">Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select value={editForm.category} onValueChange={(value: any) => setEditForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="milestone">Milestone</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                      <SelectItem value="seasonal">Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editForm.status} onValueChange={(value: any) => setEditForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-color">Color</Label>
                  <Input
                    id="edit-color"
                    type="color"
                    value={editForm.color || '#3b82f6'}
                    onChange={(e) => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-coinValue">Coin Value</Label>
                  <Input
                    id="edit-coinValue"
                    type="number"
                    min="0"
                    value={editForm.coinValue || 0}
                    onChange={(e) => setEditForm(prev => ({ ...prev, coinValue: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editForm.isAutoAwarded || false}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isAutoAwarded: checked }))}
                  />
                  <Label>Auto Award</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editForm.isVisible !== false}
                    onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, isVisible: checked }))}
                  />
                  <Label>Visible to Users</Label>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditReward}
                  disabled={updateMutation.isPending || !editForm.name || !editForm.description}
                >
                  {updateMutation.isPending ? 'Updating...' : 'Update Reward'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Award Reward Dialog */}
        <Dialog open={awardDialog} onOpenChange={setAwardDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Award Reward</DialogTitle>
              <DialogDescription>
                Award "{selectedReward?.name}" to selected users.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="award-users">User IDs (comma-separated)</Label>
                <Textarea
                  id="award-users"
                  value={awardForm.userIds.join(', ')}
                  onChange={(e) => setAwardForm(prev => ({ 
                    ...prev, 
                    userIds: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                  }))}
                  placeholder="Enter user IDs separated by commas..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="award-reason">Reason (optional)</Label>
                <Input
                  id="award-reason"
                  value={awardForm.reason}
                  onChange={(e) => setAwardForm(prev => ({ ...prev, reason: e.target.value }))}
                  placeholder="Reason for awarding this reward..."
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setAwardDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAwardReward}
                  disabled={awardMutation.isPending || awardForm.userIds.length === 0}
                >
                  {awardMutation.isPending ? 'Awarding...' : 'Award Reward'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default RewardManagement;
