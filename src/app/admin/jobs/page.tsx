"use client";

import { useState, useEffect, useCallback } from "react";

interface Job {
  id: string;
  book_id: string;
  job_type: string;
  status: string;
  current_step: string | null;
  error_message: string | null;
  attempt_count: number;
  created_at: string;
  books: { title: string | null } | null;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    const res = await fetch("/api/admin/jobs");
    if (res.ok) setJobs(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  async function handleRetry(jobId: string) {
    setRetrying(jobId);
    await fetch(`/api/admin/jobs/${jobId}/retry`, { method: "POST" });
    await fetchJobs();
    setRetrying(null);
  }

  const statusColors: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    running: "bg-blue-100 text-blue-700",
    queued: "bg-gray-100 text-gray-600",
    cancelled: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Generation Jobs</h1>
        <button onClick={fetchJobs} className="text-sm text-[#6C63FF] hover:opacity-80 font-medium">Refresh</button>
      </div>

      {loading ? (
        <div className="text-gray-400 text-sm">Loading...</div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-xs text-gray-500 font-semibold">
                <th className="text-left px-4 py-3">Job ID</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Book</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Step</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Attempts</th>
                <th className="text-left px-4 py-3 hidden xl:table-cell">Error</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{job.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell truncate max-w-[150px]">{job.books?.title ?? job.book_id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{job.job_type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[job.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">{job.current_step ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">{job.attempt_count}</td>
                  <td className="px-4 py-3 text-red-500 text-xs max-w-[200px] truncate hidden xl:table-cell">{job.error_message ?? "—"}</td>
                  <td className="px-4 py-3">
                    {job.status === "failed" && (
                      <button
                        onClick={() => handleRetry(job.id)}
                        disabled={retrying === job.id}
                        className="text-xs bg-[#6C63FF] hover:bg-[#5A52E0] disabled:opacity-50 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {retrying === job.id ? "Retrying..." : "Retry"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {jobs.length === 0 && <div className="text-center py-12 text-gray-400">No jobs yet</div>}
        </div>
      )}
    </div>
  );
}
