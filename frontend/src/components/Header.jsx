import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Sidebar } from "./Sidebar";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-background sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Sidebar />
          </nav>
        </SheetContent>
      </Sheet>

      <div className="flex w-full items-center justify-between gap-4 sm:justify-end">
        <div className="flex-1 sm:hidden">
          <span className="text-lg font-semibold tracking-tight">RVK Library</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground hidden text-sm font-medium sm:inline-block">
            {user?.name} ({user?.role})
          </span>
          <Button variant="secondary" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
