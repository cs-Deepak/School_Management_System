import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Search,
  User,
  CheckCircle,
  ChevronRight,
  AlertCircle,
  BookOpen,
  CreditCard,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import { useToast } from "../context/ToastContext";
import { cn } from "../utils/cn";
import { formatToINR } from "../utils/format";

const FeeCollection = () => {
  const { addToast } = useToast();
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [currentStep, setCurrentStep] = useState("selector"); // selector, active
  const [selectedMonth, setSelectedMonth] = useState("");
  const [academicYear, setAcademicYear] = useState("2025-26");
  const [classSummary, setClassSummary] = useState(null);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get("/admin/classes");
        if (res.data.success) {
          setClasses(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Fetch class summary when selectedClass changes
  useEffect(() => {
    const fetchClassSummary = async () => {
      if (!selectedClass) {
        setClassSummary(null);
        return;
      }
      setIsSummaryLoading(true);
      try {
        const res = await api.get(`/admin/classes/${selectedClass}/summary`);
        if (res.data.success) {
          setClassSummary(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching class summary:", error);
      } finally {
        setIsSummaryLoading(false);
      }
    };
    fetchClassSummary();
    // Reset student and current step when class changes
    setStudent(null);
    setCurrentStep("selector");
  }, [selectedClass]);

  const handleSearch = async () => {
    if (!selectedClass) {
      addToast("Please select a class first", "error");
      return;
    }
    if (!searchQuery) return;
    setLoading(true);

    try {
      const res = await api.get(`/fees/${selectedClass}/${searchQuery}`);
      if (res.data.success) {
        const {
          student: s,
          feeSummary,
          ledger,
          transactions: txs,
        } = res.data.data;
        setStudent({
          id: s.id,
          name: s.fullName,
          roll: s.rollNumber,
          totalFee: feeSummary.totalFee,
          paidFee: feeSummary.paidFee,
          dueFee: feeSummary.dueFee,
          class: s.class,
          ledger: ledger,
        });
        setTransactions(txs || []);

        // Auto-select first unpaid month
        const firstUnpaid = ledger?.monthlyBreakdown.find(
          (m) => m.status !== "PAID",
        );
        if (firstUnpaid) {
          setSelectedMonth(firstUnpaid.month);
          setAmount(firstUnpaid.pending.toString());
        }

        addToast("Student record accessed", "success");
        setCurrentStep("active");
      }
    } catch (error) {
      console.error("Fetch Student Error:", error);
      addToast(`Student "${searchQuery}" not found in this class`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    if (!amount || amount <= 0) return;

    if (!selectedMonth) {
      addToast("Please select a month to pay", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/fees/pay", {
        studentId: student.id,
        amount: parseFloat(amount),
        type: "Tuition",
        paymentMode: paymentMode,
        month: selectedMonth,
        academicYear: academicYear,
        transactionId:
          "TXN-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
        remarks: `Fee paid for ${selectedMonth} via Finance Portal`,
      });

      if (res.data.success) {
        const { transaction: tx } = res.data.data;
        setTransaction(tx);
        setIsSuccessModalOpen(true);
        addToast("Transaction processed successfully", "success");
        // Reload student data to refresh ledger
        handleSearch();
      }
    } catch (error) {
      console.error("Payment Error:", error);
      addToast("Failed to process payment", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = async (txId) => {
    if (!txId) return;
    try {
      const response = await api.get(`/fees/receipt/${txId}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt-${txId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download Error:", error);
      addToast("Failed to download receipt", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] p-4 sm:p-8 animate-in fade-in duration-500">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 1. LEFT PANEL: Student Fee Lookup */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                  Student Fee Lookup
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">
                    Select Class
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full h-11 px-3 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls._id} value={cls._id}>
                        {cls.name} ({cls.section || "No Section"}) —{" "}
                        {cls.students?.length || 0} Students
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">
                    Search by Roll No / Student Name
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={16}
                    />
                    <input
                      type="text"
                      placeholder=""
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full h-11 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleSearch}
                  loading={loading}
                  disabled={!selectedClass || !searchQuery}
                  className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 group"
                >
                  Search Student
                  <ChevronRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* 2. CENTER PANEL: Illustration / Dynamic Content */}
          <div className="lg:col-span-4">
            {currentStep === "selector" ? (
              !selectedClass ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 h-full min-h-[500px] flex flex-col items-center justify-center text-center">
                  <div className="w-48 h-48 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-10 relative">
                    <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                      <div className="w-40 h-40 bg-blue-50 rounded-full blur-2xl opacity-50"></div>
                    </div>
                    <div className="relative z-10 scale-150">
                      <BookOpen
                        size={64}
                        className="text-blue-500"
                        strokeWidth={1}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Search a student to view fee details
                  </h3>
                  <p className="text-sm text-gray-500 font-medium italic">
                    Enter Roll No or Name to fetch student information.
                  </p>
                </div>
              ) : isSummaryLoading ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 h-full min-h-[500px] flex flex-col items-center justify-center text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                    Loading Class Summary...
                  </p>
                </div>
              ) : classSummary ? (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-sm font-bold text-gray-700 tracking-tight uppercase">
                        Class Overview: {classSummary.className}
                      </h3>
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase">
                        Academic Year {academicYear}
                      </span>
                    </div>
                    <div className="p-8">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                            Total Students
                          </p>
                          <p className="text-2xl font-black text-gray-900">
                            {classSummary.studentCount}
                          </p>
                        </div>
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                            Expected Revenue
                          </p>
                          <p className="text-2xl font-black text-blue-900">
                            {formatToINR(classSummary.totalExpected)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="relative h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-1000"
                            style={{
                              width: `${(classSummary.totalCollected / classSummary.totalExpected) * 100 || 0}%`,
                            }}
                          ></div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Collected
                              </p>
                            </div>
                            <p className="text-lg font-black text-emerald-600">
                              {formatToINR(classSummary.totalCollected)}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center justify-end gap-2 mb-1">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                Pending
                              </p>
                              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            </div>
                            <p className="text-lg font-black text-amber-600">
                              {formatToINR(classSummary.totalPending)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-600 rounded-xl p-8 text-white shadow-lg shadow-blue-200 relative overflow-hidden group">
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <h4 className="text-lg font-bold mb-2 relative z-10">
                      Quick Actions
                    </h4>
                    <p className="text-sm font-medium text-blue-100 mb-6 relative z-10 opacity-80">
                      Search for a specific student to record their monthly fee
                      and generate a digital receipt.
                    </p>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest relative z-10">
                      <Search size={14} />
                      Use the search bar on the left
                    </div>
                  </div>
                </div>
              ) : null
            ) : (
              <div className="space-y-6">
                {/* Student Details Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 tracking-tight uppercase">
                      Student Details
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-5">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                        {student.image ? (
                          <img
                            src={student.image}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={40} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h2 className="text-xl font-bold text-gray-900">
                            {student.name}
                          </h2>
                          {student.dueFee <= 0 ? (
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold border border-emerald-100">
                              Fees Cleared
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold border border-amber-100">
                              Pending Fees
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-500 mt-1">
                          Roll No:{" "}
                          <span className="text-gray-900">{student.roll}</span>
                        </p>
                        <p className="text-sm font-bold text-gray-500">
                          Class:{" "}
                          <span className="text-gray-900">{student.class}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Summary Card */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 tracking-tight uppercase">
                      Fee Summary
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-3">
                      {[
                        {
                          label: "Monthly Fee",
                          value:
                            student.ledger?.monthlyBreakdown?.[0]?.amount || 0,
                        },
                        { label: "Transport Fee", value: 0 },
                        { label: "Other charges", value: 0 },
                      ].map((fee, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm"
                        >
                          <span className="text-gray-500 font-medium flex items-center gap-2">
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>{" "}
                            {fee.label}
                          </span>
                          <span className="text-gray-900 font-bold">
                            ₹ {fee.value.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>{" "}
                        Months Due:
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        {(student.ledger?.monthlyBreakdown || [])
                          .filter((m) => m.status !== "PAID")
                          .map((m) => m.month.substring(0, 3))
                          .join(", ") || "None"}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium flex items-center gap-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>{" "}
                        Total Due:
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {formatToINR(Math.max(0, student.dueFee))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. RIGHT PANEL: Payment Section (Active Only) */}
          <div className="lg:col-span-5">
            {currentStep !== "selector" && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-full">
                  <div className="px-6 py-4 bg-[#F8FAFC] border-b border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 tracking-tight uppercase">
                      Collect Payment
                    </h3>
                  </div>
                  <div className="p-8 space-y-8">
                    <div className="space-y-3">
                      <label className="text-sm text-gray-700 font-bold">
                        Select Payment Month
                      </label>
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {(student.ledger?.monthlyBreakdown || []).map((m) => (
                          <button
                            key={m.month}
                            type="button"
                            onClick={() => {
                              setSelectedMonth(m.month);
                              setAmount(m.pending.toString());
                            }}
                            disabled={m.status === "PAID"}
                            className={cn(
                              "relative py-2 px-1 rounded-lg text-[10px] font-bold uppercase transition-all border",
                              selectedMonth === m.month
                                ? "bg-blue-600 border-blue-600 text-white shadow-md z-10"
                                : m.status === "PAID"
                                  ? "bg-green-50 border-green-100 text-green-500 cursor-not-allowed opacity-60"
                                  : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50",
                            )}
                          >
                            {m.month.substring(0, 3)}
                            {m.status === "PAID" && (
                              <div className="absolute -top-1 -right-1 bg-green-500 text-white w-3 h-3 rounded-full flex items-center justify-center border border-white">
                                <CheckCircle size={8} />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 h-14 px-4 border border-gray-300 rounded-lg">
                      <label className="text-sm text-gray-600 font-medium">
                        Amount to Collect
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="w-24 text-xl font-bold text-gray-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm text-gray-700 font-bold">
                        Payment Mode
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            id: "CASH",
                            label: "Cash",
                            icon: <CreditCard size={18} />,
                          },
                          {
                            id: "CARD",
                            label: "Card",
                            icon: <CreditCard size={18} />,
                          },
                          { id: "ONLINE", label: "Online", icon: null },
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => setPaymentMode(mode.id)}
                            className={cn(
                              "h-12 border rounded-lg flex items-center justify-center gap-2 text-sm font-bold transition-all",
                              paymentMode === mode.id
                                ? "bg-[#2563EB] border-[#2563EB] text-white"
                                : "bg-white border-gray-300 text-gray-700 hover:border-gray-400",
                            )}
                          >
                            {mode.icon} {mode.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePayment()}
                      loading={loading}
                      className="w-full h-14 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-lg text-lg font-bold flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/10"
                    >
                      Confirm & Generate Receipt
                      <ChevronRight
                        size={22}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </Button>
                  </div>
                </div>

                {/* Mobile Transactions Table (shown below collection) */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-tight mb-4">
                    Recent Settlements
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs font-bold text-gray-400 border-b border-gray-50">
                          <th className="py-3">Receipt</th>
                          <th className="py-3">Month</th>
                          <th className="py-3">Amount</th>
                          <th className="py-3 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {transactions.slice(0, 5).map((tx) => (
                          <tr
                            key={tx._id}
                            className="text-xs font-medium text-gray-600"
                          >
                            <td className="py-3 text-blue-600 font-bold">
                              {tx.receiptNumber ||
                                tx._id.toString().slice(-6).toUpperCase()}
                            </td>
                            <td className="py-3">{tx.month}</td>
                            <td className="py-3 font-bold text-gray-900">
                              {formatToINR(tx.amount)}
                            </td>
                            <td className="py-3 text-right">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal remains similar but cleaner */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        maxWidth="md"
        className="rounded-xl"
        footer={
          <div className="flex gap-3 w-full">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-[#2563EB]"
              onClick={() => handleDownloadReceipt(transaction?._id)}
            >
              Print Receipt
            </Button>
          </div>
        }
      >
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Successful
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Receipt has been generated for {student?.name}
          </p>

          <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4">
            <div className="flex justify-between">
              <span className="text-xs text-gray-400 font-bold uppercase">
                Transaction ID
              </span>
              <span className="text-sm font-bold text-gray-900">
                {transaction?._id?.toString().toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400 font-bold uppercase">
                Amount Paid
              </span>
              <span className="text-sm font-bold text-gray-900">
                {formatToINR(transaction?.amount || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400 font-bold uppercase">
                Period
              </span>
              <span className="text-sm font-bold text-gray-900">
                {transaction?.month} {transaction?.academicYear}
              </span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FeeCollection;
