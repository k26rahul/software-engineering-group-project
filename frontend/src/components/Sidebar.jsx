import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { LayoutDashboard, Users, BookCopy, BarChart } from "lucide-react";

export function Sidebar({ className }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  // Default links
  let links = [];

  if (user?.role === "Librarian") {
    links = [
      { name: "Dashboard", href: "/librarian", icon: LayoutDashboard },
      { name: "Members", href: "/librarian/members", icon: Users },
      { name: "Catalog", href: "/librarian/catalog", icon: BookCopy },
    ];
  } else if (user?.role === "Member") {
    links = [
      { name: "Dashboard", href: "/member", icon: LayoutDashboard },
      { name: "Catalog", href: "/member/catalog", icon: BookCopy },
    ];
  } else if (user?.role === "Management") {
    links = [
      { name: "Dashboard", href: "/management", icon: LayoutDashboard },
      { name: "Reports", href: "/management/reports", icon: BarChart },
    ];
  }

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">RVK Library</h2>
          <div className="flex flex-col gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link key={link.href} to={link.href} className="block">
                  <span
                    className={cn(
                      "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      location.pathname === link.href
                        ? "bg-accent text-accent-foreground"
                        : "transparent"
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{link.name}</span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
