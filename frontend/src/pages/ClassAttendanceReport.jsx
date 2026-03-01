import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  User,
  GraduationCap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import Skeleton, { TableSkeleton } from "../components/ui/Skeleton";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import api from "../services/api";

const ClassAttendanceReport = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get("/admin/classes");
      if (response.data.success) {
        setClasses(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedClassId(response.data.data[0]._id);
          fetchReport(response.data.data[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchReport = async (classId) => {
    if (!classId) return;
    setLoading(true);
    try {
      const response = await api.get(`/admin/attendance/class/${classId}`);
      if (response.data.success) {
        setReport(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching attendance report:", error);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClassId(classId);
    fetchReport(classId);
  };

  const filteredStudents =
    report?.students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.rollNo.includes(searchQuery),
    ) || [];

  const getPercentageColor = (percentage) => {
    if (percentage >= 75)
      return "text-emerald-600 bg-emerald-50 border-emerald-100";
    if (percentage >= 60) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-rose-600 bg-rose-50 border-rose-100";
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <BarChart3 className="text-indigo-600" size={32} />
            Attendance Analytics
          </h2>
          <p className="text-gray-500 font-medium mt-1">
            Detailed attendance performance and summary statistics.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-600 transition-colors"
              size={18}
            />
            <select
              value={selectedClassId}
              onChange={handleClassChange}
              className="pl-12 pr-10 py-3.5 bg-white border border-gray-200 rounded-[1.25rem] text-sm font-bold text-gray-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer shadow-sm hover:shadow-md min-w-[200px]"
            >
              <option value="">Select Class Group</option>
              {classes.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-100">
                <GraduationCap size={24} />
              </div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">
                TOTAL CLASSES
              </p>
              <h3 className="text-4xl font-black text-gray-900 leading-none">
                {report.totalClasses}
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-4">
                Conducted in this session
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-100">
                <TrendingUp size={24} />
              </div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">
                AVERAGE ATTENDANCE
              </p>
              <h3 className="text-4xl font-black text-gray-900 leading-none">
                {report.students.length > 0
                  ? (
                      report.students.reduce(
                        (acc, s) => acc + parseFloat(s.attendancePercentage),
                        0,
                      ) / report.students.length
                    ).toFixed(1)
                  : 0}
                %
              </h3>
              <p className="text-xs text-gray-400 font-bold mt-4">
                Across all students
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-rose-100">
                <TrendingDown size={24} />
              </div>
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">
                CRITICAL WATCH
              </p>
              <h3 className="text-4xl font-black text-gray-900 leading-none">
                {
                  report.students.filter(
                    (s) => parseFloat(s.attendancePercentage) < 60,
                  ).length
                }
              </h3>
              <p className="text-xs text-rose-400 font-bold mt-4 tracking-tight">
                Students below 60% attendance
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-8 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            Student Performance Matrix
          </h3>
          <div className="relative group max-w-sm w-full">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search student or roll no..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-gray-50/50 border border-transparent rounded-2xl text-sm font-medium focus:bg-white focus:border-indigo-100 transition-all outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8">
              <TableSkeleton rows={5} />
            </div>
          ) : filteredStudents.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Roll No
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                    Student Name
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                    Classes Present
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                    Classes Absent
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">
                    Attendance %
                  </th>
                  <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr
                    key={s.studentId}
                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                    onClick={() =>
                      navigate(
                        `/reports/attendance/analysis/student/${s.studentId}`,
                      )
                    }
                  >
                    <td className="px-8 py-5 border-b border-gray-50 font-black text-gray-400 text-xs">
                      #{s.rollNo}
                    </td>
                    <td className="px-8 py-5 border-b border-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 text-gray-400 rounded-xl flex items-center justify-center font-bold text-sm bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm">
                          {s.name.charAt(0)}
                        </div>
                        <span className="font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 border-b border-gray-50 text-center">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">
                        {s.presentCount}
                      </span>
                    </td>
                    <td className="px-8 py-5 border-b border-gray-50 text-center">
                      <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold">
                        {s.absentCount}
                      </span>
                    </td>
                    <td className="px-8 py-5 border-b border-gray-50">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={cn(
                            "px-4 py-1.5 rounded-xl text-xs font-black border transition-all",
                            getPercentageColor(
                              parseFloat(s.attendancePercentage),
                            ),
                          )}
                        >
                          {s.attendancePercentage}%
                        </div>
                        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              parseFloat(s.attendancePercentage) >= 75
                                ? "bg-emerald-500"
                                : parseFloat(s.attendancePercentage) >= 60
                                  ? "bg-amber-500"
                                  : "bg-rose-500",
                            )}
                            style={{ width: `${s.attendancePercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 border-b border-gray-50 text-right">
                      <button className="p-2 text-gray-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-xl transition-all active:scale-90">
                        <ArrowRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center p-20">
              <EmptyState
                title="No Student Records Found"
                description="Choose a different class or check if students are assigned to this group."
                icon={User}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassAttendanceReport;
