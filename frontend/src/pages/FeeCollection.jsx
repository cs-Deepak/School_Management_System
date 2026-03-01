import React, { useState, useEffect } from "react";
import api from "../services/api";
import {
  Wallet,
  Search,
  User,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Banknote,
  ShieldCheck,
  TrendingDown,
  Clock,
  Receipt,
} from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import FeeReceiptPremium from "../components/ui/FeeReceiptPremium";
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
  const [paymentMode, setPaymentMode] = useState("online");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const [currentStep, setCurrentStep] = useState("selector"); // selector, profile, payment

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

  const handleFetchStudent = async () => {
    if (!selectedClass) {
      addToast("Please select a class first", "error");
      return;
    }
    if (!searchQuery) return;
    setLoading(true);

    try {
      // Backend expects /api/fees/:classId/:rollNumber
      const res = await api.get(`/fees/${selectedClass}/${searchQuery}`);
      if (res.data.success) {
        const { student, feeSummary } = res.data.data;
        setStudent({
          id: student.id,
          name: student.fullName,
          roll: student.rollNumber,
          totalFee: feeSummary.totalFee,
          paidFee: feeSummary.paidFee,
          dueFee: feeSummary.dueFee,
          class: student.class,
        });
        addToast("Student record accessed", "success");
        setCurrentStep("profile");
      }
    } catch (error) {
      console.error("Fetch Student Error:", error);
      addToast(`Student "${searchQuery}" not found in this class`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    setLoading(true);
    try {
      const res = await api.post("/fees/pay", {
        studentId: student.id,
        amount: parseFloat(amount),
        type: "Tuition",
        paymentMode: paymentMode,
        transactionId:
          "TXN-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
        remarks: "Fee paid via ERP terminal",
      });

      if (res.data.success) {
        const { transaction } = res.data.data;
        setTransaction({
          id:
            transaction.receiptNumber ||
            transaction.transactionId ||
            transaction._id,
          mongoId: transaction._id, // Critical for the PDF download link
          date: new Date(transaction.paymentDate).toLocaleDateString(),
          studentName: student.name,
          roll: student.roll,
          amount: transaction.amount,
          mode: paymentMode.toUpperCase(),
          status: "Success",
        });
        setIsSuccessModalOpen(true);
        addToast("Transaction processed successfully", "success");
        // Reset flow
        setCurrentStep("selector");
        setStudent(null);
        setSearchQuery("");
        setAmount("");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      addToast("Failed to process payment", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Finance Portal
          </h2>
          <p className="text-gray-500 font-medium italic text-sm sm:text-base">
            Execute fee collection transactions and issue verified digital
            receipts.
          </p>
        </div>

        {/* Mobile Step Indicator */}
        <div className="lg:hidden flex items-center gap-2 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm w-fit">
          {["selector", "profile", "payment"].map((step, idx) => (
            <div key={step} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all",
                  currentStep === step
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-400",
                )}
              >
                {idx + 1}
              </div>
              {idx < 2 && <div className="w-4 h-0.5 bg-gray-100 mx-1" />}
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-100 shadow-sm">
          <ShieldCheck className="text-emerald-500" size={20} />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
            Security Status:
            <br />
            <span className="text-emerald-600 font-black">
              Verified Session
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-32 lg:pb-0">
        {/* Left/Step-1 & Step-2 Area */}
        <div
          className={cn(
            "lg:col-span-1 space-y-6",
            currentStep !== "selector" &&
              currentStep !== "profile" &&
              "hidden lg:block",
          )}
        >
          {/* Step 1: Selection Area */}
          <div
            className={cn(
              "bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6",
              currentStep !== "selector" && "hidden lg:block",
            )}
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Academic Cohort
              </label>
              <select
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-black focus:ring-4 focus:ring-indigo-50 outline-none transition-all cursor-pointer appearance-none shadow-inner"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">Choose Class...</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Student Verification (Roll or Name)
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1 group">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search roll or name..."
                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-transparent rounded-2xl text-sm font-black outline-none focus:ring-4 focus:ring-indigo-100 shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleFetchStudent}
                  loading={loading}
                  className="w-14 h-14 rounded-2xl shadow-lg shadow-indigo-100 shrink-0"
                >
                  <ArrowRight size={24} />
                </Button>
              </div>
            </div>
          </div>

          {/* Step 2: Student Profile Card */}
          {student && (
            <div
              className={cn(
                "bg-indigo-600 p-6 sm:p-8 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-100 space-y-8 relative overflow-hidden group animate-in slide-in-from-left-5 duration-500",
                currentStep === "selector" && "hidden lg:block",
              )}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 -mr-10 -mt-10 rounded-full group-hover:scale-110 transition-transform duration-1000" />

              <div className="flex items-center gap-6 relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-xl shrink-0">
                  <User size={32} className="text-indigo-50" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight truncate mb-1">
                    {student.name}
                  </h4>
                  <span className="text-[9px] font-black bg-white/20 px-3 py-1 rounded-xl uppercase tracking-widest backdrop-blur-md">
                    UID: LBS-{student.roll}
                  </span>
                </div>
                <button
                  onClick={() => setCurrentStep("selector")}
                  className="lg:hidden p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all active:scale-90"
                >
                  <Search size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 relative">
                <div className="p-4 sm:p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
                  <p className="text-[8px] font-black uppercase opacity-60 mb-2 tracking-tighter">
                    Total Liability
                  </p>
                  <p className="text-lg sm:text-xl font-black tracking-tight">
                    {formatToINR(student.totalFee)}
                  </p>
                </div>
                <div className="p-4 sm:p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all">
                  <p className="text-[8px] font-black uppercase opacity-60 mb-2 tracking-tighter">
                    Settled Amount
                  </p>
                  <p className="text-lg sm:text-xl font-black text-emerald-300 tracking-tight">
                    {formatToINR(student.paidFee)}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-rose-500 rounded-[2rem] relative shadow-2xl shadow-rose-900/40 overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingDown size={48} />
                </div>
                <div className="relative">
                  <p className="text-[9px] font-black uppercase text-rose-100 mb-1 tracking-widest">
                    Outstanding Due
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black tracking-tighter">
                      {formatToINR(student.dueFee)}
                    </span>
                    <span className="text-[9px] font-black opacity-60 uppercase">
                      DUE
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile Step Action */}
              <Button
                onClick={() => setCurrentStep("payment")}
                className="lg:hidden w-full h-16 bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-[0.98] transition-all"
              >
                Proceed to Payment
              </Button>
            </div>
          )}
        </div>

        {/* Right: Payment Gateway Terminal */}
        <div
          className={cn(
            "lg:col-span-2",
            currentStep !== "payment" && "hidden lg:block",
          )}
        >
          {!student ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-10 sm:p-20 bg-white rounded-[3rem] border border-dashed border-gray-200 text-gray-300 animate-in zoom-in-95">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                <Wallet size={40} className="opacity-10" />
              </div>
              <p className="font-black uppercase tracking-widest text-xs text-center leading-relaxed max-w-xs">
                Initiate Transaction Terminal
                <br />
                <span className="text-[10px] font-bold opacity-40">
                  Confirm identity to access terminal ledger
                </span>
              </p>
            </div>
          ) : (
            <div className="bg-white p-6 sm:p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-10 animate-in slide-in-from-right-10 duration-700">
              <div className="flex items-center gap-5">
                <button
                  onClick={() => setCurrentStep("profile")}
                  className="lg:hidden p-4 bg-gray-50 rounded-2xl active:scale-95 transition-all text-gray-400"
                >
                  <ArrowRight size={20} className="rotate-180" />
                </button>
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 rounded-[1.5rem] flex items-center justify-center shadow-inner shrink-0">
                  <Banknote size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-1">
                    Terminal Gateway
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    Session Identity: LBS-Finance-Admin
                  </p>
                </div>
              </div>

              <form onSubmit={handlePayment} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <Input
                      label="Transaction Amount (₹)"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      max={student.dueFee}
                      required
                      className="h-16 text-2xl font-black tracking-tighter rounded-3xl"
                    />
                    <div className="flex items-center gap-2 px-1">
                      <AlertCircle size={14} className="text-rose-400" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Max Allowed: {formatToINR(student.dueFee)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Payment Protocol
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["cash", "online", "cheque", "card"].map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setPaymentMode(mode)}
                          className={cn(
                            "py-4 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all",
                            paymentMode === mode
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105"
                              : "bg-gray-50 border-transparent text-gray-500 hover:bg-white hover:border-indigo-100 hover:text-indigo-600",
                          )}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 space-y-6 relative overflow-hidden">
                  <h5 className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                    Transaction Forecast Ledger
                  </h5>
                  <div className="grid grid-cols-2 gap-6 sm:gap-10 divide-x divide-gray-200">
                    <div>
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                        Post-Settle Paid
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                        {formatToINR(student.paidFee + parseFloat(amount || 0))}
                      </p>
                    </div>
                    <div className="pl-6 sm:pl-10">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider block mb-1">
                        Post-Settle Due
                      </span>
                      <p className="text-xl sm:text-2xl font-black text-rose-500 tracking-tight">
                        {formatToINR(student.dueFee - parseFloat(amount || 0))}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-20 text-lg sm:text-xl font-black rounded-[2rem] shadow-2xl shadow-indigo-100 active:scale-[0.98] transition-all"
                  loading={loading}
                  disabled={!amount || amount <= 0}
                  icon={CreditCard}
                >
                  Confirm & Capture Receipt
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Transaction Captured"
        maxWidth="md"
        noFooter
      >
        <div className="p-0 overflow-hidden rounded-[2.5rem]">
          <FeeReceiptPremium transaction={transaction} student={student} />
        </div>
      </Modal>
    </div>
  );
};

export default FeeCollection;
