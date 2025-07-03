import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/lib/apiClient";

const TestManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const { toast } = useToast();
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
  
  const handleDeleteTest = (testId: number, testTitle: string) => {
    toast({
      title: "Test Deleted",
      description: `"${testTitle}" has been deleted successfully.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const filteredTests = tests.filter((test) => {
    const matchesSearch =
      test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      test.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Test Management
            </h1>
            <p className="text-muted-foreground">
              Create, edit, and manage all tests
            </p>
          </div>
          <Link to="/admin/tests/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Test
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tests by title or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full">Full Mock</SelectItem>
                  <SelectItem value="chapter">Chapter Test</SelectItem>
                  <SelectItem value="daily">Daily Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => (
           <Card key={test.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg line-clamp-2">{test.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {test.examType} • {test.numberOfQuestions} questions
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(test.overallDifficulty)}>
                    {test.overallDifficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{getType(test.type)}</span>
                  </div>
                  {/* <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-medium">{test.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Created:</span>
                    <span className="font-medium">{test.created}</span>
                  </div> */}

                  <div className="flex space-x-2 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Link to={`/admin/tests/edit/${test.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDeleteTest(test.id, test.title)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tests found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterType !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Get started by creating your first test."}
              </p>
              {!searchTerm && filterType === "all" && (
                <Link to="/admin/tests/create">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Test
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default TestManagement;
