import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  GraduationCap,
  MapPin,
  Phone,
  ArrowLeft,
  CreditCard,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  FileText,
} from "lucide-react";
import api from "../services/api";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import { cn } from "../utils/cn";

const StudentProfile = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const printRef = useRef();

  const fetchProfile = React.useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const res = await api.get(`/students/${studentId}/profile`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [studentId],
  );

  useEffect(() => {
    fetchProfile();
    // Silent background refresh every 30 seconds to reflect finance module changes
    const interval = setInterval(() => fetchProfile(true), 30000);
    return () => clearInterval(interval);
  }, [fetchProfile]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 h-64 bg-gray-200 rounded-[2.5rem]" />
          <div className="md:col-span-2 h-64 bg-gray-200 rounded-[2.5rem]" />
        </div>
        <div className="h-96 bg-gray-200 rounded-[2.5rem]" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <AlertCircle size={48} className="text-gray-300" />
        <h2 className="text-2xl font-black text-gray-900">Student Not Found</h2>
        <Button onClick={() => navigate("/students")} icon={ArrowLeft}>
          Back to Directory
        </Button>
      </div>
    );
  }

  const { personalDetails, academicDetails, contactDetails, feeSummary } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-12 print:p-0 print:m-0">
      {/* Action Bar - Hidden in Print */}
      <div className="flex items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/students")}
            className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors shadow-sm"
            title="Back to Students"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              Student Profile
            </h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">
              Refreshed: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchProfile(false)}
            className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm group"
            title="Refresh Data"
          >
            <Clock
              size={20}
              className={cn(loading && "animate-spin text-indigo-600")}
            />
          </button>
          <Button
            variant="secondary"
            onClick={handlePrint}
            icon={Printer}
            className="rounded-2xl h-12"
          >
            Print Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Content */}
      <div ref={printRef} className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 print:border-none print:shadow-none print:p-0">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-indigo-600 text-white rounded-[3rem] flex items-center justify-center text-5xl font-black shadow-2xl shadow-indigo-100 print:shadow-none">
              {personalDetails.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-1">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                  {personalDetails.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                    Roll No: {personalDetails.rollNumber}
                  </span>
                  <span className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100">
                    Class: {academicDetails.className} -{" "}
                    {academicDetails.section}
                  </span>
                  <span
                    className={cn(
                      "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border",
                      personalDetails.status === "active"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : "bg-rose-50 text-rose-600 border-rose-100",
                    )}
                  >
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        personalDetails.status === "active"
                          ? "bg-emerald-500"
                          : "bg-rose-500",
                      )}
                    />
                    {personalDetails.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-6 print:border-gray-200">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-3">
                <User size={20} className="text-indigo-600" />
                Personal Details
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Parent/Guardian Name
                  </p>
                  <p className="font-bold text-gray-900">
                    {contactDetails.parentName}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Mobile Number
                  </p>
                  <div className="flex items-center gap-2 font-bold text-gray-900">
                    <Phone size={14} className="text-gray-400" />
                    {contactDetails.parentMobile}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Current Address
                  </p>
                  <div className="flex gap-2 font-bold text-gray-700 text-sm leading-relaxed">
                    <MapPin size={14} className="text-gray-400 shrink-0 mt-1" />
                    {contactDetails.address || "Address not provided"}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Admission Date
                  </p>
                  <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                    <Calendar size={14} className="text-gray-400" />
                    {new Date(personalDetails.admissionDate).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Fee Dashboard */}
          <div className="lg:col-span-2 space-y-8 flex flex-col">
            {/* Fee Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-2 print:border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Total Fee
                </p>
                <p className="text-2xl font-black text-gray-900">
                  ₹{feeSummary.totalFee.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-2 print:border-gray-200">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Total Paid
                </p>
                <p className="text-2xl font-black text-emerald-600">
                  ₹{feeSummary.totalPaid.toLocaleString()}
                </p>
              </div>
              <div className="bg-rose-50 rounded-[2rem] border border-rose-100 shadow-sm p-6 space-y-2 print:border-gray-200 print:bg-white">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest print:text-gray-400">
                  Pending Amount
                </p>
                <p className="text-2xl font-black text-rose-600">
                  ₹{feeSummary.pendingAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Fee Ledger Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex-1 print:border-gray-200">
              <div className="p-8 border-b border-gray-50 flex items-center gap-3">
                <FileText className="text-indigo-600" size={20} />
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  Month-wise Fee Ledger
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Month
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                        Fee
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                        Paid
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">
                        Status
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                        Paid On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {feeSummary.monthlyFees.length > 0 ? (
                      feeSummary.monthlyFees.map((fee) => (
                        <tr
                          key={fee.month}
                          className="group hover:bg-gray-50/30 transition-colors"
                        >
                          <td className="px-8 py-4 font-black text-gray-800 text-sm uppercase">
                            {fee.month}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-600 text-right">
                            ₹{fee.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-black text-emerald-600 text-right">
                            ₹{fee.paidAmount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span
                              className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5 border",
                                fee.status === "PAID"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : fee.status === "PARTIAL"
                                    ? "bg-amber-50 text-amber-600 border-amber-100"
                                    : "bg-rose-50 text-rose-500 border-rose-100",
                              )}
                            >
                              {fee.status === "PAID" ? (
                                <CheckCircle2 size={10} />
                              ) : fee.status === "PARTIAL" ? (
                                <Clock size={10} />
                              ) : (
                                <AlertCircle size={10} />
                              )}
                              {fee.status}
                            </span>
                          </td>
                          <td className="px-8 py-4 text-right text-xs font-bold text-gray-500 whitespace-nowrap uppercase">
                            {fee.paidOn
                              ? new Date(fee.paidOn).toLocaleDateString(
                                  undefined,
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )
                              : "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-8 py-12 text-center text-gray-400 font-medium italic"
                        >
                          No monthly fee records found for the current academic
                          year.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Specific CSS */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 2cm;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .custom-scrollbar::-webkit-scrollbar {
            display: none;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;
