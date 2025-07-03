import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Reply, CheckCircle } from "lucide-react";
import TutorLayout from "@/components/layouts/TutorLayout";

const TutorSupportManagement = () => {
  const supportTickets = [
    {
      id: 1,
      name: "Arjun Sharma",
      email: "arjun@example.com",
      subject: "Cannot access test results",
      message: "I completed the test but can't see my results...",
      status: "Open",
      date: "2024-01-20",
    },
    {
      id: 2,
      name: "Priya Mehta",
      email: "priya@example.com",
      subject: "Coin redemption issue",
      message: "I tried to redeem coins but getting an error...",
      status: "Resolved",
      date: "2024-01-19",
    },
  ];

  return (
    <TutorLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-5 md:gap-0 md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Support Management</h1>
            <p className="text-muted-foreground">Handle user inquiries and feedback</p>
          </div>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Announcement
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.5h</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>Recent user inquiries and support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supportTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.name}</div>
                        <div className="text-sm text-gray-500">{ticket.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.subject}</div>
                        <div className="text-sm text-gray-500">{ticket.message}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={ticket.status === 'Open' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.date}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </TutorLayout>
  );
};

export default TutorSupportManagement;
