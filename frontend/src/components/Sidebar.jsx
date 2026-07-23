import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import {
  LayoutDashboard,
  Users,
  BookCopy,
  BarChart,
  User,
  BookOpen,
  RotateCcw,
  PlusCircle,
  FileText,
  TrendingUp,
  DollarSign,
  Sparkles,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar({ className, isCollapsed }) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);

  let links = [];
  let quickLinks = [];

  if (user?.role === "LIBRARIAN") {
    links = [
      { name: "Dashboard", href: "/librarian", icon: LayoutDashboard },
      { name: "Members", href: "/librarian/members", icon: Users },
      { name: "Catalog", href: "/librarian/catalog", icon: BookCopy },
    ];
    quickLinks = [
      { name: "Issue Book", href: "/librarian/issue", icon: BookOpen },
      { name: "Process Return", href: "/librarian/return", icon: RotateCcw },
      { name: "Add Book", href: "/librarian/catalog/add", icon: PlusCircle },
      { name: "Budget Tracker", href: "/librarian/budget", icon: FileText },
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
      { name: "Reports Center", href: "/management/reports", icon: BarChart },
    ];
    quickLinks = [
      { name: "Circulation & Usage", href: "/management/reports?tab=usage", icon: TrendingUp },
      { name: "Financial Audit", href: "/management/reports?tab=financial", icon: DollarSign },
      { name: "Executive Insights", href: "/management/reports?tab=executive", icon: Sparkles },
    ];
  }

  const renderNavItems = (items) => (
    <div className="flex flex-col gap-1">
      {items.map((link) => {
        const Icon = link.icon;
        const currentPathWithSearch = location.pathname + location.search;
        const isLinkActive =
          currentPathWithSearch === link.href ||
          (location.pathname === link.href && !location.search && !link.href.includes("?"));

        const linkContent = (
          <span
            className={cn(
              "group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium",
              isLinkActive ? "bg-accent text-accent-foreground font-semibold" : "transparent",
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
  );

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2
            className={cn(
              "mb-2 px-4 text-lg font-semibold tracking-tight whitespace-nowrap transition-all",
              isCollapsed ? "w-0 overflow-hidden px-0 opacity-0" : ""
            )}
          >
            RVK Library
          </h2>
          <TooltipProvider>
            {renderNavItems(links)}

            {quickLinks.length > 0 && (
              <>
                <div className="border-border my-3 border-t" />
                {!isCollapsed && (
                  <h3 className="text-muted-foreground mb-2 px-4 text-xs font-semibold tracking-wider uppercase">
                    Quick Actions
                  </h3>
                )}
                {renderNavItems(quickLinks)}
              </>
            )}
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
