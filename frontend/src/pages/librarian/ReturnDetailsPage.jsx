import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2, RefreshCw, AlertTriangle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import useTransactionStore from "@/store/transactionStore";
import { formatDate } from "@/lib/utils";

export default function ReturnDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTransactions, initiateReturn, getReturnFine, completeReturn } = useTransactionStore();

  const [transaction, setTransaction] = useState(location.state?.transaction || null);
  const [condition, setCondition] = useState("GOOD");
  
  const [step, setStep] = useState(1); // 1: Select condition, 2: Payment/QR, 3: Completed
  const [pendingFine, setPendingFine] = useState(null);
  const [isInitiating, setIsInitiating] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    if (!transaction) {
      // Try to find it in activeTransactions
      const tx = activeTransactions.find(t => t.transaction_id.toString() === id);
      if (tx) {
        setTransaction(tx);
      } else {
        toast.error("Transaction not found");
        navigate("/librarian/return");
      }
    }
  }, [id, transaction, activeTransactions, navigate]);

  const handleInitiateReturn = async () => {
    if (!transaction) return;
    setIsInitiating(true);
    try {
      const res = await initiateReturn(transaction.transaction_id, condition);
      if (res.fine_amount > 0) {
        setPendingFine({ amount: res.fine_amount, id: res.fine_id, is_paid: false });
        setStep(2);
      } else {
        // No fine, can just complete immediately or move to step 3
        handleCompleteReturn();
      }
    } catch (err) {
      toast.error(err.message || "Failed to initiate return.");
    } finally {
      setIsInitiating(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!transaction || !pendingFine) return;
    setIsCheckingPayment(true);
    try {
      const fine = await getReturnFine(transaction.transaction_id);
      if (!fine || fine.is_paid) {
        setPendingFine(prev => ({ ...prev, is_paid: true }));
        toast.success("Payment confirmed!");
      } else {
        toast.info("Payment not received yet.");
      }
    } catch (err) {
      toast.error("Could not check payment status.");
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleCompleteReturn = async () => {
    if (!transaction) return;
    setIsCompleting(true);
    try {
      await completeReturn(transaction.transaction_id);
      setStep(3);
      toast.success("Return processed successfully.");
    } catch (err) {
      toast.error(err.message || "Failed to complete return.");
    } finally {
      setIsCompleting(false);
    }
  };

  if (!transaction) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/librarian/return")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Process Return Details</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review transaction and confirm condition.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Summary</CardTitle>
          <CardDescription>Transaction #{transaction.transaction_id}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Book Title</Label>
            <p className="font-medium">{transaction.book_title}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Member</Label>
            <p className="font-medium">{transaction.member_name}</p>
            <p className="text-xs text-muted-foreground">{transaction.member_email}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Issue Date</Label>
            <p className="font-medium">{formatDate(transaction.issue_date)}</p>
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Due Date</Label>
            <p className="font-medium">{formatDate(transaction.due_date)}</p>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label className="text-muted-foreground text-xs">Status</Label>
            <div className="mt-1">
              {transaction.is_overdue ? (
                <div className="flex flex-col gap-1 items-start">
                  <Badge variant="outline" className="border-destructive bg-destructive/10 text-destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {transaction.days_overdue} days overdue
                  </Badge>
                  <span className="text-xs text-muted-foreground ml-1">
                    Late fee: ₹2.00 per day
                  </span>
                </div>
              ) : (
                <Badge variant="outline" className="border-emerald-500 bg-emerald-500/10 text-emerald-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  On time
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {step === 1 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Book Condition</CardTitle>
            <CardDescription>Select the condition of the returned book.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={condition} onValueChange={setCondition} className="gap-4">
              <div 
                className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${condition === 'GOOD' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                onClick={() => setCondition('GOOD')}
              >
                <RadioGroupItem value="GOOD" id="c-good" />
                <Label htmlFor="c-good" className="flex-1 cursor-pointer font-medium pointer-events-none">Good / Normal Wear</Label>
              </div>
              
              <div 
                className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${condition === 'DAMAGED' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                onClick={() => setCondition('DAMAGED')}
              >
                <RadioGroupItem value="DAMAGED" id="c-damaged" />
                <Label htmlFor="c-damaged" className="flex-1 cursor-pointer font-medium flex flex-col items-start text-left gap-1 pointer-events-none">
                  <span>Damaged</span>
                  <span className="text-xs text-muted-foreground">Applies a flat ₹15 fine.</span>
                </Label>
              </div>
              
              <div 
                className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${condition === 'LOST' ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                onClick={() => setCondition('LOST')}
              >
                <RadioGroupItem value="LOST" id="c-lost" />
                <Label htmlFor="c-lost" className="flex-1 cursor-pointer font-medium flex flex-col items-start text-left gap-1 pointer-events-none">
                  <span>Lost</span>
                  <span className="text-xs text-muted-foreground">Applies a flat ₹50 replacement fee.</span>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6 bg-muted/20">
            <Button onClick={handleInitiateReturn} disabled={isInitiating}>
              {isInitiating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Calculate Fine & Continue
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && pendingFine && (
        <Card className="border-amber-500/50 animate-fade-in">
          <CardHeader className="bg-amber-500/10 border-b border-amber-500/20">
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" /> Pending Fine Payment
            </CardTitle>
            <CardDescription className="text-amber-700/80">
              A fine has been calculated for this transaction. The member must pay this before the return can be finalized.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="text-center space-y-3">
              <div className="text-5xl font-bold text-amber-600">₹{pendingFine.amount.toFixed(2)}</div>
              
              {transaction?.is_overdue && (
                <div className="text-xs font-medium text-amber-700/80 bg-amber-500/10 px-3 py-1.5 rounded-md inline-block">
                  <span className="block mb-0.5 font-bold border-b border-amber-500/20 pb-0.5 mb-1">Fine Breakdown</span>
                  <div className="flex justify-between gap-4">
                    <span>Late fee ({transaction.days_overdue} days @ ₹2/day):</span>
                    <span>₹{(transaction.days_overdue * 2).toFixed(2)}</span>
                  </div>
                  {(pendingFine.amount - transaction.days_overdue * 2) > 0 && (
                    <div className="flex justify-between gap-4">
                      <span>Condition fee:</span>
                      <span>₹{(pendingFine.amount - transaction.days_overdue * 2).toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto pt-2">
                Ask the member to scan this QR code to pay instantly, or they can log in to their dashboard to pay.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border shadow-sm relative">
              {pendingFine.is_paid && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-10 animate-fade-in">
                  <div className="flex flex-col items-center text-emerald-600 font-bold">
                    <CheckCircle className="h-12 w-12 mb-2" />
                    PAID
                  </div>
                </div>
              )}
              {/* Fake QR Code */}
              <div className="h-48 w-48 bg-muted flex items-center justify-center border-4 border-black border-dashed rounded-lg">
                <QrCode className="h-24 w-24 text-muted-foreground/50" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6 bg-muted/20">
            <Button 
              variant="outline" 
              onClick={checkPaymentStatus} 
              disabled={isCheckingPayment || pendingFine.is_paid}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isCheckingPayment ? "animate-spin" : ""}`} />
              Refresh Status
            </Button>
            
            <Button 
              onClick={handleCompleteReturn} 
              disabled={!pendingFine.is_paid || isCompleting}
              className={pendingFine.is_paid ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
            >
              {isCompleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Return
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 3 && (
        <Card className="border-emerald-500/50 bg-emerald-500/5 animate-fade-in">
          <CardContent className="pt-12 pb-12 flex flex-col items-center text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-emerald-500" />
            <div>
              <h2 className="text-2xl font-bold text-emerald-700">Return Processed</h2>
              <p className="text-emerald-700/80 mt-1">
                The book has been successfully marked as returned.
              </p>
            </div>
            <Button className="mt-4" onClick={() => navigate("/librarian/return")}>
              Back to Active Checkouts
            </Button>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
