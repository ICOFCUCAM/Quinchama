import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { mockClasses, generateTimetable, DAYS, DAYS_FR, TIME_SLOTS, academicCalendar, getLevelLabel, TimetableSlot } from '@/lib/schoolData';
import { Calendar, Printer, BookOpen, Clock, AlertTriangle } from 'lucide-react';

const TimetableSystem: React.FC = () => {
  const { language } = useAppContext();
  const [selectedClass, setSelectedClass] = useState(mockClasses[0]?.id || '');
  const [view, setView] = useState<'weekly' | 'calendar'>('weekly');

  const timetable = useMemo(() => generateTimetable(selectedClass), [selectedClass]);
  const days = language === 'en' ? DAYS : DAYS_FR;
  const teachingSlots = TIME_SLOTS.filter(s => !s.isBreak);

  // Check for conflicts
  const conflicts = useMemo(() => {
    const teacherSlots: Record<string, TimetableSlot[]> = {};
    timetable.forEach(slot => {
      const key = `${slot.day}-${slot.startTime}`;
      if (!teacherSlots[key]) teacherSlots[key] = [];
      teacherSlots[key].push(slot);
    });
    return Object.values(teacherSlots).filter(slots => {
      const teacherIds = slots.map(s => s.teacherId);
      return new Set(teacherIds).size < teacherIds.length;
    }).length;
  }, [timetable]);

  const selectedClassInfo = mockClasses.find(c => c.id === selectedClass);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('dash.timetable', language)}</h2>
          <p className="text-sm text-gray-500">{language === 'en' ? 'Manage class and teacher schedules' : 'Gérer les emplois du temps des classes et enseignants'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setView('weekly')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'weekly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {language === 'en' ? 'Weekly' : 'Hebdomadaire'}
          </button>
          <button onClick={() => setView('calendar')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${view === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {language === 'en' ? 'Calendar' : 'Calendrier'}
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all">
            <Printer className="w-4 h-4" /> {t('common.print', language)}
          </button>
        </div>
      </div>

      {view === 'weekly' ? (
        <>
          {/* Class Selector */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none min-w-[250px]"
            >
              {mockClasses.map(c => (
                <option key={c.id} value={c.id}>
                  {getLevelLabel(c.level, language)} - {c.section === 'english' ? 'EN' : 'FR'} ({c.teacherName})
                </option>
              ))}
            </select>
            {conflicts > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm">
                <AlertTriangle className="w-4 h-4" />
                {language === 'en' ? `${conflicts} potential conflicts detected` : `${conflicts} conflits potentiels détectés`}
              </div>
            )}
          </div>

          {/* Class Info */}
          {selectedClassInfo && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">{language === 'en' ? 'Class' : 'Classe'}</p>
                  <p className="font-semibold text-gray-900">{getLevelLabel(selectedClassInfo.level, language)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">{language === 'en' ? 'Teacher' : 'Enseignant'}</p>
                <p className="font-semibold text-gray-900">{selectedClassInfo.teacherName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">{language === 'en' ? 'Students' : 'Élèves'}</p>
                <p className="font-semibold text-gray-900">{selectedClassInfo.studentCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Section</p>
                <p className="font-semibold text-gray-900">{selectedClassInfo.section === 'english' ? t('common.english', language) : t('common.french', language)}</p>
              </div>
            </div>
          )}

          {/* Timetable Grid */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase w-24">
                      <Clock className="w-4 h-4 inline mr-1" />{language === 'en' ? 'Time' : 'Heure'}
                    </th>
                    {days.map(day => (
                      <th key={day} className="text-center px-2 py-3 text-xs font-semibold text-gray-500 uppercase">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((slot, idx) => (
                    <tr key={idx} className={slot.isBreak ? 'bg-amber-50' : 'hover:bg-gray-50'}>
                      <td className="px-3 py-2 text-xs font-medium text-gray-500 border-r border-gray-100">
                        {slot.start} - {slot.end}
                      </td>
                      {slot.isBreak ? (
                        <td colSpan={5} className="text-center py-2 text-xs font-semibold text-amber-600">
                          {slot.start === '09:45' ? (language === 'en' ? 'BREAK' : 'PAUSE') : (language === 'en' ? 'LUNCH BREAK' : 'PAUSE DÉJEUNER')}
                        </td>
                      ) : (
                        DAYS.map(day => {
                          const entry = timetable.find(t => t.day === day && t.startTime === slot.start);
                          if (!entry) return <td key={day} className="px-2 py-2 border-r border-gray-50" />;
                          const colors = [
                            'bg-blue-50 border-blue-200 text-blue-700',
                            'bg-emerald-50 border-emerald-200 text-emerald-700',
                            'bg-purple-50 border-purple-200 text-purple-700',
                            'bg-amber-50 border-amber-200 text-amber-700',
                            'bg-rose-50 border-rose-200 text-rose-700',
                            'bg-cyan-50 border-cyan-200 text-cyan-700',
                            'bg-indigo-50 border-indigo-200 text-indigo-700',
                          ];
                          const colorIdx = entry.subject.length % colors.length;
                          return (
                            <td key={day} className="px-1 py-1 border-r border-gray-50">
                              <div className={`rounded-lg border p-2 ${colors[colorIdx]} text-center`}>
                                <p className="text-xs font-semibold truncate">{entry.subject}</p>
                                <p className="text-[10px] opacity-70 mt-0.5">{entry.room}</p>
                              </div>
                            </td>
                          );
                        })
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Academic Calendar View */
        <div className="space-y-6">
          {academicCalendar.map(term => (
            <div key={term.term} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">
                <h3 className="text-xl font-bold">{language === 'en' ? term.label : term.labelFr}</h3>
                <p className="text-blue-100 text-sm mt-1">
                  {new Date(term.startDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })} — {new Date(term.endDate).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <h4 className="font-semibold text-blue-900 text-sm">{language === 'en' ? 'Term Dates' : 'Dates du Trimestre'}</h4>
                    </div>
                    <p className="text-sm text-blue-700">{language === 'en' ? 'Start' : 'Début'}: {term.startDate}</p>
                    <p className="text-sm text-blue-700">{language === 'en' ? 'End' : 'Fin'}: {term.endDate}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-4 h-4 text-red-600" />
                      <h4 className="font-semibold text-red-900 text-sm">{language === 'en' ? 'Exam Period' : 'Période d\'Examens'}</h4>
                    </div>
                    <p className="text-sm text-red-700">{language === 'en' ? 'Start' : 'Début'}: {term.examStart}</p>
                    <p className="text-sm text-red-700">{language === 'en' ? 'End' : 'Fin'}: {term.examEnd}</p>
                  </div>
                </div>
                {term.holidays.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 text-sm mb-2">{language === 'en' ? 'Holidays' : 'Jours Fériés'}</h4>
                    <div className="flex flex-wrap gap-2">
                      {term.holidays.map((h, i) => (
                        <span key={i} className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm border border-amber-100">
                          {language === 'en' ? h.name : h.nameFr} — {h.date}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TimetableSystem;
