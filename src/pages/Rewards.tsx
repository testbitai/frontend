
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { toast } from '@/components/ui/sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Star, Award, Download, Flame, Calendar, Check, Shield, Book, Clock, FileText } from 'lucide-react';

// Mock data for rewards
const rewardItems = [
  {
    id: 1,
    title: 'Advanced Physics Bundle',
    type: 'test',
    price: 150,
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'A comprehensive set of 5 advanced physics tests covering mechanics, electromagnetism and more.',
    popular: true
  },
  {
    id: 2,
    title: 'Chemistry Formula Sheet',
    type: 'pdf',
    price: 50,
    image: 'https://images.unsplash.com/photo-1606326608690-4e0281b1e588?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Complete chemistry formula sheet with all important reactions and equations for quick revision.',
    popular: false
  },
  {
    id: 3,
    title: 'Math Master Badge',
    type: 'accessory',
    price: 75,
    image: 'https://images.unsplash.com/photo-1604872423159-61ef082dab75?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Show off your math skills with this exclusive badge for your profile.',
    popular: false
  },
  {
    id: 4,
    title: 'BITSAT Mock Test Series',
    type: 'test',
    price: 200,
    image: 'https://images.unsplash.com/photo-1568650108567-f040f546ce15?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Set of 3 full-length BITSAT mock tests with detailed solutions and analysis.',
    popular: true
  },
  {
    id: 5,
    title: 'Physics Hero Cape',
    type: 'accessory',
    price: 100,
    image: 'https://images.unsplash.com/photo-1665979738279-bd2441290e02?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Customize your avatar with this special physics-themed cape.',
    popular: false
  },
  {
    id: 6,
    title: 'Organic Chemistry Mind Maps',
    type: 'pdf',
    price: 75,
    image: 'https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=2093&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Visual mind maps for all organic chemistry concepts and reactions.',
    popular: true
  }
];

// Mock data for badges
const badgeData = [
  {
    id: 1,
    name: 'First Test',
    description: 'Completed your first test',
    image: '/placeholder.svg',
    isEarned: true,
    date: 'May 2, 2025'
  },
  {
    id: 2,
    name: 'Perfect Score',
    description: 'Scored 100% in any test',
    image: '/placeholder.svg',
    isEarned: false
  },
  {
    id: 3,
    name: 'Physics Wizard',
    description: 'Score above 90% in 3 Physics tests',
    image: '/placeholder.svg',
    isEarned: true,
    date: 'May 7, 2025'
  },
  {
    id: 4,
    name: 'Streak Master',
    description: 'Maintain a 7-day study streak',
    image: '/placeholder.svg',
    isEarned: true,
    date: 'May 10, 2025'
  },
  {
    id: 5,
    name: 'Speed Demon',
    description: 'Complete a test in half the allotted time',
    image: '/placeholder.svg',
    isEarned: false
  },
  {
    id: 6,
    name: 'Chemistry Champion',
    description: 'Score above 90% in 3 Chemistry tests',
    image: '/placeholder.svg',
    isEarned: false
  },
  {
    id: 7,
    name: 'Math Maestro',
    description: 'Score above 90% in 3 Math tests',
    image: '/placeholder.svg',
    isEarned: false
  },
  {
    id: 8,
    name: 'Fiesta Winner',
    description: 'Win first place in any event',
    image: '/placeholder.svg',
    isEarned: false
  }
];

const Rewards = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [filterType, setFilterType] = useState('all');
  const [userCoins, setUserCoins] = useState(350); // Mock user coins balance
  
  const handlePurchase = (item: any) => {
    if (userCoins >= item.price) {
      setUserCoins(prev => prev - item.price);
      toast.success(`Successfully purchased ${item.title}!`, {
        description: `You spent ${item.price} coins.`
      });
    } else {
      toast.error("Not enough coins!", {
        description: `You need ${item.price - userCoins} more coins to purchase this item.`
      });
    }
  };
  
  // Filter reward items based on type
  const filteredRewards = filterType === 'all' 
    ? rewardItems 
    : rewardItems.filter(item => item.type === filterType);
    
  // Sort badges to show earned ones first
  const sortedBadges = [...badgeData].sort((a, b) => {
    if (a.isEarned && !b.isEarned) return -1;
    if (!a.isEarned && b.isEarned) return 1;
    return 0;
  });
  
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'test': return <FileText className="h-5 w-5" />;
      case 'pdf': return <Download className="h-5 w-5" />;
      case 'accessory': return <Award className="h-5 w-5" />;
      default: return <Star className="h-5 w-5" />;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-muted to-background">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brandIndigo to-brandPurple bg-clip-text text-transparent mb-2">Rewards & Badges</h1>
              <p className="text-muted-foreground">Collect coins, redeem rewards, and show off your achievements</p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-white py-2 px-4 rounded-full shadow-md">
              <Star className="h-5 w-5 mr-2" fill="white" />
              <span className="font-bold text-lg">{userCoins}</span>
              <span className="ml-1">coins</span>
            </div>
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6 p-1 bg-muted rounded-lg w-full md:w-auto">
              <TabsTrigger value="store" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple">
                Reward Store
              </TabsTrigger>
              <TabsTrigger value="badges" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple">
                Your Badges
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple">
                Coin History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="store" className="mt-0">
              <div className="mb-6">
                <h2 className="sr-only">Filter by type</h2>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={filterType === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterType('all')}
                    className={filterType === 'all' ? 'bg-gradient-to-r from-brandIndigo to-brandPurple' : ''}
                  >
                    All Items
                  </Button>
                  <Button 
                    variant={filterType === 'test' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterType('test')}
                    className={filterType === 'test' ? 'bg-gradient-to-r from-brandIndigo to-brandPurple' : ''}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Tests
                  </Button>
                  <Button 
                    variant={filterType === 'pdf' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterType('pdf')}
                    className={filterType === 'pdf' ? 'bg-gradient-to-r from-brandIndigo to-brandPurple' : ''}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Study Material
                  </Button>
                  <Button 
                    variant={filterType === 'accessory' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setFilterType('accessory')}
                    className={filterType === 'accessory' ? 'bg-gradient-to-r from-brandIndigo to-brandPurple' : ''}
                  >
                    <Award className="h-4 w-4 mr-1" />
                    Accessories
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map(item => (
                  <Card key={item.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                    {item.popular && (
                      <div className="bg-gradient-to-r from-brandOrange to-brandPurple text-white text-xs font-semibold py-1 px-3 text-center">
                        <Flame className="h-3 w-3 inline mr-1" />
                        Popular Item
                      </div>
                    )}
                    
                    <div className="relative h-48 bg-gray-100">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                      <div className="absolute top-2 right-2">
                        <Badge className={`
                          ${item.type === 'test' ? 'bg-blue-100 text-blue-800 border-blue-200' : ''}
                          ${item.type === 'pdf' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                          ${item.type === 'accessory' ? 'bg-purple-100 text-purple-800 border-purple-200' : ''}
                        `}>
                          {getTypeIcon(item.type)}
                          <span className="ml-1 capitalize">{item.type}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-muted-forground text-sm mb-4 line-clamp-2">{item.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-lg font-semibold text-brandPurple">
                          <Star className="h-5 w-5 mr-1 text-yellow-500" fill="currentColor" />
                          {item.price}
                        </div>
                        <Button 
                          onClick={() => handlePurchase(item)}
                          disabled={userCoins < item.price}
                          className={userCoins >= item.price ? 
                            "bg-gradient-to-r from-brandIndigo to-brandPurple hover:opacity-90" : 
                            "bg-gray-300 text-muted-forground cursor-not-allowed"
                          }
                        >
                          {userCoins >= item.price ? "Purchase" : "Not Enough Coins"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {filteredRewards.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
                    <FileText className="h-16 w-16" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No items available</h3>
                  <p className="text-gray-500">There are no items available in this category right now.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="badges" className="mt-0">
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Your Badge Collection</h2>
                <p className="text-muted-forground">
                  Complete tests and challenges to earn badges and show them off on your profile.
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {sortedBadges.map(badge => (
                  <Card 
                    key={badge.id} 
                    className={`overflow-hidden transition-all duration-300 text-center
                      ${badge.isEarned ? 'border-brandPurple' : 'opacity-70 grayscale'}
                    `}
                  >
                    <div className={`p-6 ${badge.isEarned ? 'bg-gradient-to-br from-purple-50 to-indigo-50' : 'bg-muted'}`}>
                      <div className="mx-auto h-20 w-20 rounded-full bg-white p-2 shadow-sm mb-4">
                        <img 
                          src={badge.image} 
                          alt={badge.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      
                      <h3 className="font-medium text-lg mb-1">{badge.name}</h3>
                      <p className="text-muted-forground text-sm mb-2">{badge.description}</p>
                      
                      {badge.isEarned ? (
                        <div className="flex items-center justify-center text-green-600 text-sm">
                          <Check className="h-4 w-4 mr-1" />
                          <span>Earned {badge.date}</span>
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-gray-100">Not earned yet</Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Coin Activity</CardTitle>
                  <CardDescription>Track your coin earnings and spending</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border-l-4 border-green-400 bg-green-50 rounded">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <FileText className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Test Completion</div>
                          <div className="text-gray-500 text-sm">JEE Full Mock Test 1</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-green-600 font-semibold flex items-center">
                          <Star className="h-4 w-4 mr-1" fill="currentColor" />
                          +80
                        </div>
                        <div className="text-gray-500 text-sm">Today</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border-l-4 border-red-400 bg-red-50 rounded">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                          <Award className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <div className="font-medium">Item Purchase</div>
                          <div className="text-gray-500 text-sm">Math Master Badge</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-red-600 font-semibold flex items-center">
                          <Star className="h-4 w-4 mr-1" fill="currentColor" />
                          -75
                        </div>
                        <div className="text-gray-500 text-sm">Yesterday</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border-l-4 border-green-400 bg-green-50 rounded">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Calendar className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Daily Quiz</div>
                          <div className="text-gray-500 text-sm">Math Blitz</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-green-600 font-semibold flex items-center">
                          <Star className="h-4 w-4 mr-1" fill="currentColor" />
                          +20
                        </div>
                        <div className="text-gray-500 text-sm">May 12, 2025</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border-l-4 border-green-400 bg-green-50 rounded">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Flame className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Streak Bonus</div>
                          <div className="text-gray-500 text-sm">5 Day Streak</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-green-600 font-semibold flex items-center">
                          <Star className="h-4 w-4 mr-1" fill="currentColor" />
                          +50
                        </div>
                        <div className="text-gray-500 text-sm">May 10, 2025</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border-l-4 border-green-400 bg-green-50 rounded">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium">Badge Earned</div>
                          <div className="text-gray-500 text-sm">Physics Wizard</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-green-600 font-semibold flex items-center">
                          <Star className="h-4 w-4 mr-1" fill="currentColor" />
                          +25
                        </div>
                        <div className="text-gray-500 text-sm">May 7, 2025</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline">View Full History</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rewards;
