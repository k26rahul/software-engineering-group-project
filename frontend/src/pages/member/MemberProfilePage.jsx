import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuthStore from "@/store/authStore";
import useMemberStore from "@/store/memberStore";
import {
  User,
  Phone,
  Mail,
  Award,
  Calendar,
  CheckCircle2,
  History,
  AlertCircle,
  AlertTriangle,
  CreditCard,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

function ProfileForm({ profile, memberId, updateProfile, error }) {
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Name cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      const updatedProfile = await updateProfile(memberId, name, phone);

      // Sync changes to the authStore to keep the UI shell name in sync
      useAuthStore.setState((state) => ({
        user: { ...state.user, name: updatedProfile.name, phone: updatedProfile.phone },
      }));

      setSuccessMsg("Profile details updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setErrorMsg(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const currentError = errorMsg || error;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <User className="text-primary h-5 w-5" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Update your contact details below. Fields marked as read-only are locked by
          administration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          {successMsg && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-medium text-emerald-500">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
          {currentError && (
            <div className="bg-destructive/10 border-destructive/20 text-destructive flex items-center gap-2 rounded-xl border p-4 text-sm font-medium">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{currentError}</span>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-muted/50 cursor-not-allowed pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-semibold">
                Role
              </Label>
              <div className="relative">
                <Award className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  id="role"
                  value={profile?.role || ""}
                  disabled
                  className="bg-muted/50 cursor-not-allowed pl-9 uppercase"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-semibold">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  className="border-border pl-9"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default function MemberProfilePage() {
  const user = useAuthStore((state) => state.user);
  const { profile, history, pendingFines, loading, error, fetchProfileAndHistory, updateProfile } =
    useMemberStore();

  const memberId = user?.id || 1;

  useEffect(() => {
    fetchProfileAndHistory(memberId);
  }, [memberId, fetchProfileAndHistory]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg font-medium">
          Loading profile details...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="from-primary to-primary-foreground bg-linear-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          My Account & Profile
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your personal details, membership credentials, and view borrowing history.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column: Personal Details Form & Borrowing History */}
        <div className="flex flex-col gap-6 md:col-span-2">
          {profile && (
            <ProfileForm
              key={profile.id}
              profile={profile}
              memberId={memberId}
              updateProfile={updateProfile}
              error={error}
            />
          )}

          {/* Pending Fines Section */}
          {pendingFines && pendingFines.length > 0 && (
            <Card className="border-amber-500/50">
              <CardHeader className="bg-amber-500/10 border-b border-amber-500/20 pb-4">
                <CardTitle className="text-amber-700 flex items-center gap-2 text-xl font-bold">
                  <AlertTriangle className="h-5 w-5" />
                  Action Required: Pending Fines
                </CardTitle>
                <CardDescription className="text-amber-700/80">
                  You have outstanding fines that need to be settled. Returns and new checkouts may be blocked.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  {pendingFines.map((fine) => (
                    <div key={fine.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border bg-white shadow-sm gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 shrink-0 rounded-lg p-2 bg-destructive/10 text-destructive">
                          <AlertCircle className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-foreground font-semibold">{fine.book_title || `Transaction #${fine.transaction_id}`}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${fine.status === 'OVERDUE' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
                              {fine.status === "OVERDUE" ? "Overdue Return" : "Active"}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground font-medium">Condition: {fine.reason}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                        <div className="text-left sm:text-right">
                          <p className="text-muted-foreground text-xs">Amount Due</p>
                          <p className="text-lg font-bold text-destructive">
                            ₹{fine.amount.toFixed(2)}
                          </p>
                        </div>
                        <Button asChild className="shrink-0 gap-2">
                          <Link to={`/member/fines/${fine.id}/pay`}>
                            <CreditCard className="h-4 w-4" />
                            Pay Now
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Borrowing History Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <History className="text-primary h-5 w-5" />
                Borrowing History
              </CardTitle>
              <CardDescription>
                A record of all the books you've checked out and returned.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-muted-foreground py-6 text-center text-sm">
                  No borrowing history available.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-border text-muted-foreground border-b font-semibold">
                        <th className="px-4 py-3">Book Title</th>
                        <th className="px-4 py-3">Issued Date</th>
                        <th className="px-4 py-3">Due Date</th>
                        <th className="px-4 py-3">Return Date</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr
                          key={item.transaction_id}
                          className="border-border hover:bg-muted/30 border-b transition-all last:border-0"
                        >
                          <td className="text-foreground px-4 py-3 font-medium">
                            {item.book_title}
                          </td>
                          <td className="text-muted-foreground px-4 py-3">{formatDate(item.issue_date)}</td>
                          <td className="text-muted-foreground px-4 py-3">{formatDate(item.due_date)}</td>
                          <td className="text-muted-foreground px-4 py-3">
                            {item.return_date ? formatDate(item.return_date) : "-"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                item.is_overdue
                                  ? "bg-destructive/15 text-destructive"
                                  : "bg-emerald-500/15 text-emerald-600"
                              }`}
                            >
                              {item.is_overdue ? "Overdue" : "Returned"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column: Membership Status Card */}
        <div className="flex flex-col gap-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Award className="text-primary h-5 w-5" />
                Membership Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-border flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground text-sm">Type</span>
                <span className="text-sm font-semibold capitalize">
                  {profile?.membership_type?.replace("_", " ") || "ON CAMPUS"}
                </span>
              </div>
              <div className="border-border flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground text-sm">Status</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    profile?.is_active
                      ? "bg-emerald-500/15 text-emerald-600"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {profile?.is_active ? "Active" : "Pending Approval"}
                </span>
              </div>
              <div className="border-border flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground text-sm">Join Date</span>
                <span className="flex items-center gap-1 text-sm font-semibold">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  {profile?.created_at ? formatDate(profile.created_at) : "-"}
                </span>
              </div>
              <div className="border-border flex items-center justify-between border-b py-2">
                <span className="text-muted-foreground text-sm">Max Books Limit</span>
                <span className="text-sm font-semibold">{profile?.max_issue_limit || 5} books</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground text-sm">Cycle Renewal</span>
                <span className="font-mono text-sm font-semibold">
                  {profile?.membership_start_date ? formatDate(profile.membership_start_date) : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
