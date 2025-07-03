
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEquation(text: string) {
  // Simple regex to replace basic math notations
  return text
    .replace(/\^(-?\d+)/g, '<sup>$1</sup>') // Handle superscripts like 10^-4
    .replace(/(\d+)\.(\d+)/g, '$1.$2') // Keep decimal numbers as is
}


export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "open":
      return "bg-blue-100 text-blue-800";
    case "in progress":
      return "bg-yellow-100 text-yellow-800";
    case "resolved":
      return "bg-green-100 text-green-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-orange-100 text-orange-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const formatDateTime = (dateString: any) => {
  if (!dateString) {
    return "N/A";
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  // Format: "yyyy-MM-dd hh:mm:ss a" (e.g., "2025-07-01 07:18:28 AM")
  return format(date, "yyyy-MM-dd hh:mm a");
};
