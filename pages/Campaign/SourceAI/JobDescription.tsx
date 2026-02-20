
import React, { useState, useEffect } from 'react';
import { FileText, MapPin, Briefcase, X, Save, Sparkles, Info, ChevronDown, ChevronUp, Clock, CheckCircle, MoreVertical, Brain, Award, BookOpen, Building2 } from '../../../components/Icons';
import { RichTextEditor } from '../../../components/RichTextEditor';
import { ConfirmationModal } from '../../../components/ConfirmationModal';
import { clientService } from '../../../services/api';
// @ts-ignore
import layoutData from '../../../data/layout_schema.json';

interface Campaign {
   _id: string;
   title: string;
   name?: string;
   displayName?: string;
   jobPosting?: {
      location?: string;
      primaryIndustry?: string;
      description?: string; // Sometimes JD is here
      jobID?: string;
   };
   jobDescription?: string; // Or here
   job?: {
      requirements?: {
         skills?: Array<{
            skillVarient: string;
            type: string; // 'Required', 'Preferred'
            contextualSkills?: any[];
            contextual_derived_skills?: any[];
         }>;
         education?: string[];
      };
      otherInformation?: {
         suggestedSkills?: Array<{
            text: string;
            score?: number;
         }>;
         contextual_derived_skills?: Array<{
            entity: string;
            entity_type: string;
         }>;
      };
   };
   status?: string;
   metrics?: any; // Placeholder for metrics
   customData?: Record<string, any>;
   compensation?: {
      min?: number;
      max?: number;
      currency?: string;
      period?: string; // 'Hour', 'Year'
   };
   experience?: {
      min?: number;
      max?: number;
      unit?: string; // 'Years'
   };
}

export interface EditSkillGroup {
   id: string;
   bool: 'OR' | 'AND';
   skills: string[];
}

const SkillChipInput = ({
   groups,
   setGroups,
   label,
   type,
   onMoveReq,
   onMovePref,
   onDropSkill,
   readOnly = false
}: {
   groups: EditSkillGroup[];
   setGroups?: (g: EditSkillGroup[]) => void;
   label: string;
   type: 'Required' | 'Preferred' | 'Suggested' | 'Inferred';
   onMoveReq?: (skill: string, sourceGroupId: string) => void;
   onMovePref?: (skill: string, sourceGroupId: string) => void;
   onDropSkill?: (skill: string, sourceGroupId: string, sourceType: string) => void;
   readOnly?: boolean;
}) => {
   const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
   const [innerInputValue, setInnerInputValue] = useState('');
   const [newGroupInputValue, setNewGroupInputValue] = useState('');

   const handleNewGroupKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (readOnly || !setGroups) return;
      if (e.key === 'Enter' || e.key === ',') {
         e.preventDefault();
         const val = newGroupInputValue.trim().replace(/,$/, '');
         if (val) {
            setGroups([...groups, { id: Math.random().toString(36).substring(7), bool: 'OR', skills: [val] }]);
            setNewGroupInputValue('');
         }
      }
   };

   const handleInnerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, groupId: string) => {
      if (readOnly || !setGroups) return;
      if (e.key === 'Enter' || e.key === ',') {
         e.preventDefault();
         const val = innerInputValue.trim().replace(/,$/, '');
         if (val) {
            setGroups(groups.map(g => {
               if (g.id === groupId) {
                  return { ...g, skills: [...g.skills.filter(s => s !== val), val] };
               }
               return g;
            }));
            setInnerInputValue('');
            setActiveGroupId(null);
         }
      } else if (e.key === 'Escape') {
         setInnerInputValue('');
         setActiveGroupId(null);
      }
   };

   const removeSkillFromGroup = (groupId: string, skillText: string) => {
      if (readOnly || !setGroups) return;
      setGroups(groups.map(g => {
         if (g.id === groupId) {
            return { ...g, skills: g.skills.filter(s => s !== skillText) };
         }
         return g;
      }).filter(g => g.skills.length > 0));
   };

   const toggleBoolStatus = (groupId: string) => {
      if (readOnly || !setGroups) return;
      setGroups(groups.map(g => {
         if (g.id === groupId) {
            return { ...g, bool: g.bool === 'OR' ? 'AND' : 'OR' };
         }
         return g;
      }));
   };

   const chipClass = type === 'Required'
      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
      : type === 'Preferred'
         ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-100 dark:border-blue-800'
         : type === 'Suggested'
            ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-100 dark:border-purple-800'
            : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800';

   const ringClass = type === 'Required' ? 'focus-within:ring-emerald-500/20 focus-within:border-emerald-500' :
      type === 'Preferred' ? 'focus-within:ring-blue-500/20 focus-within:border-blue-500' :
         type === 'Suggested' ? 'focus-within:ring-purple-500/20 focus-within:border-purple-500' :
            'focus-within:ring-indigo-500/20 focus-within:border-indigo-500';

   if (groups.length === 0 && readOnly) {
      return null;
   }

   return (
      <div className="space-y-1.5 flex-1 min-w-0">
         <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-2">
            {type === 'Suggested' && <Sparkles size={12} className="text-purple-500" />}
            {type === 'Inferred' && <Brain size={12} className="text-indigo-500" />}
            {label}
         </label>
         <div
            className={`flex flex-wrap items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 border ${readOnly ? 'border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30' : 'border-slate-200 dark:border-slate-700'} rounded-lg min-h-[46px] transition-colors ${!readOnly ? ringClass : ''}`}
            onDragOver={!readOnly ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; } : undefined}
            onDrop={!readOnly && onDropSkill ? (e) => {
               e.preventDefault();
               try {
                  const data = JSON.parse(e.dataTransfer.getData('application/json'));
                  if (data.sourceType !== type) {
                     onDropSkill(data.skill, data.sourceGroupId, data.sourceType);
                  }
               } catch (err) { }
            } : undefined}
         >
            {groups.map((group) => (
               <div key={group.id} className={`flex flex-wrap items-center gap-1.5 p-1 rounded-md border shadow-sm ${chipClass}`}>
                  {group.skills.map((skill, idx) => (
                     <React.Fragment key={`${group.id}-${idx}`}>
                        <span
                           draggable
                           onDragStart={(e) => {
                              e.dataTransfer.setData('application/json', JSON.stringify({ skill, sourceGroupId: group.id, sourceType: type }));
                              e.dataTransfer.effectAllowed = 'move';
                           }}
                           className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-bold rounded bg-white/60 dark:bg-black/20 text-current shadow-sm cursor-grab active:cursor-grabbing"
                        >
                           {skill}
                           <div className="flex items-center gap-1 opacity-80 pt-0.5">
                              {onMoveReq && type !== 'Required' && (
                                 <button type="button" onClick={() => onMoveReq(skill, group.id)} className="px-1 py-[2px] rounded bg-white/50 dark:bg-slate-900/50 hover:bg-white hover:text-emerald-600 transition-colors text-[8px] uppercase tracking-wider font-extrabold shadow-sm border border-black/5 dark:border-white/5" title="Move to Required">Req</button>
                              )}
                              {onMovePref && type !== 'Preferred' && (
                                 <button type="button" onClick={() => onMovePref(skill, group.id)} className="px-1 py-[2px] rounded bg-white/50 dark:bg-slate-900/50 hover:bg-white hover:text-blue-600 transition-colors text-[8px] uppercase tracking-wider font-extrabold shadow-sm border border-black/5 dark:border-white/5" title="Move to Preferred">Pref</button>
                              )}
                              {!readOnly && (
                                 <button type="button" onClick={() => removeSkillFromGroup(group.id, skill)} className="hover:opacity-100 hover:text-red-500 transition-opacity border-l border-current pl-1 ml-0.5"><X size={12} /></button>
                              )}
                           </div>
                        </span>
                        {idx < group.skills.length - 1 && (
                           <button
                              type="button"
                              onClick={() => toggleBoolStatus(group.id)}
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shadow-sm opacity-90 transition-colors ${!readOnly ? 'hover:bg-white/80 dark:hover:bg-white/20 cursor-pointer' : 'cursor-default'}`}
                           >
                              {group.bool}
                           </button>
                        )}
                     </React.Fragment>
                  ))}

                  {/* Inline Component for Adding to Group */}
                  {!readOnly && (
                     activeGroupId === group.id ? (
                        <div className="flex items-center gap-1 px-1">
                           <span className="text-[9px] font-bold uppercase tracking-wider px-1 py-0.5 opacity-90">
                              {group.skills.length > 0 ? group.bool : ''}
                           </span>
                           <input
                              type="text"
                              autoFocus
                              value={innerInputValue}
                              onChange={e => setInnerInputValue(e.target.value)}
                              onKeyDown={e => handleInnerKeyDown(e, group.id)}
                              onBlur={() => { setActiveGroupId(null); setInnerInputValue(''); }}
                              className="w-[100px] bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/10 outline-none text-[11px] px-2 py-0.5 rounded text-current placeholder:text-current/50 shadow-inner"
                              placeholder="Add skill..."
                           />
                        </div>
                     ) : (
                        <button type="button" onClick={() => setActiveGroupId(group.id)} className="px-2 py-1 text-current opacity-60 hover:opacity-100 transition-opacity hover:bg-white/50 dark:hover:bg-black/20 rounded shadow-sm">
                           <div className="font-bold text-[14px] leading-[14px]">+</div>
                        </button>
                     )
                  )}
               </div>
            ))}

            {/* Bottom New Group Input */}
            {!readOnly && (
               <input
                  type="text"
                  value={newGroupInputValue}
                  onChange={(e) => setNewGroupInputValue(e.target.value)}
                  onKeyDown={handleNewGroupKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-sm min-w-[140px] px-2 text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  placeholder={groups.length === 0 ? "Type new skill & press Enter..." : "Type new skill group..."}
               />
            )}
         </div>
      </div>
   );
};

export const JobDescription = ({ campaign }: { campaign?: Campaign }) => {
   const [isEditing, setIsEditing] = useState(false);
   const [editReqSkills, setEditReqSkills] = useState<EditSkillGroup[]>([]);
   const [editPrefSkills, setEditPrefSkills] = useState<EditSkillGroup[]>([]);
   const [editSuggSkills, setEditSuggSkills] = useState<EditSkillGroup[]>([]);
   const [editInfSkills, setEditInfSkills] = useState<EditSkillGroup[]>([]);
   const [formData, setFormData] = useState<Campaign | null>(null);
   const [jdContent, setJdContent] = useState('');
   const [activeAccordion, setActiveAccordion] = useState<string | null>('Job Description');

   // Confirmation States
   const [isDirty, setIsDirty] = useState(false);
   const [showSaveConfirm, setShowSaveConfirm] = useState(false);
   const [showCancelConfirm, setShowCancelConfirm] = useState(false);

   const [clientData, setClientData] = useState<any>(null);

   useEffect(() => {
      if (campaign?.clientID) {
         clientService.getById(campaign.clientID)
            .then(res => setClientData(res))
            .catch(err => console.error("Could not fetch client data", err));
      }
   }, [campaign?.clientID]);

   useEffect(() => {
      if (campaign) {
         setFormData(JSON.parse(JSON.stringify(campaign)));
         // Resolve initial JD content
         const initialJD = campaign.job?.details?.jobDescription?.text || campaign.jobDescription || campaign.jobPosting?.description || '';
         setJdContent(initialJD);
         setIsDirty(false);
      }
   }, [campaign]);

   useEffect(() => {
      const handleEnhanceEvent = () => handleEnhance();
      const handleEditEvent = () => setIsEditing(true);

      window.addEventListener('CAMPAIGN_ENHANCE_JD', handleEnhanceEvent);
      window.addEventListener('CAMPAIGN_EDIT_JD', handleEditEvent);

      return () => {
         window.removeEventListener('CAMPAIGN_ENHANCE_JD', handleEnhanceEvent);
         window.removeEventListener('CAMPAIGN_EDIT_JD', handleEditEvent);
      };
   }, []);

   useEffect(() => {
      // Hydrate local edit models when it opens
      if (campaign && isEditing) {
         const getSkillGroups = (type: string) => {
            if (!campaign?.job?.requirements?.skills) return [];
            return campaign.job.requirements.skills.reduce((acc: EditSkillGroup[], group: any) => {
               if (group.skills && Array.isArray(group.skills)) {
                  const matchingSkills = group.skills.filter((s: any) => s.eligibilityCheck === type || s.type === type);
                  if (matchingSkills.length > 0) {
                     acc.push({
                        id: Math.random().toString(36).substring(7),
                        bool: group.bool || 'OR',
                        skills: matchingSkills.map((s: any) => s.text || s.skillVarient).filter(Boolean)
                     });
                  }
               } else if (group.eligibilityCheck === type || group.type === type) {
                  acc.push({
                     id: Math.random().toString(36).substring(7),
                     bool: 'OR',
                     skills: [group.text || group.skillVarient].filter(Boolean)
                  });
               }
               return acc;
            }, []);
         };

         setEditReqSkills(getSkillGroups('Required'));
         setEditPrefSkills(getSkillGroups('Preferred'));

         const suggestedRaw = campaign?.job?.otherInformation?.suggestedSkills || [];
         const suggSkillsList = Array.isArray(suggestedRaw) ? [...suggestedRaw].sort((a, b) => (b.score || 0) - (a.score || 0)).map((s: any) => s.text).filter(Boolean) : [];
         setEditSuggSkills(suggSkillsList.map(s => ({ id: Math.random().toString(36).substring(7), bool: 'OR', skills: [s] })));

         const contextualDerived = campaign?.job?.otherInformation?.contextual_derived_skills || [];
         const infSkillsList = Array.isArray(contextualDerived) ? [...contextualDerived].filter((i: any) => i?.entity_type?.toLowerCase() === 'skill').map((s: any) => s.entity).filter(Boolean) : [];
         setEditInfSkills(infSkillsList.map(s => ({ id: Math.random().toString(36).substring(7), bool: 'OR', skills: [s] })));
      }
   }, [campaign, isEditing]);

   const handleCancelClick = () => {
      if (isDirty) {
         setShowCancelConfirm(true);
      } else {
         setIsEditing(false);
      }
   };

   useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
         if (e.key === 'Escape' && isEditing && !showSaveConfirm && !showCancelConfirm) {
            handleCancelClick();
         }
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
   }, [isEditing, isDirty, showSaveConfirm, showCancelConfirm]);

   if (!campaign || !formData) return <div className="p-8 text-center text-slate-500">Loading campaign data...</div>;

   const handleSaveClick = () => {
      setShowSaveConfirm(true);
   };

   const handleConfirmSave = () => {
      console.log('Saving campaign...', { ...formData, jobDescription: jdContent });
      // TODO: Implement API call to save
      setIsEditing(false);
      setIsDirty(false);
      setShowSaveConfirm(false);
   };

   const handleConfirmCancel = () => {
      setIsEditing(false);
      setIsDirty(false);
      setShowCancelConfirm(false);
      // Reset form data to initial campaign state
      setFormData(JSON.parse(JSON.stringify(campaign)));
      const initialJD = campaign?.jobDescription || campaign?.jobPosting?.description || '';
      setJdContent(initialJD);
   };

   const handleEnhance = () => {
      // Stub for AI enhancement
      console.log('Enhancing JD with AI...');
      setJdContent(prev => prev + '<p><strong>[AI Enhanced Content Stub]</strong>: This job description has been optimized for better candidate matching.</p>');
      setIsDirty(true);
   };

   const handleFieldChange = (fieldPath: string, value: any) => {
      // Helper to update nested state safely could be complex, 
      // for now simplistic approach for known top-levels or doing deep clone
      const newData = { ...formData } as any;

      // Simple path logic for top-level vs nested custom
      if (fieldPath === 'displayName') newData.displayName = value;
      else if (fieldPath === 'jobPosting.location') {
         if (!newData.jobPosting) newData.jobPosting = {};
         newData.jobPosting.location = value;
      }
      // Custom Data: customData.companyID.fieldID.value
      // We expect fieldPath to be the full key from logic below
      // But simplifying: we will pass a callback to inputs

      setFormData(newData);
      setIsDirty(true);
   };

   const updateCustomField = (companyId: string, fieldId: string, value: any) => {
      setFormData(prev => {
         if (!prev) return null;
         const next = { ...prev };
         if (!next.customData) next.customData = {};
         if (!next.customData[companyId]) next.customData[companyId] = {};
         if (!next.customData[companyId][fieldId]) next.customData[companyId][fieldId] = {};

         next.customData[companyId][fieldId].value = value;
         return next;
      });
      setIsDirty(true);
   };

   const handleDropSkill = (targetType: string, skill: string, sourceGroupId: string, sourceType: string) => {
      // Remove from sourceType First
      if (sourceType === 'Required') {
         setEditReqSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
      } else if (sourceType === 'Preferred') {
         setEditPrefSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
      } else if (sourceType === 'Suggested') {
         setEditSuggSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
      } else if (sourceType === 'Inferred') {
         setEditInfSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
      }

      // Add to targetType
      if (targetType === 'Required') {
         setEditReqSkills(prev => [...prev, { id: Math.random().toString(36).substring(7), bool: 'OR', skills: [skill] }]);
      } else if (targetType === 'Preferred') {
         setEditPrefSkills(prev => [...prev, { id: Math.random().toString(36).substring(7), bool: 'OR', skills: [skill] }]);
      }
      setIsDirty(true);
   };

   const toggleAccordion = (section: string) => {
      setActiveAccordion(activeAccordion === section ? null : section);
   };

   const getSkills = (type: string) => {
      // campaigns.json structure: job.requirements.skills is array of groups
      // Each group has { bool: 'OR', skills: [ { text: '...', eligibilityCheck: 'Required', ... } ] }
      if (!campaign?.job?.requirements?.skills) return [];

      const allSkills: any[] = [];
      campaign.job.requirements.skills.forEach((group: any) => {
         // Check if group itself is a skill object (legacy) or group
         if (group.skills && Array.isArray(group.skills)) {
            group.skills.forEach((skill: any) => {
               if (skill.eligibilityCheck === type) {
                  allSkills.push(skill);
               }
            });
         } else if (group.type === type) {
            // Legacy or flat structure fallback
            allSkills.push(group);
         }
      });
      return allSkills;
   };

   const renderSkillGroups = (type: string) => {
      if (!campaign?.job?.requirements?.skills) return <span className="text-slate-400 italic text-xs">None listed</span>;

      // Extract relevant groups that contain at least one skill matching the eligibilityCheck
      const relevantGroups = campaign.job.requirements.skills.reduce((acc: any[], group: any) => {
         if (group.skills && Array.isArray(group.skills)) {
            const matchingSkills = group.skills.filter((s: any) => s.eligibilityCheck === type || s.type === type);
            if (matchingSkills.length > 0) {
               acc.push({ bool: group.bool || 'OR', skills: matchingSkills });
            }
         } else if (group.eligibilityCheck === type || group.type === type) {
            acc.push({ bool: 'OR', skills: [group] });
         }
         return acc;
      }, []);

      if (relevantGroups.length === 0) return <span className="text-slate-400 italic text-xs">None listed</span>;

      return (
         <div className="flex flex-wrap gap-2 mt-1">
            {relevantGroups.map((group: any, groupIdx: number) => (
               <div key={groupIdx} className={`flex flex-wrap items-center gap-1.5 p-2 rounded-lg border ${type === 'Required' ? 'bg-white border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30' :
                  type === 'Preferred' ? 'bg-white border-blue-100 dark:bg-blue-900/10 dark:border-blue-800/30' :
                     'bg-white/70 border-purple-100 dark:bg-purple-900/10 dark:border-purple-800/30'} shadow-sm`}>
                  {group.skills.map((skill: any, idx: number) => (
                     <React.Fragment key={idx}>
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${type === 'Required' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
                           type === 'Preferred' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                              'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                           }`}>
                           {skill.text || skill.skillVarient}
                        </span>
                        {idx < group.skills.length - 1 && (
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-sm">
                              {group.bool}
                           </span>
                        )}
                     </React.Fragment>
                  ))}
               </div>
            ))}
         </div>
      );
   };

   const getInferredSkills = () => {
      // Try to extract from job.requirements.skills if possible, or suggested
      return getSkills('Suggested');
   };

   const renderSectionContent = (section: any, isEditMode: boolean) => {
      const code = section.sectionCode;

      switch (code) {
         case 'Job Description':
            if (isEditMode) {
               return (
                  <div className="space-y-3">
                     <div className="flex justify-end">
                        <button
                           type="button"
                           onClick={handleEnhance}
                           className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg shadow-sm transition-all"
                        >
                           <Sparkles size={12} /> Enhance with AI
                        </button>
                     </div>
                     <RichTextEditor
                        value={jdContent}
                        onChange={(val) => {
                           setJdContent(val);
                           setIsDirty(true);
                        }}
                        height={400}
                     />
                  </div>
               );
            }
            return (
               <div
                  className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: jdContent }}
               />
            );

         case 'Required Skills':
         case 'Preferred Skills':
         case 'Suggested Skills':
            const type = code.startsWith('Required') ? 'Required' : code.startsWith('Preferred') ? 'Preferred' : 'Suggested';
            const skills = getSkills(type);

            if (skills.length === 0) return <p className="text-sm text-slate-400 italic">No {type.toLowerCase()} skills listed.</p>;

            return (
               <div className="flex flex-wrap gap-2">
                  {skills.map((skill: any, idx: number) => (
                     <span key={idx} className={`px-2.5 py-1 rounded-md text-xs font-medium border ${type === 'Required'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                        : 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                        }`}>
                        {skill.text || skill.skillVarient || skill.name || 'Unknown Skill'}
                     </span>
                  ))}
               </div>
            );

         case 'Derived Skills': // Mapping "Inferred Skills" section code
            const inferred = getInferredSkills();
            if (inferred.length === 0) return <p className="text-sm text-slate-400 italic">No inferred skills available.</p>;
            return (
               <div className="flex flex-wrap gap-2">
                  {inferred.map((skill: any, idx: number) => (
                     <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-medium border bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800">
                        {skill.text || skill.name || skill.skillVarient || (typeof skill === 'string' ? skill : 'Unknown Skill')}
                     </span>
                  ))}
               </div>
            );

         case 'About Company':
            // Placeholder or real data if available
            return <p className="text-sm text-slate-500">Company information not available in this view.</p>;

         default:
            // Handle Custom Sections using layout_schema fields
            if (section.sectionType === 'Custom' && section.fields) {
               return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                     {section.fields.map((field: any) => {
                        // Value logic: campaigns.customData[companyID][fieldID].value
                        // We need to approximate safely
                        const companyId = section.companyID; // Assuming from schema
                        const fieldId = field._id;
                        // Construct key path: customData -> companyID -> fieldID -> value
                        const customVal = formData?.customData?.[companyId]?.[fieldId]?.value;

                        if (isEditMode) {
                           // Render Input based on format
                           return (
                              <div key={fieldId} className="space-y-2">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{field.name}</label>

                                 {field.format === 'Drop Down' ? (
                                    field.possibleValues && field.possibleValues.length <= 4 ? (
                                       // Segmented Control for short options
                                       <div className="flex bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                          {field.possibleValues.map((v: string) => {
                                             const isSelected = customVal === v;
                                             return (
                                                <button
                                                   key={v}
                                                   type="button"
                                                   onClick={() => updateCustomField(companyId, fieldId, v)}
                                                   className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${isSelected
                                                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-slate-200 dark:ring-slate-600'
                                                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                                      }`}
                                                >
                                                   {v}
                                                </button>
                                             );
                                          })}
                                       </div>
                                    ) : (
                                       // Standard Select for longer lists
                                       <div className="relative">
                                          <select
                                             className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 active:bg-white dark:active:bg-slate-900 transition-colors"
                                             defaultValue={customVal}
                                             onChange={(e) => updateCustomField(companyId, fieldId, e.target.value)}
                                          >
                                             <option value="">Select...</option>
                                             {field.possibleValues?.map((v: string) => <option key={v} value={v}>{v}</option>)}
                                          </select>
                                          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                       </div>
                                    )
                                 ) : (
                                    <input
                                       type={field.format === 'Date' ? 'date' : 'text'}
                                       className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                                       defaultValue={customVal}
                                       onChange={(e) => updateCustomField(companyId, fieldId, e.target.value)}
                                       placeholder={field.format === 'Date' ? '' : `Enter ${field.name}...`}
                                    />
                                 )}
                              </div>
                           );
                        }

                        return (
                           <div key={fieldId} className="group">
                              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1 flex items-center gap-2">
                                 {field.name}
                              </div>
                              <div className="text-sm font-medium text-slate-700 dark:text-slate-200 min-h-[20px]">
                                 {customVal ? (
                                    field.format === 'Drop Down' && ['Yes', 'No'].includes(customVal) ? (
                                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${customVal === 'Yes'
                                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                          }`}>
                                          {customVal}
                                       </span>
                                    ) : (
                                       <span>{customVal}</span>
                                    )
                                 ) : <span className="text-slate-400 italic text-xs">Not set</span>}
                              </div>
                           </div>
                        );
                     })}
                  </div>
               );
            }
            return null;
      }
   };

   return (
      <div className="p-8 h-full overflow-y-auto w-full max-w-none bg-white dark:bg-slate-900 custom-scrollbar relative">
         {/* Bento Grid Layout (Read-Only) */}
         <div className="grid grid-cols-12 gap-6 pb-20">
            {/* Main Content (Span 12) */}
            <div className="col-span-12 space-y-6">

               {/* Skills Section (Moved Top) */}
               <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 uppercase tracking-wider flex items-center gap-2">
                     <Sparkles className="text-emerald-500" size={16} /> Skills & Requirements
                  </h3>

                  <div className="space-y-6">
                     {/* Row 1: Required & Preferred */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Required Skills */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                           <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Required Skills</span>
                           {renderSkillGroups('Required')}
                        </div>

                        {/* Preferred Skills */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                           <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Preferred Skills</span>
                           {renderSkillGroups('Preferred')}
                        </div>
                     </div>

                     {/* Row 2: Suggested & Inferred */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
                           <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-2 block flex items-center gap-2"><Sparkles size={12} /> Suggested Skills</span>
                           {(() => {
                              const suggestedRaw = campaign?.job?.otherInformation?.suggestedSkills || [];
                              const suggestedSkills = Array.isArray(suggestedRaw)
                                 ? [...suggestedRaw].sort((a, b) => (b.score || 0) - (a.score || 0))
                                 : [];

                              if (suggestedSkills.length === 0) return <span className="text-slate-400 italic text-xs">None suggested</span>;

                              return (
                                 <div className="flex flex-wrap gap-2 mt-2">
                                    {suggestedSkills.map((sk: any, idx: number) => (
                                       <span key={idx} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-800">
                                          {sk.text}
                                       </span>
                                    ))}
                                 </div>
                              );
                           })()}
                        </div>

                        <div className="bg-indigo-50/50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                           <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2 block flex items-center gap-2"><Brain size={12} /> AI Inferred Skills</span>
                           {(() => {
                              const contextualDerived = campaign?.job?.otherInformation?.contextual_derived_skills || [];
                              const inferredSkills = Array.isArray(contextualDerived)
                                 ? contextualDerived.filter((item: any) => item?.entity_type?.toLowerCase() === 'skill')
                                 : [];

                              if (inferredSkills.length === 0) return <span className="text-slate-400 italic text-xs">None inferred</span>;

                              return (
                                 <div className="flex flex-wrap gap-2 mt-2">
                                    {inferredSkills.slice(0, 20).map((skill: any, idx) => (
                                       <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/70 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 shadow-sm">
                                          {skill.entity}
                                       </span>
                                    ))}
                                 </div>
                              );
                           })()}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Education Section */}
               {campaign?.job?.requirements?.education && Array.isArray(campaign.job.requirements.education) && (campaign.job.requirements.education as any[]).length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                     <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-4 uppercase tracking-wider flex items-center gap-2">
                        <Award className="text-amber-500" size={16} /> Education Requirements
                     </h3>
                     <div className="grid grid-cols-1 gap-4">
                        {(campaign.job.requirements.education as any[]).map((edu: any, idx: number) => {
                           const endYearMatch = edu.endDate ? String(edu.endDate).match(/\d{4}/) : null;
                           const gradYear = endYearMatch ? endYearMatch[0] : null;

                           return (
                              <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                 <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                       <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{edu.degree?.level || (typeof edu.degree === 'string' ? edu.degree : null) || 'Degree Pre-Requisite'}</h4>
                                       {edu.eligibilityCheck && (
                                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${edu.eligibilityCheck === 'Required' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                             {typeof edu.eligibilityCheck === 'string' ? edu.eligibilityCheck : edu.eligibilityCheck.text || 'Required'}
                                          </span>
                                       )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-400">
                                       {edu.major && <span className="flex items-center gap-1 truncate"><BookOpen size={12} className="text-slate-400 shrink-0" /> {typeof edu.major === 'string' ? edu.major : edu.major.name || edu.major.text || 'Major'}</span>}
                                       {edu.campus && <span className="flex items-center gap-1 truncate"><Building2 size={12} className="text-slate-400 shrink-0" /> {typeof edu.campus === 'string' ? edu.campus : edu.campus.name || edu.campus.text || 'Campus'}</span>}
                                       {gradYear && <span className="flex items-center gap-1"><Clock size={12} className="text-slate-400 shrink-0" /> Grad: {gradYear}</span>}
                                    </div>
                                 </div>

                                 {edu.merit && (
                                    <div className="flex-shrink-0 md:text-right bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 px-3 py-1.5 rounded-lg">
                                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Merit</div>
                                       <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                          {typeof edu.merit === 'string' ? edu.merit : (edu.merit.percentage ? `Percentage: ${edu.merit.percentage}%` : edu.merit.GPA ? `GPA: ${edu.merit.GPA}${edu.merit.GPAOutOf ? `/${edu.merit.GPAOutOf}` : ''}` : 'View Details')}
                                       </div>
                                    </div>
                                 )}
                              </div>
                           );
                        })}
                     </div>
                  </div>
               )}

               {/* About / Description Card (Full Width for Content) */}
               <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
                     <FileText className="text-indigo-500" size={20} /> About the Role
                  </h3>
                  <div
                     className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                     dangerouslySetInnerHTML={{ __html: jdContent }}
                  />
               </div>

               {/* About Company Card */}
               {clientData && (
                  <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
                     {(clientData.clientBanner || clientData.banner) && (
                        <div className="w-full h-32 md:h-48 rounded-xl overflow-hidden mb-6 bg-slate-100 dark:bg-slate-800">
                           <img src={clientData.clientBanner || clientData.banner} alt="Client Banner" className="w-full h-full object-cover" />
                        </div>
                     )}
                     <div className="flex items-center gap-4 mb-6">
                        {(clientData.clientLogo || clientData.logo) ? (
                           <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-200">
                              <img src={clientData.clientLogo || clientData.logo} alt="Client Logo" className="w-full h-full object-contain p-2" />
                           </div>
                        ) : (
                           <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center border border-slate-200 dark:border-slate-600">
                              <Building2 className="text-slate-400" size={32} />
                           </div>
                        )}
                        <div>
                           <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                              {clientData.clientName || clientData.name || 'Company Name'}
                           </h3>
                           <p className="text-sm text-slate-500 dark:text-slate-400">{clientData.clientType || 'Primary Client'}</p>
                        </div>
                     </div>
                     {clientData.description && (
                        <div
                           className="prose prose-sm max-w-none dark:prose-invert text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap"
                           dangerouslySetInnerHTML={{ __html: clientData.description }}
                        />
                     )}
                  </div>
               )}
            </div>

            {/* Right Column: Widgets (Span 4) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
               {/* Custom Fields Widget (Pipeline, etc) */}
               {
                  layoutData.result.customTabs.map((section: any) => {
                     // Filter out unwanted sections
                     const unwantedParams = ['Additional Information', 'Pipeline', 'AppCast', 'LinkedIn', 'TRC Front Office', 'Street Address', 'Estimated End Date', 'Parent Account'];
                     if (unwantedParams.some(param => section.name?.includes(param))) return null;

                     if (section.sectionType === 'Custom' && section.fields) {
                        return (
                           <div key={section.name} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
                              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">{section.name || "Additional Info"}</h4>
                              <div className="grid grid-cols-1 gap-4">
                                 {section.fields.map((field: any) => {
                                    const companyId = section.companyID;
                                    const fieldId = field.fieldID || field._id; // Ensure ID fallback
                                    const customVal = formData?.customData?.[companyId]?.[fieldId]?.value;

                                    return (
                                       <div key={fieldId} className="flex justify-between items-center group">
                                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{field.name}</span>
                                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                             {customVal ? (
                                                ['Yes', 'No'].includes(customVal) ? (
                                                   <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${customVal === 'Yes'
                                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                      }`}>
                                                      {customVal}
                                                   </span>
                                                ) : customVal
                                             ) : <span className="text-slate-300 dark:text-slate-600">-</span>}
                                          </span>
                                       </div>
                                    );
                                 })}
                              </div>
                           </div>
                        );
                     }
                     return null;
                  })
               }
            </div>
         </div>

         {/* Edit Modal */}
         {
            isEditing && (
               <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700">
                     <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Edit Job Description</h2>
                        <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                           <X size={20} />
                        </button>
                     </div>

                     <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative">
                        {/* Core Info */}
                        <div className="space-y-4">
                           <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                              <Briefcase size={16} className="text-indigo-500" /> Basic Details
                           </h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Job Title</label>
                                 <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    defaultValue={formData.displayName || formData.title}
                                    onChange={(e) => handleFieldChange('displayName', e.target.value)}
                                    placeholder="e.g. Senior Software Engineer"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Location</label>
                                 <input
                                    type="text"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    defaultValue={formData.jobPosting?.location}
                                    onChange={(e) => handleFieldChange('jobPosting.location', e.target.value)}
                                    placeholder="e.g. New York, NY"
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Min Experience (Years)</label>
                                 <input
                                    type="number"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    defaultValue={formData.experience?.min || ''}
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Max Experience (Years)</label>
                                 <input
                                    type="number"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    defaultValue={formData.experience?.max || ''}
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Min Salary</label>
                                 <input
                                    type="number"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    defaultValue={formData.compensation?.min || ''}
                                 />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Max Salary</label>
                                 <input
                                    type="number"
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
                                    defaultValue={formData.compensation?.max || ''}
                                 />
                              </div>
                           </div>
                        </div>

                        {/* Requirements */}
                        <div className="space-y-4">
                           <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                              <Sparkles size={16} className="text-emerald-500" /> Skills & Education
                           </h3>
                           <div className="space-y-6">
                              <SkillChipInput
                                 label="Required Skills"
                                 type="Required"
                                 groups={editReqSkills}
                                 setGroups={(g) => {
                                    setEditReqSkills(g);
                                    setIsDirty(true);
                                 }}
                                 onMovePref={(skill, sourceGroupId) => {
                                    setEditReqSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
                                    setEditPrefSkills(prev => [...prev, { id: Math.random().toString(36).substring(7), bool: 'OR', skills: [skill] }]);
                                    setIsDirty(true);
                                 }}
                                 onDropSkill={(skill, sourceGroupId, sourceType) => handleDropSkill('Required', skill, sourceGroupId, sourceType)}
                              />
                              <SkillChipInput
                                 label="Preferred Skills"
                                 type="Preferred"
                                 groups={editPrefSkills}
                                 setGroups={(g) => {
                                    setEditPrefSkills(g);
                                    setIsDirty(true);
                                 }}
                                 onMoveReq={(skill, sourceGroupId) => {
                                    setEditPrefSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
                                    setEditReqSkills(prev => [...prev, { id: Math.random().toString(36).substring(7), bool: 'OR', skills: [skill] }]);
                                    setIsDirty(true);
                                 }}
                                 onDropSkill={(skill, sourceGroupId, sourceType) => handleDropSkill('Preferred', skill, sourceGroupId, sourceType)}
                              />

                              {(editSuggSkills.length > 0 || editInfSkills.length > 0) && (
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 mt-6 border-t border-slate-200 dark:border-slate-800">
                                    <SkillChipInput
                                       label="Suggested Skills"
                                       type="Suggested"
                                       groups={editSuggSkills}
                                       readOnly={true}
                                       onMoveReq={(skill, sourceGroupId) => {
                                          setEditSuggSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
                                          setEditReqSkills(prev => [...prev, { id: Math.random().toString(36).substring(7), bool: 'OR', skills: [skill] }]);
                                          setIsDirty(true);
                                       }}
                                       onMovePref={(skill, sourceGroupId) => {
                                          setEditSuggSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
                                          setEditPrefSkills(prev => [...prev, { id: Math.random().toString(36).substring(7), bool: 'OR', skills: [skill] }]);
                                          setIsDirty(true);
                                       }}
                                    />
                                    <SkillChipInput
                                       label="AI Inferred Skills"
                                       type="Inferred"
                                       groups={editInfSkills}
                                       readOnly={true}
                                       onMoveReq={(skill, sourceGroupId) => {
                                          setEditInfSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
                                          setEditReqSkills(prev => [...prev, { id: Math.random().toString(36).substring(7), bool: 'OR', skills: [skill] }]);
                                          setIsDirty(true);
                                       }}
                                       onMovePref={(skill, sourceGroupId) => {
                                          setEditInfSkills(prev => prev.map(g => g.id === sourceGroupId ? { ...g, skills: g.skills.filter(s => s !== skill) } : g).filter(g => g.skills.length > 0));
                                          setEditPrefSkills(prev => [...prev, { id: Math.random().toString(36).substring(7), bool: 'OR', skills: [skill] }]);
                                          setIsDirty(true);
                                       }}
                                    />
                                 </div>
                              )}

                              <div className="space-y-2 mt-4">
                                 <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Education Requirements</label>
                                 {(!formData.job?.requirements?.education || formData.job.requirements.education.length === 0) && (
                                    <span className="text-sm text-slate-500 italic block">No formal education requirements specified.</span>
                                 )}
                                 {formData.job?.requirements?.education?.map((edu: any, idx: number) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                                       <div className="grid grid-cols-2 gap-4">
                                          <div className="space-y-1.5 min-w-0">
                                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Degree/Level</label>
                                             <input
                                                type="text"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                                                defaultValue={edu.degree?.level || (typeof edu.degree === 'string' ? edu.degree : '')}
                                                placeholder="e.g. Bachelor's"
                                                onChange={(e) => {
                                                   const val = e.target.value;
                                                   const newFormData = { ...formData } as any;
                                                   if (!newFormData.job.requirements.education[idx].degree || typeof newFormData.job.requirements.education[idx].degree === 'string') {
                                                      newFormData.job.requirements.education[idx].degree = { level: val };
                                                   } else {
                                                      newFormData.job.requirements.education[idx].degree.level = val;
                                                   }
                                                   setFormData(newFormData);
                                                   setIsDirty(true);
                                                }}
                                             />
                                          </div>
                                          <div className="space-y-1.5 min-w-0">
                                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Major Specialization</label>
                                             <input
                                                type="text"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-semibold text-slate-700 dark:text-slate-200 placeholder:text-slate-300"
                                                defaultValue={edu.major?.text || edu.major?.name || (typeof edu.major === 'string' ? edu.major : '')}
                                                placeholder="e.g. Computer Science"
                                                onChange={(e) => {
                                                   const val = e.target.value;
                                                   const newFormData = { ...formData } as any;
                                                   if (!newFormData.job.requirements.education[idx].major || typeof newFormData.job.requirements.education[idx].major === 'string') {
                                                      newFormData.job.requirements.education[idx].major = { text: val };
                                                   } else {
                                                      newFormData.job.requirements.education[idx].major.text = val;
                                                   }
                                                   setFormData(newFormData);
                                                   setIsDirty(true);
                                                }}
                                             />
                                          </div>
                                          <div className="space-y-1.5 col-span-2 min-w-0">
                                             <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Campus / University</label>
                                             <input
                                                type="text"
                                                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-600 dark:text-slate-300 placeholder:text-slate-300"
                                                defaultValue={edu.campus?.text || edu.campus?.name || (typeof edu.campus === 'string' ? edu.campus : '')}
                                                placeholder="e.g. Stanford University"
                                                onChange={(e) => {
                                                   const val = e.target.value;
                                                   const newFormData = { ...formData } as any;
                                                   if (!newFormData.job.requirements.education[idx].campus || typeof newFormData.job.requirements.education[idx].campus === 'string') {
                                                      newFormData.job.requirements.education[idx].campus = { text: val };
                                                   } else {
                                                      newFormData.job.requirements.education[idx].campus.text = val;
                                                   }
                                                   setFormData(newFormData);
                                                   setIsDirty(true);
                                                }}
                                             />
                                          </div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Job Description (Rich Text) */}
                        <div className="space-y-4">
                           <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center justify-between">
                              <span className="flex items-center gap-2"><FileText size={16} className="text-purple-500" /> About the Role</span>
                              <button
                                 type="button"
                                 onClick={handleEnhance}
                                 className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-lg shadow-sm transition-all"
                              >
                                 <Sparkles size={12} /> Enhance with AI
                              </button>
                           </h3>
                           <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                              <RichTextEditor
                                 value={jdContent}
                                 onChange={(val) => {
                                    setJdContent(val);
                                    setIsDirty(true);
                                 }}
                                 height={350}
                              />
                           </div>
                        </div>

                        {/* Custom Fields Iterate */}
                        <div className="space-y-4">
                           <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-2 flex items-center gap-2">
                              <MoreVertical size={16} className="text-slate-500" /> Additional Information
                           </h3>
                           {layoutData.result.customTabs.map((section: any, idx: number) => {
                              if (!section.name) return null;
                              if (section.sectionType === 'Custom') {
                                 return (
                                    <div key={idx} className="bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-xl border border-slate-100 dark:border-slate-800">
                                       <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-4 px-1">
                                          {section.name}
                                       </h4>
                                       {renderSectionContent(section, true)}
                                    </div>
                                 );
                              }
                              return null;
                           })}
                        </div>
                     </div>

                     <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50">
                        <button
                           onClick={handleCancelClick}
                           className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium transition-colors"
                        >
                           Cancel
                        </button>
                        <button
                           onClick={handleSaveClick}
                           className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium transition-colors shadow-sm"
                        >
                           <Save size={16} /> Save Changes
                        </button>
                     </div>
                  </div>
               </div>
            )
         }

         <ConfirmationModal
            isOpen={showSaveConfirm}
            title="Save Changes?"
            message="Are you sure you want to save these changes to the Job Description?"
            confirmText="Save Changes"
            cancelText="Keep Editing"
            onConfirm={handleConfirmSave}
            onCancel={() => setShowSaveConfirm(false)}
            variant="primary"
         />

         <ConfirmationModal
            isOpen={showCancelConfirm}
            title="Discard Changes?"
            message="You have unsaved changes. Are you sure you want to discard them?"
            confirmText="Discard Changes"
            cancelText="Keep Editing"
            onConfirm={handleConfirmCancel}
            onCancel={() => setShowCancelConfirm(false)}
            variant="danger"
         />
      </div>
   );
};
