import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import { LayoutDashboard, Users, BookCopy, BarChart, User } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar({ className, isCollapsed }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  // Default links
  let links = [];

  if (user?.role === "LIBRARIAN") {
    links = [
      { name: "Dashboard", href: "/librarian", icon: LayoutDashboard },
      { name: "Members", href: "/librarian/members", icon: Users },
      { name: "Catalog", href: "/librarian/catalog", icon: BookCopy },
    ];
  } else if (user?.role === "MEMBER") {
    links = [
      { name: "Dashboard", href: "/member", icon: LayoutDashboard },
      { name: "Profile", href: "/member/profile", icon: User },
      { name: "Catalog", href: "/member/catalog", icon: BookCopy },
    ];
  } else if (user?.role === "CAMPUS_MANAGEMENT") {
    links = [
      { name: "Dashboard", href: "/management", icon: LayoutDashboard },
      { name: "Reports", href: "/management/reports", icon: BarChart },
    ];
  }

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2
            className={cn(
              "mb-2 px-4 text-lg font-semibold tracking-tight transition-all whitespace-nowrap",
              isCollapsed ? "w-0 px-0 opacity-0 overflow-hidden" : ""
            )}
          >
            RVK Library
          </h2>
          <TooltipProvider>
            <div className="flex flex-col gap-1">
              {links.map((link) => {
                const Icon = link.icon;
                const linkContent = (
                  <span
                    className={cn(
                      "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium",
                      location.pathname === link.href
                        ? "bg-accent text-accent-foreground"
                        : "transparent",
                      isCollapsed ? "justify-center px-0" : ""
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", isCollapsed ? "" : "mr-2")} />
                    {!isCollapsed && <span>{link.name}</span>}
                  </span>
                );

                return (
                  <Link key={link.href} to={link.href} className="block">
                    {isCollapsed ? (
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                        <TooltipContent side="right" className="ml-2">
                          {link.name}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      linkContent
                    )}
                  </Link>
                );
              })}
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
