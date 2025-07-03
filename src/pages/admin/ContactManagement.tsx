import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Mail, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

interface ContactResponse {
  data: ContactSubmission[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const fetchContacts = async ({
  search,
  page,
  limit,
}: {
  search: string;
  page: number;
  limit: number;
}): Promise<ContactResponse> => {
  const res = await apiClient.get("/contact", {
    params: {
      search,
      page,
      limit,
    },
  });
  return res.data.data;
};

const ContactManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [selectedContact, setSelectedContact] =
    useState<ContactSubmission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["contacts", searchTerm, currentPage],
    queryFn: () =>
      fetchContacts({
        search: searchTerm,
        page: currentPage,
        limit: itemsPerPage,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const contactSubmissions = data?.data || [];
  const pagination = data?.pagination;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Contact Form Submissions
            </h1>
            <p className="text-gray-600">
              Manage and respond to user inquiries
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Contact Submissions</CardTitle>
                <CardDescription>
                  All contact form submissions from users
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search submissions..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading contacts...</p>
            ) : contactSubmissions.length === 0 ? (
              <p className="text-gray-500">No contact submissions found.</p>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactSubmissions.map((submission) => (
                      <TableRow key={submission._id}>
                        <TableCell>
                          <div className="font-medium">{submission.name}</div>
                          <div>{submission.email}</div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {submission.subject}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {submission.message}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedContact(submission);
                                setIsModalOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            <a
                              href={`mailto:${
                                submission.email
                              }?subject=Re: ${encodeURIComponent(
                                submission.subject
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </a>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {pagination && pagination.pages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: pagination.pages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(pagination.pages, prev + 1)
                              )
                            }
                            className={
                              currentPage === pagination.pages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Contact Details</DialogTitle>
              <DialogDescription>Detailed message from user</DialogDescription>
            </DialogHeader>

            {selectedContact && (
              <div className="space-y-4 text-gray-800">
                <div>
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedContact.name}
                </div>
                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedContact.email}
                </div>
                <div>
                  <span className="font-semibold">Subject:</span>{" "}
                  {selectedContact.subject}
                </div>
                <div>
                  <span className="font-semibold">Message:</span>
                  <p className="mt-2 whitespace-pre-line text-gray-700">
                    {selectedContact.message}
                  </p>
                </div>
                <div>
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(selectedContact.createdAt).toLocaleString()}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ContactManagement;
