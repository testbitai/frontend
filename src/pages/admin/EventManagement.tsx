
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Eye, Edit, Archive } from "lucide-react";

const EventManagement = () => {
  const events = [
    {
      id: 1,
      name: "Physics Fiesta",
      description: "Weekly physics challenge with special rewards",
      status: "Active",
      startDate: "2024-01-15",
      endDate: "2024-01-22",
      participants: 234,
    },
    {
      id: 2,
      name: "Chemistry Challenge",
      description: "Organic chemistry focused event",
      status: "Upcoming",
      startDate: "2024-01-23",
      endDate: "2024-01-30",
      participants: 0,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Event Management</h1>
            <p className="text-muted-foreground">Create and manage themed learning events</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>{event.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">{event.description}</CardDescription>
                  </div>
                  <Badge className={event.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{event.startDate} to {event.endDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Participants:</span>
                    <span className="font-medium">{event.participants}</span>
                  </div>
                  <div className="flex space-x-2 pt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Archive className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default EventManagement;
