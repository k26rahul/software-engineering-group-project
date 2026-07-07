import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="bg-muted/40 flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">RVK Library</h1>
        <p className="text-muted-foreground text-lg">
          Welcome to the RVK Library. Please sign in to access your dashboard.
        </p>
        <div className="flex justify-center gap-6">
          <Button asChild size="lg" className="px-8 py-6 text-lg">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 py-6 text-lg">
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
