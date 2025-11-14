"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Edit, Trash2, Calendar, BarChart3 } from "lucide-react";

export default function BlogTable({ posts, onUpdate }) {
  const router = useRouter();
  const [deleteDialog, setDeleteDialog] = useState({ open: false, post: null });

  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        onUpdate();
        setDeleteDialog({ open: false, post: null });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusVariant = (published) => {
    return published ? "default" : "secondary";
  };

  const getStatusText = (published) => {
    return published ? "Published" : "Draft";
  };

  return (
    <>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Views</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No posts yet. Create your first post to get started.
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post._id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">
                    <div>
                      <p
                        className="font-semibold text-gray-900 line-clamp-1 hover:cursor-pointer"
                        title={post.title}
                      >
                        {post.title?.slice(0, 20)}...
                      </p>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {(post.excerpt || post.content)
                          ?.split(" ")
                          .slice(0, 7)
                          .join(" ")}...
                      </p>

                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(post.published)}>
                      {getStatusText(post.published)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 capitalize">
                    {post.category || 'General'}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {formatDate(post.createdAt)}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {post.views || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => window.open(`/post/${post._id}`, '_blank')}
                          className="cursor-pointer"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Post
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/edit/${post._id}`)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Post
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteDialog({ open: true, post })}
                          className="cursor-pointer text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, post: open ? deleteDialog.post : null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.post?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => handleDelete(deleteDialog.post?._id)}
            >
              Delete Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}