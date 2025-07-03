import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  BookOpen,
  Star,
  Calendar,
  Award,
  Flame,
  Search,
  Filter,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";
import apiClient from "@/lib/apiClient";

// Mock test data
// const tests = [
//   {
//     id: 1,
//     title: "JEE Full Mock Test 1",
//     type: "full",
//     subject: "all",
//     difficulty: "hard",
//     duration: 180,
//     questionsCount: 90,
//     isPurchased: true,
//     isPopular: true,
//     price: 100,
//     image:
//       "https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=2093&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 2,
//     title: "Physics: Electrostatics",
//     type: "chapter",
//     subject: "physics",
//     difficulty: "medium",
//     duration: 45,
//     questionsCount: 20,
//     isPurchased: true,
//     isPopular: false,
//     price: 50,
//     image: "https://images.unsplash.com/photo-1665979738279-bd2441290e02?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 3,
//     title: "Math Blitz",
//     type: "daily",
//     subject: "mathematics",
//     difficulty: "medium",
//     duration: 15,
//     questionsCount: 10,
//     isPurchased: false,
//     isPopular: true,
//     price: 20,
//     image: "https://images.unsplash.com/photo-1568650108567-f040f546ce15?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 4,
//     title: "Chemistry: Organic Reactions",
//     type: "chapter",
//     subject: "chemistry",
//     difficulty: "hard",
//     duration: 60,
//     questionsCount: 25,
//     isPurchased: false,
//     isPopular: false,
//     price: 50,
//     image: "https://images.unsplash.com/photo-1604872423159-61ef082dab75?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 5,
//     title: "Physics Fiesta",
//     type: "event",
//     subject: "physics",
//     difficulty: "hard",
//     duration: 90,
//     questionsCount: 30,
//     isPurchased: false,
//     isPopular: true,
//     price: 100,
//     image: "https://images.unsplash.com/photo-1606326608690-4e0281b1e588?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
//   {
//     id: 6,
//     title: "BITSAT Full Mock Test",
//     type: "full",
//     subject: "all",
//     difficulty: "hard",
//     duration: 180,
//     questionsCount: 150,
//     isPurchased: false,
//     isPopular: false,
//     price: 100,
//     image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   },
// ];

const TestSeries = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultType = searchParams.get("type") || "all";

  const [activeTab, setActiveTab] = useState(defaultType);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

   const [tests, setTests] = useState([]);

  const fetchTests = async () => {
    try {
      const { data } = await apiClient.get("/test");
      console.log(data);
      setTests(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // Filter tests based on tab, search, and filters
  const filteredTests = tests.filter((test) => {
    // Filter by tab/type
    if (activeTab !== "all" && test.type !== activeTab) return false;

    // Filter by search query
    if (
      searchQuery &&
      !test.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    // Filter by subject
    if (filterSubject !== "all" && test.subject !== filterSubject) return false;

    // Filter by difficulty
    if (filterDifficulty !== "all" && test.difficulty !== filterDifficulty)
      return false;

    return true;
  });

  // Separate purchased tests
  const purchasedTests = filteredTests.filter((test) => test.isPurchased);
  const otherTests = filteredTests.filter((test) => !test.isPurchased);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ type: value });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-muted dark:to-background">
      <Header />

      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brandIndigo to-brandPurple bg-clip-text text-transparent mb-2">
                Test Series
              </h1>
              <p className="text-muted-forground">
                Prepare for your exams with our comprehensive test series
              </p>
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 mt-4 md:mt-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 w-full md:w-64 border border-gray-300 dark:border-y-gray-700 bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple focus:border-transparent transition-all"
                />
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={`${
                  showFilters ? "bg-purple-50 text-brandPurple" : ""
                } hover:bg-purple-50 hover:text-brandPurple transition-all`}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {showFilters && (
            <Card className="p-4 mb-6 animate-slide-up border-l-4 border-l-brandPurple shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Subject
                  </label>
                  <select
                    value={filterSubject}
                    onChange={(e) => setFilterSubject(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-y-gray-700 bg-muted rounded-md focus:outline-none focus:ring-2 focus:ring-brandPurple focus:border-transparent"
                  >
                    <option value="all">All Subjects</option>
                    <option value="physics">Physics</option>
                    <option value="chemistry">Chemistry</option>
                    <option value="mathematics">Mathematics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Difficulty
                  </label>
                  <select
                    value={filterDifficulty}
                    onChange={(e) => setFilterDifficulty(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md  dark:border-y-gray-700 bg-muted focus:outline-none focus:ring-2 focus:ring-brandPurple focus:border-transparent"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilterSubject("all");
                    setFilterDifficulty("all");
                    setSearchQuery("");
                  }}
                  className="mr-2"
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => setShowFilters(false)}
                  className="bg-gradient-to-r from-brandIndigo to-brandPurple hover:opacity-90"
                >
                  Apply Filters
                </Button>
              </div>
            </Card>
          )}

          <Tabs
            defaultValue={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="mb-6 p-1 bg-muted rounded-lg w-full md:w-auto flex flex-wrap">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                All Tests
              </TabsTrigger>
              <TabsTrigger
                value="full"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                Full Mocks
              </TabsTrigger>
              <TabsTrigger
                value="chapter"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                Chapter-wise
              </TabsTrigger>
              <TabsTrigger
                value="daily"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                Daily Quizzes
              </TabsTrigger>
              <TabsTrigger
                value="event"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-brandPurple"
              >
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {/* Purchased Tests Section */}
              {/* {purchasedTests.length > 0 && (
                <div className="mb-8 animate-fade-in">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-1 bg-gradient-to-b from-brandPurple to-brandIndigo rounded-full mr-3"></div>
                    <h2 className="text-xl font-semibold">Your Tests</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedTests.map((test) => (
                      <TestCard key={test.id} test={test} />
                    ))}
                  </div>
                </div>
              )} */}

              {/* Other Tests Section */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-8 w-1 bg-gradient-to-b from-brandGreen to-brandIndigo rounded-full mr-3"></div>
                  <h2 className="text-xl font-semibold">Available Tests</h2>
                </div>
                {tests.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                      <TestCard key={test.id} test={test} />
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white rounded-lg border border-gray-200 shadow">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 mb-4">
                      No tests found matching your criteria.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-2"
                      onClick={() => {
                        setFilterSubject("all");
                        setFilterDifficulty("all");
                        setSearchQuery("");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface TestCardProps {
  test: any;
}

const TestCard: React.FC<TestCardProps> = ({ test }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "full":
        return <BookOpen className="h-4 w-4" />;
      case "chapter":
        return <FileText className="h-4 w-4" />;
      case "daily":
        return <Calendar className="h-4 w-4" />;
      case "event":
        return <Award className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800 border-green-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "full":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "chapter":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "daily":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "event":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  
  const getType = (type: string) => {
    switch (type) {
      case "fullMock":
        return "Full Mock";
      case "chapterWise":
        return "Chapter Test";
      case "dailyQuiz":
        return "Daily Quiz";
      case "themedEvent":
        return "Themed Event";
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg group ${
        test.isPurchased ? "border-l-4 border-l-brandPurple" : ""
      }`}
    >
      <div className="p-0">
        <div className="relative aspect-video bg-gray-100">
          {test.isPopular && (
            <div className="bg-gradient-to-r absolute w-full from-brandOrange to-brandPurple text-white text-xs font-semibold py-1 px-3 text-center flex items-center justify-center">
              <Flame className="h-3 w-3 mr-1" />
              Popular Test
            </div>
          )}

          <div className="mx-auto h-full bg-white shadow-sm mb-4">
            <img
              src={'https://images.unsplash.com/photo-1598981457915-aea220950616?q=80&w=2093&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
              alt={test.name}
              className="aspect-video w-full object-cover"
            />
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-brandPurple transition-colors">
            {test.title}
          </h3>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant="outline"
              className={`${getDifficultyColor(test.overallDifficulty)}`}
            >
              {test.overallDifficulty}
            </Badge>
            <Badge
              variant="outline"
              className="bg-gray-100 text-gray-800 border-gray-200 capitalize"
            >
              {getType(test.type)}
            </Badge>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-5 space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-gray-400" />
              <span>{test.duration} mins</span>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-1 text-gray-400" />
              <span>{test.numberOfQuestions} questions</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            {!test.isPurchased ? (
              <Link to={`/tests/${test._id}`} className="w-full">
                <Button className="w-full bg-gradient-to-r from-brandIndigo to-brandPurple hover:opacity-90 transition-opacity">
                  Start Test
                </Button>
              </Link>
            ) : (
              <>
                <div className="flex items-center text-lg font-semibold text-brandPurple">
                  <Star
                    className="h-4 w-4 mr-1 text-yellow-500"
                    fill="currentColor"
                  />
                  {test.price}
                </div>
                <Link to={`/rewards`}>
                  <Button
                    variant="outline"
                    className="hover:bg-purple-50 border-brandPurple text-brandPurple hover:text-brandPurple transition-all"
                  >
                    Purchase
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TestSeries;
