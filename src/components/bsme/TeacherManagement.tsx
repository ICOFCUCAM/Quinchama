import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { formatCFA, getLevelLabel } from '@/lib/schoolData';
import { Search, Eye, X, Mail, Phone, BookOpen } from 'lucide-react';
import type { Teacher } from '@/lib/schoolData';

const TeacherManagement: React.FC = () => {
  const { language, teachers } = useAppContext();
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const filtered = useMemo(() => {
    return teachers.filter(t => {
      const matchSearch = `${t.firstName} ${t.lastName} ${t.id}`.toLowerCase().includes(search.toLowerCase());
      const matchSection = sectionFilter === 'all' || t.section === sectionFilter;
      return matchSearch && matchSection;
    });
  }, [teachers, search, sectionFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('dash.teachers', language)}</h2>
          <p className="text-sm text-gray-500">{language === 'en' ? `${filtered.length} teachers` : `${filtered.length} enseignants`}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={language === 'en' ? 'Search teachers...' : 'Rechercher des enseignants...'} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">{t('common.all', language)}</option>
          <option value="english">{t('common.english', language)}</option>
          <option value="french">{t('common.french', language)}</option>
        </select>
      </div>

      {/* Teacher Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(teacher => (
          <div key={teacher.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedTeacher(teacher)}>
            <div className="flex items-start gap-4">
              <img src={teacher.photo} alt="" className="w-14 h-14 rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{teacher.firstName} {teacher.lastName}</h4>
                <p className="text-xs text-gray-400">{teacher.id}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${teacher.section === 'english' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {teacher.section === 'english' ? 'English Section' : 'Section Française'}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BookOpen className="w-4 h-4" />
                <span className="truncate">{teacher.subjects.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4" />
                <span className="truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{language === 'en' ? 'Salary' : 'Salaire'}: {formatCFA(teacher.salary)}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${teacher.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {teacher.status === 'active' ? (language === 'en' ? 'Active' : 'Actif') : (language === 'en' ? 'On Leave' : 'En Congé')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTeacher(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{language === 'en' ? 'Teacher Details' : 'Détails de l\'Enseignant'}</h3>
              <button onClick={() => setSelectedTeacher(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedTeacher.photo} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedTeacher.firstName} {selectedTeacher.lastName}</h4>
                  <p className="text-sm text-gray-500">{selectedTeacher.id}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Email', value: selectedTeacher.email },
                  { label: language === 'en' ? 'Phone' : 'Téléphone', value: selectedTeacher.phone },
                  { label: 'Section', value: selectedTeacher.section === 'english' ? t('common.english', language) : t('common.french', language) },
                  { label: language === 'en' ? 'Subjects' : 'Matières', value: selectedTeacher.subjects.join(', ') },
                  { label: language === 'en' ? 'Classes' : 'Classes', value: selectedTeacher.assignedClasses.join(', ') },
                  { label: language === 'en' ? 'Salary' : 'Salaire', value: formatCFA(selectedTeacher.salary) },
                  { label: language === 'en' ? 'Hire Date' : 'Date d\'Embauche', value: selectedTeacher.hireDate },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;
