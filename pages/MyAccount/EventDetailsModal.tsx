import React from 'react';
import { X, Clock, MapPin, ExternalLink, Calendar as CalendarIcon, Edit2, Trash2 } from '../../components/Icons';

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onUpdate?: (event: any) => void;
  onDelete?: (eventId: string) => void;
}

export const EventDetailsModal = ({ isOpen, onClose, event, onUpdate, onDelete }: EventDetailsModalProps) => {
  if (!isOpen || !event) return null;

  const { title, start, end, extendedProps } = event;
  const description = extendedProps?.description || 'No Description';
  const location = extendedProps?.location;
  const link = extendedProps?.link;
  const participants = extendedProps?.participants || 'NA';
  const timeZone = extendedProps?.start?.timeZone || 'Eastern Standard Time -05:00'; // Default per screenshot
  const timeZoneName = extendedProps?.timeZoneFullName || 'America/New_York';

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const durationMin = (end.getTime() - start.getTime()) / (1000 * 60);
  const durationHrs = Math.floor(durationMin / 60); 
  const durationMinsRemainder = durationMin % 60;
  const durationString = `${durationHrs} hr : ${durationMinsRemainder} minutes`;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-slate-800 dark:text-slate-200">Event Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-slate-500 dark:text-slate-400 font-medium">Title:</div>
            <div className="col-span-2 text-blue-600 dark:text-blue-400 font-medium">{title}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">Start Time :</div>
            <div className="col-span-2 text-slate-700 dark:text-slate-300">{formatDate(start)} {formatTime(start)}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">End Time :</div>
            <div className="col-span-2 text-slate-700 dark:text-slate-300">{formatDate(end)} {formatTime(end)}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">Duration :</div>
            <div className="col-span-2 text-slate-700 dark:text-slate-300">{durationString}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">TimeZone :</div>
            <div className="col-span-2 text-slate-700 dark:text-slate-300">{timeZone}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">Timezone full name :</div>
            <div className="col-span-2 text-slate-700 dark:text-slate-300">{timeZoneName}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">Description :</div>
            <div className="col-span-2 text-slate-700 dark:text-slate-300">{description}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">Participants :</div>
            <div className="col-span-2 text-slate-700 dark:text-slate-300">{participants}</div>
          </div>

          {location && (
             <div className="flex items-start gap-3 text-sm">
                <MapPin size={16} className="text-slate-400 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300">{location}</span>
             </div>
          )}

          {link && (
            <div className="pt-2">
               <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  <ExternalLink size={14} /> View in Calendar
               </a>
            </div>
          )}

          <div className="flex justify-between pt-6 mt-2 border-t border-slate-100 dark:border-slate-700">
            <button 
                onClick={() => onUpdate && onUpdate(event)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
                Update
            </button>
            <button 
                onClick={() => onDelete && onDelete(event.id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
            >
                Delete
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
