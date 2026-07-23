import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  LogIn,
  Search,
  Zap,
  Clock,
  ThumbsUp,
  GraduationCap,
  BookOpenCheck,
  Building2,
  Users,
  CheckCircle2,
  LayoutDashboard,
  Quote,
  ShieldCheck,
  BookMarked,
  Wallet,
} from "lucide-react";

const CURRENT_YEAR = new Date().getFullYear();

export default function HomePage() {
  const user = useAuthStore((state) => state.user);

  const getDashboardPath = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "LIBRARIAN":
        return "/librarian";
      case "CAMPUS_MANAGEMENT":
        return "/management";
      case "MEMBER":
      default:
        return "/member";
    }
  };

  return (
    <div className="bg-background text-foreground selection:bg-primary selection:text-primary-foreground flex min-h-screen flex-col">
      {/* Top Header / Navigation */}
      <header className="bg-background/80 border-border/40 sticky top-0 z-40 w-full border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-xl font-bold shadow-xs">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight">RVK Library</span>
              <span className="text-muted-foreground sm:border-border hidden text-xs font-medium sm:ml-2 sm:inline-block sm:border-l sm:pl-2">
                Rashtrotthana Vidya Kendra
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#impact"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Digital Impact
            </a>
            <a
              href="#roles"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Role Portals
            </a>
            <a
              href="#community"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground hidden text-xs font-medium sm:inline-block">
                  Signed in as <strong className="text-foreground">{user.name}</strong>
                </span>
                <Button asChild size="sm" className="gap-2 shadow-xs">
                  <Link to={getDashboardPath()}>
                    <LayoutDashboard className="h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/login">
                    <LogIn className="mr-1.5 h-4 w-4" />
                    Sign In
                  </Link>
                </Button>
                <Button asChild size="sm" className="gap-1.5 shadow-xs">
                  <Link to="/register">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        {/* Subtle background glow */}
        <div className="bg-primary/5 pointer-events-none absolute top-1/4 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="border-border/60 bg-muted/50 text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium shadow-xs">
            <Sparkles className="text-primary h-3.5 w-3.5" />
            <span>Digital Transformation for RVK Campus & Community</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Empowering Readers through <br className="hidden sm:inline" />
            <span className="from-primary bg-linear-to-r via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Automated Library Workflows
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-lg leading-relaxed">
            Transitioning Rashtrotthana Vidya Kendra from manual registers to a modern digital
            platform. Search 5,000+ titles, manage holds, track fines, and curate reading lists
            seamlessly.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {user ? (
              <Button
                asChild
                size="lg"
                className="w-full gap-2 px-6 py-6 text-base shadow-md sm:w-auto"
              >
                <Link to={getDashboardPath()}>
                  <LayoutDashboard className="h-5 w-5" />
                  Access Your Portal
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="w-full gap-2 px-6 py-6 text-base shadow-md sm:w-auto"
                >
                  <Link to="/register">
                    Register as Member
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full gap-2 px-6 py-6 text-base sm:w-auto"
                >
                  <Link to="/login">
                    <LogIn className="h-5 w-5" />
                    Sign In
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
            <div className="border-border/60 bg-card/60 rounded-2xl border p-5 text-left backdrop-blur-xs transition-transform hover:-translate-y-0.5">
              <div className="bg-primary/10 text-primary mb-3 flex h-10 w-10 items-center justify-center rounded-xl">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold tracking-tight">5,000+</div>
              <div className="text-muted-foreground text-xs font-medium">Catalog Titles</div>
            </div>

            <div className="border-border/60 bg-card/60 rounded-2xl border p-5 text-left backdrop-blur-xs transition-transform hover:-translate-y-0.5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold tracking-tight">2,100+</div>
              <div className="text-muted-foreground text-xs font-medium">Active Members</div>
            </div>

            <div className="border-border/60 bg-card/60 rounded-2xl border p-5 text-left backdrop-blur-xs transition-transform hover:-translate-y-0.5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Zap className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold tracking-tight">100%</div>
              <div className="text-muted-foreground text-xs font-medium">Digital Workflow</div>
            </div>

            <div className="border-border/60 bg-card/60 rounded-2xl border p-5 text-left backdrop-blur-xs transition-transform hover:-translate-y-0.5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold tracking-tight">0 Paper</div>
              <div className="text-muted-foreground text-xs font-medium">Physical Registers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-muted/30 border-border/50 border-y py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-primary text-xs font-semibold tracking-wider uppercase">
              Features
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything Needed for a Modern Library
            </h2>
            <p className="text-muted-foreground mt-3 text-base">
              Designed from real RVK campus workflows to completely automate administrative tasks
              and empower readers.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-card border-border/60 hover:border-primary/40 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
              <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Instant Catalog Discovery</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Search 5,000+ books by title, author, or category in seconds with real-time stock
                and copy availability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border-border/60 hover:border-primary/40 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Automated Issue & Returns</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Digital barcode scanning for quick transactions, automatic return deadlines, and
                exact fine calculations.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border-border/60 hover:border-primary/40 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Fair Reservation Queues</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Automated digital hold queues for out-of-stock titles with instant notification when
                items are returned.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card border-border/60 hover:border-primary/40 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Budget & Expense Tracking</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Real-time tracking of the ₹10,000 monthly allowance, new book orders, and recurring
                periodical subscriptions.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-card border-border/60 hover:border-primary/40 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600">
                <ThumbsUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Crowdsourced Book Requests</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Members submit and upvote book purchase requests to directly shape upcoming library
                inventory acquisitions.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-card border-border/60 hover:border-primary/40 rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                <BookMarked className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">Curated Lists & Reviews</h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Librarian-curated reading collections alongside moderated member ratings and written
                book reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Impact Comparison */}
      <section id="impact" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-primary text-xs font-semibold tracking-wider uppercase">
              Digital Transformation
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              From Paper Registers to Instant Digital Access
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Old Way */}
            <div className="border-border/60 bg-muted/40 rounded-2xl border p-8">
              <div className="text-destructive flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 rotate-180 opacity-70" />
                <h3 className="text-xl font-bold">The Previous Manual System</h3>
              </div>
              <ul className="text-muted-foreground mt-6 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">•</span>
                  <span>
                    Physical card registers & 20-entry passbooks causing administrative bottlenecks.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">•</span>
                  <span>
                    Librarians forced to work on Sundays just to reconcile loan registers manually.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">•</span>
                  <span>Members physically browsing racks to check if a book is available.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-destructive font-bold">•</span>
                  <span>
                    Informal, verbal hold requests leading to queue confusion and lost records.
                  </span>
                </li>
              </ul>
            </div>

            {/* New Way */}
            <div className="border-primary/40 bg-card rounded-2xl border p-8 shadow-sm">
              <div className="text-primary flex items-center gap-3">
                <Zap className="h-6 w-6" />
                <h3 className="text-xl font-bold">The RVK Digital Platform</h3>
              </div>
              <ul className="text-foreground mt-6 space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span>Automated digital member accounts with continuous online access.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    Automated tracking frees the librarian to focus on reading curation & student
                    guidance.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    Instant search across 5,000+ titles with real-time stock status from any device.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                  <span>
                    Fair, automated hold queues with automated notifications when items are
                    returned.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Role Portals Section */}
      <section id="roles" className="bg-muted/30 border-border/50 border-y py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-primary text-xs font-semibold tracking-wider uppercase">
              Tailored Portals
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Built for RVK Campus & Community
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* Role 1 */}
            <div className="bg-card border-border/60 flex flex-col justify-between rounded-2xl border p-6">
              <div>
                <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Students & Members</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Search catalog, track current loans, place digital holds, submit purchase
                  requests, and post book reviews.
                </p>
              </div>
              <div className="border-border/40 mt-6 border-t pt-4">
                <Link
                  to="/register"
                  className="text-primary inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                >
                  Register as Member <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Role 2 */}
            <div className="bg-card border-border/60 flex flex-col justify-between rounded-2xl border p-6">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                  <BookOpenCheck className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Librarian Operations</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  ISBN auto-fill book cataloging, barcode checkouts, fine calculations, purchase
                  prioritization & reading lists.
                </p>
              </div>
              <div className="border-border/40 mt-6 border-t pt-4">
                <Link
                  to="/login"
                  className="text-primary inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                >
                  Librarian Login <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Role 3 */}
            <div className="bg-card border-border/60 flex flex-col justify-between rounded-2xl border p-6">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold">Campus Management</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Real-time budget utilization reports, periodical subscriptions oversight, and
                  institutional metrics.
                </p>
              </div>
              <div className="border-border/40 mt-6 border-t pt-4">
                <Link
                  to="/login"
                  className="text-primary inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                >
                  Management Portal <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote / Good Vibes Banner */}
      <section id="community" className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="bg-primary/10 text-primary mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl">
            <Quote className="h-6 w-6" />
          </div>
          <blockquote className="text-foreground text-xl leading-relaxed font-medium sm:text-2xl">
            "Automating clerical tasks allows our library team to dedicate their energy to fostering
            a vibrant reading culture across Rashtrotthana Vidya Kendra."
          </blockquote>
          <div className="text-muted-foreground mt-4 text-sm font-semibold">
            RVK Campus Library Ecosystem
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="bg-card border-border/50 border-t py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Explore RVK Library?
          </h2>
          <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-base">
            Access your personalized portal to borrow books, check active holds, or manage library
            operations today.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            {user ? (
              <Button asChild size="lg" className="gap-2 px-8">
                <Link to={getDashboardPath()}>
                  <LayoutDashboard className="h-5 w-5" />
                  Go to Dashboard
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg" className="gap-2 px-8">
                  <Link to="/register">
                    Get Started <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="px-8">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 border-border/50 text-muted-foreground border-t py-8 text-center text-xs">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2 font-medium">
            <BookOpen className="text-primary h-4 w-4" />
            <span>Rashtrotthana Vidya Kendra (RVK) Library Management System</span>
          </div>
          <div>© {CURRENT_YEAR} RVK Library. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
