
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useToast } from "@/hooks/use-toast";

const EditTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSaveTest = () => {
    toast({
      title: "Test Updated",
      description: "Test has been updated successfully.",
    });
    navigate("/admin/tests");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin/tests">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tests
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Test #{id}</h1>
              <p className="text-gray-600">Modify test details and questions</p>
            </div>
          </div>
          <Button onClick={handleSaveTest} className="bg-green-600 hover:bg-green-700">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
        
        <div className="bg-white p-8 rounded-lg border">
          <p className="text-gray-600">Edit test form would be implemented here with similar structure to CreateTest...</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditTest;
