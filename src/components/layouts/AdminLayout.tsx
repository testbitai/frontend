
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Trophy, 
  Calendar, 
  FileText, 
  MessageSquare,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "../mode-toggle";
import { useAuthStore } from "@/stores/authStore";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Test Management", href: "/admin/tests", icon: BookOpen },
    { name: "Tutor Management", href: "/admin/tutors", icon: GraduationCap },
    { name: "Student Management", href: "/admin/students", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Rewards", href: "/admin/rewards", icon: Trophy },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Contact", href: "/admin/contact", icon: Mail },
    { name: "Support", href: "/admin/support", icon: MessageSquare },
  ];

    const { logout } = useAuthStore((state) => state);

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-background shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <Link to="/admin/dashboard" className="text-xl font-bold text-foreground">
            Admin Panel
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || 
              (item.href !== "/admin" && location.pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors ${
                  isActive
                    ? 'bg-muted text-blue-700'
                    : 'text-muted-foreground hover:bg-muted hover:text-bakground'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-background shadow-sm border-b px-6 py-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                {navigation.find(item => 
                  location.pathname === item.href || 
                  (item.href !== "/admin" && location.pathname.startsWith(item.href))
                )?.name || "Dashboard"}
              </h2>
            </div>
          </div>

          <ModeToggle />
        </div>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
