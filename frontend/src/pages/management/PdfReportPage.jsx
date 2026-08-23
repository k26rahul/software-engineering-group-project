import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import useReportsStore from "@/store/reportsStore";
import useAuthStore from "@/store/authStore";
import { Button } from "@/components/ui/button";
import { Printer, Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PdfReportPage() {
  const { type } = useParams();
  const user = useAuthStore((state) => state.user);
  const { usageReport, expenseReport, isLoading, fetchReportsData } = useReportsStore();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await fetchReportsData();
      setDataLoaded(true);
    };
    loadData();
  }, [fetchReportsData]);

  if (!user || user.role !== "CAMPUS_MANAGEMENT") {
    return <Navigate to="/login" replace />;
  }

  if (isLoading || !dataLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Decide what to render based on `type`
  // We'll provide a comprehensive view that can serve all types, or specialized views if needed.
  
  return (
    <div className="min-h-screen bg-slate-50 py-8 font-sans">
      <style>
        {`
          @media print {
            body {
              background: white;
            }
            .no-print {
              display: none !important;
            }
            .print-page {
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
        `}
      </style>
      
      {/* Top Action Bar (Hidden in Print) */}
      <div className="no-print mb-8 flex justify-center">
        <Button onClick={handlePrint} size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
          <Printer className="h-5 w-5" />
          Print as PDF
        </Button>
      </div>

      {/* A4 Sized Container for Print */}
      <div className="print-page mx-auto w-full max-w-4xl bg-white p-12 shadow-xl">
        {/* Header */}
        <div className="border-b-2 border-slate-200 pb-6 mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">RVK Library</h1>
            <p className="text-slate-500 mt-2 text-lg">Official Campus Management Report</p>
          </div>
          <div className="text-right">
            <p className="text-slate-600 font-medium">Date: {currentDate}</p>
            <p className="text-slate-500 text-sm">Report Type: <span className="uppercase font-semibold">{type.replace('_', ' ')}</span></p>
          </div>
        </div>

        {/* Content Section based on Type */}
        {(type === "pdf" || type === "monthly_audit") && (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-6">Circulation Summary</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Total Checkouts</p>
                  <p className="text-3xl font-bold text-indigo-700 mt-1">{usageReport?.summary?.total_checkouts || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Active Borrowers</p>
                  <p className="text-3xl font-bold text-emerald-600 mt-1">{usageReport?.summary?.active_borrowers || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Return Rate</p>
                  <p className="text-3xl font-bold text-blue-600 mt-1">{usageReport?.summary?.return_rate_percentage || 0}%</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Top Genre</p>
                  <p className="text-xl font-bold text-amber-600 mt-2 line-clamp-1">{usageReport?.summary?.popular_category || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-emerald-500 pl-3 mb-6">Financial Overview</h2>
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Budget Alloc.</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">₹{expenseReport?.summary?.total_budget?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Total Spent</p>
                  <p className="text-2xl font-bold text-rose-600 mt-1">₹{expenseReport?.summary?.total_spent?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Fine Income</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">₹{expenseReport?.summary?.fine_income?.toLocaleString() || 0}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="text-sm text-slate-500 uppercase font-semibold">Net Spend</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">₹{expenseReport?.summary?.net_spend?.toLocaleString() || 0}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-blue-500 pl-3 mb-6">Top Borrowed Books</h2>
              <Table className="border rounded-lg overflow-hidden">
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700">Rank</TableHead>
                    <TableHead className="font-bold text-slate-700">Title</TableHead>
                    <TableHead className="font-bold text-slate-700">Author</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Checkouts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageReport?.top_borrowed_books?.slice(0, 8).map((book, idx) => (
                    <TableRow key={book.id}>
                      <TableCell className="font-semibold text-slate-500">#{idx + 1}</TableCell>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell className="text-slate-600">{book.author}</TableCell>
                      <TableCell className="text-right font-bold text-indigo-600">{book.checkouts}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {type === "category_analytics" && (
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 border-l-4 border-indigo-500 pl-3 mb-6">Category Breakdown</h2>
              <Table className="border rounded-lg overflow-hidden">
                <TableHeader className="bg-slate-100">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700">Category Name</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Checkouts</TableHead>
                    <TableHead className="font-bold text-slate-700 text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usageReport?.category_breakdown?.map((cat, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{cat.category}</TableCell>
                      <TableCell className="text-right font-semibold">{cat.checkouts}</TableCell>
                      <TableCell className="text-right text-slate-600">{cat.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>This document is computer generated and strictly confidential.</p>
          <p>Generated by RVK Library Management System</p>
        </div>
      </div>
    </div>
  );
}
