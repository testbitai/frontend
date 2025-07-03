import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageSquare, Reply, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { formatDateTime, getPriorityColor, getStatusColor } from "@/lib/utils";

const SupportManagement = () => {
  const [stats, setStats] = useState({
    openTickets: 0,
    resolvedToday: 0,
    avgResponseTime: "0h",
  });

  const [supportTickets, setSupportTickets] = useState([]);

  const fetchSupportAnalytics = async () => {
    try {
      const { data } = await apiClient("/support/analytics");
      setStats({
        openTickets: data.data.openTicketsCount,
        resolvedToday: data.data.resolvedTodayCount,
        avgResponseTime: `${data.data.avgResponseTimeInHours}h`,
      });
    } catch (error) {
      console.error("Error fetching support analytics:", error);
    }
  };

  const fetchSupportTickets = async () => {
    try {
      const { data } = await apiClient("/support");
      setSupportTickets(data.data);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
    }
  };

  useEffect(() => {
    fetchSupportAnalytics();
    fetchSupportTickets();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-5 md:gap-0 md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Support Management
            </h1>
            <p className="text-muted-foreground">
              Handle user inquiries and feedback
            </p>
          </div>
          {/* <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Announcement
          </Button> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open Tickets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.openTickets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Resolved Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolvedToday}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Support Tickets</CardTitle>
            <CardDescription>
              Recent user inquiries and support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket Id</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Resolve At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supportTickets.map((ticket) => (
                  <TableRow key={ticket.ticketId}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.ticketId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {ticket.createdBy.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {ticket.createdBy.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{ticket.subject}</div>
                        <div className="text-sm text-gray-500">
                          {ticket.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{ticket.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(ticket.createdAt)}</TableCell>
                    <TableCell>{formatDateTime(ticket.resolvedAt)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {/* <Button variant="outline" size="sm">
                          <Reply className="h-4 w-4" />
                        </Button> */}
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
    </AdminLayout>
  );
};

export default SupportManagement;
