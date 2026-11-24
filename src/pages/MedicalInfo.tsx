import React, { useState, useEffect } from 'react';
import { Plus, X, HeartPulse, Pill, AlertTriangle, Phone, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { extractApiErrorMessage } from '../utils/formErrors';

type ContactEntry = {
  name: string;
  phone: string;
  relation: string;
};

type ListFieldKey = 'conditions' | 'medications' | 'allergies';

const parseListText = (raw: string): string[] =>
  raw
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);

const mergeUniqueItems = (existing: string[], incoming: string[]): string[] => {
  const seen = new Set(existing.map((item) => item.toLowerCase()));
  const next = [...existing];
  for (const item of incoming) {
    const trimmed = item.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      next.push(trimmed);
    }
  }
  return next;
};

const emptyContact = (): ContactEntry => ({ name: '', phone: '', relation: '' });

interface ListChipInputProps {
  label: string;
  icon: React.ReactNode;
  chipClassName: string;
  placeholder: string;
  items: string[];
  draft: string;
  suggestions?: string[];
  onDraftChange: (value: string) => void;
  onItemsChange: (items: string[]) => void;
}

/**
 * Mobile- and desktop-friendly tag list input.
 * Supports clicking "+ Add", tapping quick suggestions, pressing Enter/comma,
 * and auto-commits pending draft text on blur so nothing is lost without pressing Enter.
 */
function ListChipInput({
  label,
  icon,
  chipClassName,
  placeholder,
  items,
  draft,
  suggestions = [],
  onDraftChange,
  onItemsChange,
}: ListChipInputProps) {
  const commitText = (rawText: string) => {
    const parsed = parseListText(rawText);
    if (parsed.length === 0) return;
    onItemsChange(mergeUniqueItems(items, parsed));
    onDraftChange('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Commit items immediately if the user types a comma (or pastes comma-separated values)
    if (val.includes(',') || val.includes('\n')) {
      const endsWithSeparator = /[,\n]\s*$/.test(val);
      const parts = val.split(/[\n,]+/);
      if (endsWithSeparator) {
        commitText(val);
      } else {
        const trailing = parts.pop() ?? '';
        const completed = parts.map((p) => p.trim()).filter(Boolean);
        if (completed.length > 0) {
          onItemsChange(mergeUniqueItems(items, completed));
        }
        onDraftChange(trailing);
      }
      return;
    }
    onDraftChange(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commitText(draft);
    }
  };

  const removeItem = (indexToRemove: number) => {
    onItemsChange(items.filter((_, idx) => idx !== indexToRemove));
  };

  const availableSuggestions = suggestions.filter(
    (s) => !items.some((existing) => existing.toLowerCase() === s.toLowerCase())
  );

  return (
    <div className="pt-4 border-t border-slate-100 sm:bg-[#f8fbff] sm:border sm:border-slate-100 sm:rounded-2xl sm:p-4 transition-all">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800">
          {icon}
          <span>{label}</span>
        </div>
        {items.length > 0 && (
          <span className="text-[11px] font-bold text-slate-500 bg-white px-2.5 py-0.5 rounded-full border border-slate-100">
            {items.length} added
          </span>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {items.map((item, idx) => (
            <span
              key={`${item}-${idx}`}
              className={`inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-[13px] font-semibold border ${chipClassName}`}
            >
              <span className="break-words">{item}</span>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                aria-label={`Remove ${item}`}
                className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-black/10 transition-colors"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          enterKeyHint="done"
          placeholder={placeholder}
          value={draft}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => commitText(draft)}
          className="flex-1 min-w-0 bg-white border border-slate-200/80 rounded-xl px-3.5 py-2.5 text-base sm:text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0062ff]"
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => commitText(draft)}
          disabled={!draft.trim()}
          className="shrink-0 inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all bg-[#0062ff] text-white shadow-sm hover:bg-blue-600 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:cursor-not-allowed"
        >
          <Plus size={15} strokeWidth={2.75} />
          <span>Add</span>
        </button>
      </div>

      {availableSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className="text-[11px] font-semibold text-slate-400 mr-0.5">Quick add:</span>
          {availableSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onItemsChange(mergeUniqueItems(items, [suggestion]))}
              className="text-[11px] font-semibold text-slate-600 bg-white hover:bg-blue-50 hover:text-[#0062ff] hover:border-blue-200 border border-slate-200/80 rounded-full px-2.5 py-1 transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const CONDITION_SUGGESTIONS = ['Asthma', 'Diabetes', 'Hypertension', 'Heart Condition'];
const ALLERGY_SUGGESTIONS = ['Penicillin', 'Peanuts', 'Shellfish', 'Latex'];
const RELATION_SUGGESTIONS = ['Mother', 'Father', 'Spouse', 'Sibling', 'Friend'];

export default function MedicalInfo() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    fullName: '',
    dob: '',
    gender: '',
    bloodType: '',
    conditions: [] as string[],
    medications: [] as string[],
    allergies: [] as string[],
    emergencyContacts: [emptyContact()] as ContactEntry[],
    notes: '',
  });

  const [drafts, setDrafts] = useState<Record<ListFieldKey, string>>({
    conditions: '',
    medications: '',
    allergies: '',
  });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id ?? null;

    const toStringArray = (val: any): string[] => {
      if (Array.isArray(val)) return val.map((x) => String(x).trim()).filter(Boolean);
      if (typeof val === 'string') return parseListText(val);
      return [];
    };

    const fetchMedicalInfo = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/medical-data/${userId}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data?.success && data.data) {
            const loadedContacts: ContactEntry[] = Array.isArray(data.data.emergencyContacts)
              ? data.data.emergencyContacts.map((c: any) => ({
                  name: c.name || '',
                  phone: c.phoneNumber || c.phone || '',
                  relation: c.relation || c.type || '',
                }))
              : [];

            setFormData({
              fullName: data.data.fullName || user.fullName || '',
              dob: data.data.dob || '',
              gender: data.data.gender || '',
              bloodType: data.data.bloodType || '',
              conditions: toStringArray(data.data.medicalConditions),
              medications: toStringArray(data.data.medications),
              allergies: toStringArray(data.data.allergies),
              emergencyContacts: loadedContacts.length > 0 ? loadedContacts : [emptyContact()],
              notes: data.data.notes || '',
            });
          } else if (user.fullName) {
            setFormData((prev) => ({ ...prev, fullName: prev.fullName || user.fullName }));
          }
        } else if (user.fullName) {
          setFormData((prev) => ({ ...prev, fullName: prev.fullName || user.fullName }));
        }
      } catch (err) {
        console.error('Error fetching medical info: ', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicalInfo();
  }, []);

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleContactChange = (index: number, field: keyof ContactEntry, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.emergencyContacts];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, emergencyContacts: updated };
    });
    const key = `contact_${index}_${field}`;
    if (fieldErrors[key]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const removeContact = (index: number) => {
    setFormData((prev) => {
      if (prev.emergencyContacts.length <= 1) {
        return { ...prev, emergencyContacts: [emptyContact()] };
      }
      return {
        ...prev,
        emergencyContacts: prev.emergencyContacts.filter((_, idx) => idx !== index),
      };
    });
    setFieldErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith('contact_')) delete next[k];
      });
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userId = user?.id ?? null;

    if (!userId) {
      setError('Your session was not found. Please sign up or sign in again.');
      return;
    }

    // Flush any un-added text sitting in the list inputs so nothing is lost if Enter/Add wasn't tapped
    const finalConditions = mergeUniqueItems(formData.conditions, parseListText(drafts.conditions));
    const finalMedications = mergeUniqueItems(formData.medications, parseListText(drafts.medications));
    const finalAllergies = mergeUniqueItems(formData.allergies, parseListText(drafts.allergies));

    setFormData((prev) => ({
      ...prev,
      conditions: finalConditions,
      medications: finalMedications,
      allergies: finalAllergies,
    }));
    setDrafts({ conditions: '', medications: '', allergies: '' });

    const nextFieldErrors: Record<string, string> = {};
    let firstInvalidId = '';
    const recordError = (key: string, message: string, elementId: string) => {
      nextFieldErrors[key] = message;
      if (!firstInvalidId) firstInvalidId = elementId;
    };

    if (!formData.fullName.trim()) {
      recordError('fullName', 'Full Name is required.', 'field-fullName');
    }

    if (formData.dob) {
      const parsedDob = new Date(`${formData.dob}T00:00:00`);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (isNaN(parsedDob.getTime())) {
        recordError('dob', 'Please enter a valid Date of Birth.', 'field-dob');
      } else if (parsedDob > today) {
        recordError('dob', 'Date of Birth cannot be in the future.', 'field-dob');
      }
    }

    if (!formData.gender) {
      recordError('gender', 'Please select Male or Female.', 'field-gender');
    }

    // Normalize emergency contacts and validate partially filled entries
    const normalizedContacts: { name: string; phoneNumber: string; relation: string }[] = [];
    formData.emergencyContacts.forEach((c, idx) => {
      const name = c.name.trim();
      const phone = c.phone.trim();
      const relation = c.relation.trim();
      if (!name && !phone && !relation) return;

      if (!phone) {
        recordError(
          `contact_${idx}_phone`,
          `Phone number is required for Contact #${idx + 1}.`,
          `field-contact-${idx}-phone`
        );
        return;
      }

      if (phone.replace(/\D/g, '').length < 4) {
        recordError(
          `contact_${idx}_phone`,
          `Please enter a valid phone number for Contact #${idx + 1}.`,
          `field-contact-${idx}-phone`
        );
        return;
      }

      normalizedContacts.push({
        name: name || relation || 'Emergency Contact',
        phoneNumber: phone,
        relation,
      });
    });

    const errorList = Object.values(nextFieldErrors);
    if (errorList.length > 0) {
      setFieldErrors(nextFieldErrors);
      setError(`Please fix the following: ${errorList.join(' ')}`);
      if (firstInvalidId) {
        document.getElementById(firstInvalidId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
      return;
    }

    setSaving(true);
    setSuccess(false);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api/save-medical-data`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            fullName: formData.fullName.trim(),
            dob: formData.dob,
            bloodType: formData.bloodType,
            medicalConditions: finalConditions,
            medications: finalMedications,
            allergies: finalAllergies,
            emergencyContacts: normalizedContacts,
            notes: formData.notes.trim(),
          }),
        }
      );

      let result: any = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || (result && result.success === false)) {
        setError(extractApiErrorMessage(result, 'Failed to save your medical information. Please try again.'));
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/pin-protection');
      }, 450);
    } catch (err) {
      console.error('Error saving medical info:', err);
      setError('Network error while saving your medical information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400"></div>
      </div>
    );
  }

  const onFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'INPUT') {
      e.preventDefault();
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-0 py-3 sm:p-6 bg-transparent min-h-screen font-body pb-[10vh]">
      <div className="w-full max-w-[460px] md:max-w-[540px] flex flex-col items-center transition-all duration-300">
        <div className="mb-4 sm:mb-6 flex justify-center mt-1 sm:mt-4">
          <img src={logo} alt="LifeTag Logo" className="w-20 h-20 sm:w-24 sm:h-24 object-contain drop-shadow-sm" />
        </div>

        <div className="flex gap-2 w-full max-w-xs mx-auto mb-5 sm:mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex-1 h-2 rounded-full bg-slate-200 overflow-hidden">
              {i <= 1 && (
                <div
                  className="h-full rounded-full animate-[pulse_1s_ease-in-out_1]"
                  style={{
                    background: 'linear-gradient(333deg, hsl(216 100% 43%) 0%, hsl(196 93% 76%) 100%)',
                    width: '100%',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-extrabold text-[#1e293b] tracking-tight mb-4 sm:mb-6">
          Medical Information
        </h2>

        <div className="w-full bg-white rounded-[22px] sm:rounded-[24px] p-4 sm:p-6 shadow-[0px_10px_30px_rgba(150,170,200,0.1)] border border-slate-50">
          <form noValidate onSubmit={handleSubmit} onKeyDown={onFormKeyDown} className="flex flex-col gap-5">
            <div className="flex flex-col gap-4">
              <div id="field-fullName">
                <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. John Doe"
                  className={`auth-input text-base sm:text-[14px] ${
                    fieldErrors.fullName ? '!border-red-400 bg-red-50/30' : ''
                  }`}
                  value={formData.fullName}
                  onChange={handleFieldChange}
                />
                {fieldErrors.fullName && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1 ml-1">{fieldErrors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div id="field-dob">
                  <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    className={`auth-input bg-white w-full text-base sm:text-[14px] ${
                      fieldErrors.dob ? '!border-red-400 bg-red-50/30' : ''
                    }`}
                    value={formData.dob}
                    onChange={handleFieldChange}
                  />
                  {fieldErrors.dob && (
                    <p className="text-[11px] font-semibold text-red-500 mt-1 ml-1">{fieldErrors.dob}</p>
                  )}
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">
                    Blood Type
                  </label>
                  <select
                    name="bloodType"
                    className="auth-input bg-white w-full text-base sm:text-[14px]"
                    value={formData.bloodType}
                    onChange={handleFieldChange}
                  >
                    <option value="">Select...</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
              </div>

              <div id="field-gender">
                <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">
                  Gender
                </label>
                <div
                  role="radiogroup"
                  aria-label="Gender"
                  className={`grid grid-cols-2 gap-3 ${
                    fieldErrors.gender ? 'p-1 rounded-2xl ring-2 ring-red-300 bg-red-50/30' : ''
                  }`}
                >
                  {(['Male', 'Female'] as const).map((option) => {
                    const isSelected = formData.gender === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, gender: option }));
                          if (fieldErrors.gender) {
                            setFieldErrors((prev) => {
                              const next = { ...prev };
                              delete next.gender;
                              return next;
                            });
                          }
                        }}
                        className={`w-full focus:outline-none ${
                          option === 'Female'
                            ? 'focus-visible:ring-2 focus-visible:ring-pink-400/50'
                            : 'focus-visible:ring-2 focus-visible:ring-[#0062ff]/40'
                        } ${
                          isSelected
                            ? option === 'Female'
                              ? 'clay-button-pink !text-[14px]'
                              : 'clay-button !text-[14px] !shadow-[0_10px_24px_rgba(172,203,250,0.65),inset_3px_1px_11px_rgba(255,255,255,0.5),inset_0px_-4px_10px_#0077ff]'
                            : 'clay-button-white !text-[14px]'
                        }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {fieldErrors.gender && (
                  <p className="text-[11px] font-semibold text-red-500 mt-1 ml-1">{fieldErrors.gender}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-5 sm:gap-3.5">
              <ListChipInput
                label="Medical Conditions"
                icon={<HeartPulse size={16} className="text-[#f43f5e]" strokeWidth={2.5} />}
                chipClassName="bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]"
                placeholder="e.g. Asthma"
                items={formData.conditions}
                draft={drafts.conditions}
                suggestions={CONDITION_SUGGESTIONS}
                onDraftChange={(val) => setDrafts((p) => ({ ...p, conditions: val }))}
                onItemsChange={(items) => setFormData((p) => ({ ...p, conditions: items }))}
              />

              <ListChipInput
                label="Medications"
                icon={<Pill size={16} className="text-[#2563eb]" strokeWidth={2.5} />}
                chipClassName="bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]"
                placeholder="e.g. Metformin, Ventolin"
                items={formData.medications}
                draft={drafts.medications}
                onDraftChange={(val) => setDrafts((p) => ({ ...p, medications: val }))}
                onItemsChange={(items) => setFormData((p) => ({ ...p, medications: items }))}
              />

              <ListChipInput
                label="Allergies"
                icon={<AlertTriangle size={16} className="text-[#f59e0b]" strokeWidth={2.5} />}
                chipClassName="bg-[#fffbeb] text-[#b45309] border-[#fde68a]"
                placeholder="e.g. Penicillin"
                items={formData.allergies}
                draft={drafts.allergies}
                suggestions={ALLERGY_SUGGESTIONS}
                onDraftChange={(val) => setDrafts((p) => ({ ...p, allergies: val }))}
                onItemsChange={(items) => setFormData((p) => ({ ...p, allergies: items }))}
              />
            </div>

            {/* Emergency Contacts */}
            <div className="pt-4 border-t border-slate-100 sm:bg-[#f8fbff] sm:border sm:border-slate-100 sm:rounded-2xl sm:p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-slate-800 mb-3">
                <Phone size={16} className="text-[#22c55e]" strokeWidth={2.5} />
                <span>Emergency Contacts</span>
              </div>

              <div className="flex flex-col gap-3">
                {formData.emergencyContacts.map((c, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2.5 p-3.5 bg-[#f8fbff] sm:bg-white border border-slate-200/70 rounded-xl shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Contact #{i + 1}
                      </span>
                      {(formData.emergencyContacts.length > 1 || c.name || c.phone || c.relation) && (
                        <button
                          type="button"
                          onClick={() => removeContact(i)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors px-1.5 py-0.5 rounded-md hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                          <span>{formData.emergencyContacts.length > 1 ? 'Remove' : 'Clear'}</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="text"
                      placeholder="Contact Name (e.g. Sarah)"
                      value={c.name}
                      onChange={(e) => handleContactChange(i, 'name', e.target.value)}
                      className="auth-input bg-white text-base sm:text-[13px] w-full"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div id={`field-contact-${i}-phone`}>
                        <input
                          type="tel"
                          inputMode="tel"
                          placeholder="Phone number"
                          value={c.phone}
                          onChange={(e) => handleContactChange(i, 'phone', e.target.value)}
                          className={`auth-input bg-white text-base sm:text-[13px] w-full ${
                            fieldErrors[`contact_${i}_phone`] ? '!border-red-400 bg-red-50/30' : ''
                          }`}
                        />
                        {fieldErrors[`contact_${i}_phone`] && (
                          <p className="text-[11px] font-semibold text-red-500 mt-1 ml-1">
                            {fieldErrors[`contact_${i}_phone`]}
                          </p>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Relation (e.g. Mother)"
                        value={c.relation}
                        onChange={(e) => handleContactChange(i, 'relation', e.target.value)}
                        className="auth-input bg-white text-base sm:text-[13px] w-full self-start"
                      />
                    </div>

                    {!c.relation && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {RELATION_SUGGESTIONS.map((rel) => (
                          <button
                            key={rel}
                            type="button"
                            onClick={() => handleContactChange(i, 'relation', rel)}
                            className="text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-blue-50 hover:text-[#0062ff] border border-slate-200/70 rounded-full px-2.5 py-0.5 transition-colors"
                          >
                            {rel}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({
                      ...p,
                      emergencyContacts: [...p.emergencyContacts, emptyContact()],
                    }))
                  }
                  className="w-full py-2.5 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 hover:bg-blue-50 text-[#0062ff] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus strokeWidth={2.75} className="w-4 h-4" /> Add Another Contact
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium text-slate-800 mb-1.5 ml-1">
                Notes
              </label>
              <textarea
                name="notes"
                placeholder="Any additional notes..."
                className="auth-input min-h-[90px] text-base sm:text-[14px]"
                value={formData.notes}
                onChange={handleFieldChange}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-[12px] font-semibold px-4 py-3 rounded-xl border border-red-200 text-center">
                {error}
              </div>
            )}

            <div className="flex gap-4 w-full mt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="clay-button-white w-1/4"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={saving || success}
                className="clay-button w-3/4"
              >
                {saving ? 'Saving...' : success ? 'Saved!' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
