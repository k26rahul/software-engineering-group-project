import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, CreditCard, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import useMemberStore from "@/store/memberStore";

export default function MemberPaymentPage() {
  const { fineId } = useParams();
  const navigate = useNavigate();
  const { pendingFines, payFine, fetchPendingFines } = useMemberStore();

  const [fine, setFine] = useState(null);
  const [isPaying, setIsPaying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // If pendingFines is empty, we might need to fetch it (e.g. if page is refreshed)
    if (pendingFines.length === 0) {
      fetchPendingFines();
    }
  }, [fetchPendingFines, pendingFines.length]);

  useEffect(() => {
    if (pendingFines.length > 0) {
      const foundFine = pendingFines.find((f) => f.id.toString() === fineId);
      if (foundFine) {
        setFine(foundFine);
      } else {
        toast.error("Fine not found or already paid.");
        navigate("/member/profile");
      }
    }
  }, [fineId, pendingFines, navigate]);

  const handleSimulatePayment = async () => {
    if (!fine) return;
    setIsPaying(true);
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await payFine(fine.id, fine.amount);
      setIsSuccess(true);
      toast.success("Payment successful!");
    } catch (err) {
      toast.error(err.message || "Failed to process payment.");
      setIsPaying(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col gap-6 max-w-2xl mx-auto w-full pt-12">
        <Card className="border-emerald-500/50 bg-emerald-500/5 animate-fade-in shadow-lg">
          <CardContent className="pt-12 pb-12 flex flex-col items-center text-center space-y-4">
            <CheckCircle className="h-20 w-20 text-emerald-500" />
            <div>
              <h2 className="text-3xl font-bold text-emerald-700">Payment Successful!</h2>
              <p className="text-emerald-700/80 mt-2 text-lg">
                Your fine of ₹{fine?.amount.toFixed(2)} has been paid.
              </p>
              <p className="text-emerald-700/60 mt-1 text-sm">
                The librarian can now complete the book return process.
              </p>
            </div>
            <Button className="mt-6" size="lg" onClick={() => navigate("/member/profile")}>
              Return to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!fine) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/member/profile")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Pay Fine</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Complete your payment to clear outstanding dues.
          </p>
        </div>
      </div>

      <Card className="border-border shadow-md animate-fade-in">
        <CardHeader className="border-b bg-muted/10 pb-6">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Transaction #{fine.transaction_id}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 flex flex-col md:flex-row gap-8 items-center justify-center">
          <div className="text-center space-y-4 md:w-1/2">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Amount Due</div>
            <div className="text-6xl font-bold text-foreground">₹{fine.amount.toFixed(2)}</div>
            <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg inline-block mt-2">
              Reason: {fine.reason}
            </div>
            <p className="text-sm text-muted-foreground max-w-[250px] mx-auto pt-4">
              Scan the QR code with any UPI app to pay instantly.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-xl border-2 shadow-sm relative md:w-1/2 flex justify-center">
            {/* Fake QR Code */}
            <div className="h-56 w-56 bg-muted flex flex-col gap-2 items-center justify-center border-4 border-black border-dashed rounded-lg">
              <QrCode className="h-28 w-28 text-muted-foreground/30" />
              <span className="text-xs text-muted-foreground font-mono">SCAN TO PAY</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6 bg-muted/10">
          <Button variant="outline" onClick={() => navigate("/member/profile")}>
            Cancel
          </Button>
          <Button onClick={handleSimulatePayment} disabled={isPaying} size="lg" className="px-8">
            {isPaying ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="mr-2 h-4 w-4" />
            )}
            {isPaying ? "Processing..." : "Simulate Payment"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
