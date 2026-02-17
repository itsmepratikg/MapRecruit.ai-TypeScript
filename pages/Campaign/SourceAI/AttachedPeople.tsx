
import React, { useEffect, useState } from 'react';
import { interviewService } from '../../../services/api';
import { useToast } from '../../../components/Toast';
import { Loader2, UserX } from 'lucide-react';

export const AttachedPeople = ({ campaign }: { campaign?: any }) => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchInterviews = async () => {
    if (!campaign?.id) return;
    setLoading(true);
    try {
      const data = await interviewService.getAll({ campaignID: campaign.id, linked: true });
      setInterviews(data);
    } catch (error) {
      console.error('Failed to fetch attached profiles:', error);
      addToast('Failed to load attached profiles', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, [campaign?.id]);

  const handleRemove = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from this campaign?`)) return;
    try {
      await interviewService.delete(id);
      setInterviews(prev => prev.filter(i => i._id !== id));
      addToast(`${name} removed successfully`, 'success');
    } catch (error) {
      addToast('Failed to remove profile', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
        <Loader2 className="animate-spin" size={32} />
        <p>Loading attached profiles...</p>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto bg-white dark:bg-slate-900 custom-scrollbar">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
          Attached Profiles ({interviews.length})
        </h3>
      </div>

      {interviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
          <UserX size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">No profiles attached to this campaign yet</p>
          <p className="text-sm">Start adding candidates from the "Attach People" tab.</p>
        </div>
      ) : (
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800 shadow-sm transition-all duration-300">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Match Score</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
              {interviews.map((interview) => (
                <tr key={interview._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{interview.profile?.fullName || 'Unnamed'}</div>
                    <div className="text-xs text-slate-400">{interview.profile?.emails?.[0]?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${interview.status === 'Hired' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        interview.status === 'Rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                      {interview.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-green-600 dark:text-green-400 font-black text-base">
                      {interview.MRI?.score ? Math.round(interview.MRI.score * 100) : '--'}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400 tabular-nums">
                    {new Date(interview.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleRemove(interview._id, interview.profile?.fullName)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xs font-bold uppercase tracking-wider transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
