import { Link } from "react-router-dom";
import { Clock, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingApprovalPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        {/* Icon */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10">
          <Clock className="h-10 w-10 text-amber-500" />
          <span className="bg-background absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-2">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </span>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Registration Submitted!</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your account has been created and is currently{" "}
            <span className="text-amber-600 font-medium">pending approval</span> from a librarian.
            You'll be able to borrow books once your account is approved.
          </p>
        </div>

        {/* What happens next */}
        <div className="bg-muted/50 w-full rounded-xl border p-4 text-left space-y-3">
          <p className="text-sm font-semibold">What happens next?</p>
          <ol className="text-muted-foreground space-y-2 text-sm">
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">1</span>
              A librarian will review your registration request.
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">2</span>
              Once approved, your borrowing privileges will be activated.
            </li>
            <li className="flex gap-3">
              <span className="bg-primary text-primary-foreground mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">3</span>
              Log in to check your account status at any time.
            </li>
          </ol>
        </div>

        {/* CTA */}
        <Button asChild className="w-full gap-2">
          <Link to="/login">
            Go to Login <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
