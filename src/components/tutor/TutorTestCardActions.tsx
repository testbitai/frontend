import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  BarChart3,
  Copy,
  Share,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { TutorTest } from "@/hooks/useTutorTests";
import { useToast } from "@/hooks/use-toast";

interface TutorTestCardActionsProps {
  test: TutorTest;
  onDelete: (testId: string, testTitle: string) => void;
  onTogglePublication?: (testId: string, isPublished: boolean) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export const TutorTestCardActions: React.FC<TutorTestCardActionsProps> = ({
  test,
  onDelete,
  onTogglePublication,
  isDeleting = false,
  isUpdating = false,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleDelete = () => {
    onDelete(test._id, test.title);
    setShowDeleteDialog(false);
  };

  const handleTogglePublication = () => {
    if (onTogglePublication) {
      onTogglePublication(test._id, !test.isPublished);
    }
  };

  const handleCopyTestId = () => {
    navigator.clipboard.writeText(test._id);
    toast({
      title: "Test ID Copied",
      description: "Test ID has been copied to clipboard.",
    });
  };

  const handleShareTest = () => {
    const shareUrl = `${window.location.origin}/test/${test._id}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Test Link Copied",
      description: "Test link has been copied to clipboard.",
    });
  };

  return (
    <>
      <div className="flex items-center justify-between pt-3">
        {/* Publication Status */}
        <div className="flex items-center gap-2">
          <Badge
            variant={test.isPublished ? "default" : "secondary"}
            className={`text-xs ${
              test.isPublished
                ? "bg-green-100 text-green-800 hover:bg-green-200"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            {test.isPublished ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Published
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 mr-1" />
                Draft
              </>
            )}
          </Badge>
          
          {test.allowedStudents && test.allowedStudents.length > 0 && (
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {test.allowedStudents.length} students
            </Badge>
          )}
        </div>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={isDeleting || isUpdating}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {/* View Test */}
            <DropdownMenuItem asChild>
              <Link
                to={`/tutor/tests/preview/${test._id}`}
                className="flex items-center cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Test
              </Link>
            </DropdownMenuItem>

            {/* Edit Test */}
            <DropdownMenuItem asChild>
              <Link
                to={`/tutor/tests/edit/${test._id}`}
                className="flex items-center cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Test
              </Link>
            </DropdownMenuItem>

            {/* View Analytics */}
            <DropdownMenuItem asChild>
              <Link
                to={`/tutor/tests/analytics/${test._id}`}
                className="flex items-center cursor-pointer"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                View Analytics
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Toggle Publication */}
            {onTogglePublication && (
              <DropdownMenuItem
                onClick={handleTogglePublication}
                disabled={isUpdating}
                className="flex items-center cursor-pointer"
              >
                {test.isPublished ? (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    Unpublish Test
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Publish Test
                  </>
                )}
              </DropdownMenuItem>
            )}

            {/* Copy Test ID */}
            <DropdownMenuItem
              onClick={handleCopyTestId}
              className="flex items-center cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Test ID
            </DropdownMenuItem>

            {/* Share Test */}
            <DropdownMenuItem
              onClick={handleShareTest}
              className="flex items-center cursor-pointer"
            >
              <Share className="mr-2 h-4 w-4" />
              Share Test Link
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Delete Test */}
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
              className="flex items-center cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Test
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex space-x-2 mt-3">
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/tutor/tests/preview/${test._id}`}>
            <Eye className="mr-1 h-3 w-3" />
            Preview
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/tutor/tests/edit/${test._id}`}>
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" className="flex-1" asChild>
          <Link to={`/tutor/tests/analytics/${test._id}`}>
            <BarChart3 className="mr-1 h-3 w-3" />
            Stats
          </Link>
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{test.title}"? This action cannot be undone.
              All student attempts and analytics for this test will also be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
