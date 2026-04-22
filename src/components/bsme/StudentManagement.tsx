import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { LEVELS, getLevelLabel, IMAGES, Student, Level, Section } from '@/lib/schoolData';
import { Search, Plus, Eye, Trash2, X, UserPlus, Download, Users } from 'lucide-react';


import { toast } from 'sonner';

const StudentManagement: React.FC = () => {
  const { language, students, addStudent, deleteStudent } = useAppContext();
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sectionFilter, setSectionFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchSearch = `${s.firstName} ${s.lastName} ${s.id}`.toLowerCase().includes(search.toLowerCase());
      const matchLevel = levelFilter === 'all' || s.level === levelFilter;
      const matchSection = sectionFilter === 'all' || s.section === sectionFilter;
      return matchSearch && matchLevel && matchSection;
    });
  }, [students, search, levelFilter, sectionFilter]);

  const [form, setForm] = useState({
    firstName: '', lastName: '', dob: '', gender: 'M' as 'M' | 'F',
    level: 'prenursery' as Level, section: 'english' as Section,
    parentName: '', parentPhone: '', parentEmail: '',
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.parentName || !form.parentPhone) {
      toast.error(language === 'en' ? 'Please fill all required fields' : 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    const newStudent: Student = {
      id: `BSME-2026-S${String(students.length + 1).padStart(4, '0')}`,
      firstName: form.firstName,
      lastName: form.lastName,
      dateOfBirth: form.dob,
      gender: form.gender,
      level: form.level,
      section: form.section,
      parentId: `P${String(students.length + 1).padStart(4, '0')}`,
      parentName: form.parentName,
      parentPhone: form.parentPhone,
      parentEmail: form.parentEmail,
      paymentRef: `PAY-${form.lastName.toUpperCase().slice(0, 3)}-${String(students.length + 1).padStart(4, '0')}`,
      photo: IMAGES.students[Math.floor(Math.random() * IMAGES.students.length)],
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
    };
    addStudent(newStudent);
    setShowAddModal(false);
    setForm({ firstName: '', lastName: '', dob: '', gender: 'M', level: 'prenursery', section: 'english', parentName: '', parentPhone: '', parentEmail: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('dash.students', language)}</h2>
          <p className="text-sm text-gray-500">{language === 'en' ? `${filtered.length} students found` : `${filtered.length} élèves trouvés`}</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast.success(language === 'en' ? 'Export started' : 'Export démarré')} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-all">
            <Download className="w-4 h-4" /> {language === 'en' ? 'Export' : 'Exporter'}
          </button>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-800 flex items-center gap-2 shadow-lg transition-all">
            <Plus className="w-4 h-4" /> {t('student.add', language)}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('student.search', language)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
          />
        </div>
        <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">{language === 'en' ? 'All Levels' : 'Tous les Niveaux'}</option>
          {LEVELS.map(l => <option key={l.value} value={l.value}>{language === 'en' ? l.labelEn : l.labelFr}</option>)}
        </select>
        <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
          <option value="all">{t('common.all', language)}</option>
          <option value="english">{t('common.english', language)}</option>
          <option value="french">{t('common.french', language)}</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t('student.name', language)}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">{t('student.level', language)}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">{t('student.section', language)}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">{t('student.parent', language)}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t('student.actions', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{student.id.slice(-8)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={student.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-gray-400 md:hidden">{getLevelLabel(student.level, language)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{getLevelLabel(student.level, language)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${student.section === 'english' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {student.section === 'english' ? 'EN' : 'FR'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden lg:table-cell">{student.parentName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedStudent(student)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-all" title={t('common.view', language)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteStudent(student.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-all" title={t('common.delete', language)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{language === 'en' ? 'No students found' : 'Aucun élève trouvé'}</p>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2"><UserPlus className="w-5 h-5 text-blue-600" /> {t('student.add', language)}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'First Name *' : 'Prénom *'}</label>
                  <input type="text" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Last Name *' : 'Nom *'}</label>
                  <input type="text" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Date of Birth' : 'Date de Naissance'}</label>
                  <input type="date" value={form.dob} onChange={e => setForm(p => ({ ...p, dob: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Gender' : 'Genre'}</label>
                  <select value={form.gender} onChange={e => setForm(p => ({ ...p, gender: e.target.value as 'M' | 'F' }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="M">{language === 'en' ? 'Male' : 'Masculin'}</option>
                    <option value="F">{language === 'en' ? 'Female' : 'Féminin'}</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('student.level', language)} *</label>
                  <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value as Level }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                    {LEVELS.map(l => <option key={l.value} value={l.value}>{language === 'en' ? l.labelEn : l.labelFr}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('student.section', language)} *</label>
                  <select value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value as Section }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="english">{t('common.english', language)}</option>
                    <option value="french">{t('common.french', language)}</option>
                  </select>
                </div>
              </div>
              <hr className="border-gray-100" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Parent/Guardian Name *' : 'Nom du Parent/Tuteur *'}</label>
                <input type="text" value={form.parentName} onChange={e => setForm(p => ({ ...p, parentName: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Phone *' : 'Téléphone *'}</label>
                  <input type="tel" value={form.parentPhone} onChange={e => setForm(p => ({ ...p, parentPhone: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+237..." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.parentEmail} onChange={e => setForm(p => ({ ...p, parentEmail: e.target.value }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
                  {t('common.cancel', language)}
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
                  {t('common.save', language)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{language === 'en' ? 'Student Details' : 'Détails de l\'Élève'}</h3>
              <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img src={selectedStudent.photo} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{selectedStudent.firstName} {selectedStudent.lastName}</h4>
                  <p className="text-sm text-gray-500">{selectedStudent.id}</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: language === 'en' ? 'Level' : 'Niveau', value: getLevelLabel(selectedStudent.level, language) },
                  { label: 'Section', value: selectedStudent.section === 'english' ? t('common.english', language) : t('common.french', language) },
                  { label: language === 'en' ? 'Date of Birth' : 'Date de Naissance', value: selectedStudent.dateOfBirth },
                  { label: language === 'en' ? 'Gender' : 'Genre', value: selectedStudent.gender === 'M' ? (language === 'en' ? 'Male' : 'Masculin') : (language === 'en' ? 'Female' : 'Féminin') },
                  { label: language === 'en' ? 'Parent' : 'Parent', value: selectedStudent.parentName },
                  { label: language === 'en' ? 'Phone' : 'Téléphone', value: selectedStudent.parentPhone },
                  { label: language === 'en' ? 'Payment Ref' : 'Réf. Paiement', value: selectedStudent.paymentRef },
                  { label: language === 'en' ? 'Enrolled' : 'Inscrit', value: selectedStudent.enrollmentDate },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium text-gray-900">{item.value}</span>
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

export default StudentManagement;
