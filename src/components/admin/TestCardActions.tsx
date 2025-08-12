import { useState } from "react";
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
import {
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Copy,
  Share2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import type { Test } from "@/hooks/useTests";

interface TestCardActionsProps {
  test: Test;
  onDelete: (testId: string, testTitle: string) => void;
  isDeleting?: boolean;
}

export const TestCardActions = ({ test, onDelete, isDeleting }: TestCardActionsProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast } = useToast();

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(test._id);
      toast({
        title: "Test ID Copied",
        description: "Test ID has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy test ID.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/admin/tests?search=${encodeURIComponent(test.title)}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `TestBit - ${test.title}`,
          text: `Check out this test: ${test.title}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Test link has been copied to clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share test.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    onDelete(test._id, test.title);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="flex space-x-2 pt-3">
        {/* Primary Actions */}
        <Link to={`/admin/tests/preview/${test._id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="mr-1 h-3 w-3" />
            View
          </Button>
        </Link>
        
        <Link to={`/admin/tests/edit/${test._id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Edit className="mr-1 h-3 w-3" />
            Edit
          </Button>
        </Link>

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="px-2">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleCopyId}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Test ID
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Test
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 focus:text-red-600"
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Test
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Test</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{test.title}"? This action cannot be undone.
              All associated data including student attempts will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
