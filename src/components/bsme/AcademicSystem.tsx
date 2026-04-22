import React, { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { t } from '@/lib/i18n';
import { getLevelLabel, LEVELS, Grade } from '@/lib/schoolData';
import { Search, FileText, Printer, BookOpen, Award, TrendingUp, X } from 'lucide-react';
import { toast } from 'sonner';

// ============ GRADES VIEW ============
export const GradesView: React.FC = () => {
  const { language, students, grades, updateGrade } = useAppContext();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [search, setSearch] = useState('');
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [editForm, setEditForm] = useState({ ca1: 0, ca2: 0, exam: 0 });

  const filteredStudents = useMemo(() => {
    return students.filter(s => `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()));
  }, [students, search]);

  const studentGrades = useMemo(() => {
    if (!selectedStudent) return [];
    return grades.filter(g => g.studentId === selectedStudent);
  }, [grades, selectedStudent]);

  const student = students.find(s => s.id === selectedStudent);

  const handleEditSave = () => {
    if (!editingGrade) return;
    const total = editForm.ca1 + editForm.ca2 + editForm.exam;
    let grade = 'F';
    if (total >= 80) grade = 'A';
    else if (total >= 70) grade = 'B';
    else if (total >= 60) grade = 'C';
    else if (total >= 50) grade = 'D';
    else if (total >= 40) grade = 'E';
    updateGrade(editingGrade.id, { ca1: editForm.ca1, ca2: editForm.ca2, exam: editForm.exam, total, grade });
    setEditingGrade(null);
    toast.success(language === 'en' ? 'Grade updated' : 'Note mise à jour');
  };

  const avgScore = studentGrades.length > 0
    ? Math.round(studentGrades.reduce((s, g) => s + g.total, 0) / studentGrades.length)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{t('dash.academics', language)}</h2>
        <p className="text-sm text-gray-500">{language === 'en' ? 'Enter and manage student grades' : 'Saisir et gérer les notes des élèves'}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={language === 'en' ? 'Search student...' : 'Rechercher un élève...'} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {filteredStudents.map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStudent(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-all border-b border-gray-50 ${selectedStudent === s.id ? 'bg-blue-50' : ''}`}
              >
                <img src={s.photo} alt="" className="w-8 h-8 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className={`text-sm font-medium truncate ${selectedStudent === s.id ? 'text-blue-700' : 'text-gray-900'}`}>{s.firstName} {s.lastName}</p>
                  <p className="text-xs text-gray-400">{getLevelLabel(s.level, language)} - {s.section === 'english' ? 'EN' : 'FR'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Grades Table */}
        <div className="lg:col-span-2">
          {selectedStudent && student ? (
            <div className="space-y-4">
              {/* Student Summary */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-4">
                  <img src={student.photo} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-white/30" />
                  <div>
                    <h3 className="text-lg font-bold">{student.firstName} {student.lastName}</h3>
                    <p className="text-blue-200 text-sm">{getLevelLabel(student.level, language)} - {student.section === 'english' ? t('common.english', language) : t('common.french', language)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{avgScore}%</p>
                    <p className="text-xs text-blue-200">{language === 'en' ? 'Average' : 'Moyenne'}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{studentGrades.length}</p>
                    <p className="text-xs text-blue-200">{language === 'en' ? 'Subjects' : 'Matières'}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold">{studentGrades.filter(g => g.total >= 50).length}</p>
                    <p className="text-xs text-blue-200">{language === 'en' ? 'Passed' : 'Réussi'}</p>
                  </div>
                </div>
              </div>

              {/* Grades Table */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Subject' : 'Matière'}</th>
                        <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">CA1/20</th>
                        <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">CA2/20</th>
                        <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Exam/60' : 'Examen/60'}</th>
                        <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                        <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Grade' : 'Note'}</th>
                        <th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase">{language === 'en' ? 'Edit' : 'Modifier'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {studentGrades.map(g => (
                        <tr key={g.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{g.subject}</td>
                          <td className="px-3 py-3 text-sm text-center text-gray-600">{g.ca1}</td>
                          <td className="px-3 py-3 text-sm text-center text-gray-600">{g.ca2}</td>
                          <td className="px-3 py-3 text-sm text-center text-gray-600">{g.exam}</td>
                          <td className="px-3 py-3 text-sm text-center font-bold text-gray-900">{g.total}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`inline-flex w-8 h-8 rounded-lg items-center justify-center text-sm font-bold ${

                              g.grade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                              g.grade === 'B' ? 'bg-blue-100 text-blue-700' :
                              g.grade === 'C' ? 'bg-amber-100 text-amber-700' :
                              g.grade === 'D' ? 'bg-orange-100 text-orange-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {g.grade}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              onClick={() => { setEditingGrade(g); setEditForm({ ca1: g.ca1, ca2: g.ca2, exam: g.exam }); }}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-all"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400">{language === 'en' ? 'Select a student to view grades' : 'Sélectionnez un élève pour voir les notes'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Grade Modal */}
      {editingGrade && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditingGrade(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">{language === 'en' ? 'Edit Grade' : 'Modifier la Note'}</h3>
              <button onClick={() => setEditingGrade(null)} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500 font-medium">{editingGrade.subject}</p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CA1 (0-20)</label>
                <input type="number" min={0} max={20} value={editForm.ca1} onChange={e => setEditForm(p => ({ ...p, ca1: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)) }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CA2 (0-20)</label>
                <input type="number" min={0} max={20} value={editForm.ca2} onChange={e => setEditForm(p => ({ ...p, ca2: Math.min(20, Math.max(0, parseInt(e.target.value) || 0)) }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Exam (0-60)' : 'Examen (0-60)'}</label>
                <input type="number" min={0} max={60} value={editForm.exam} onChange={e => setEditForm(p => ({ ...p, exam: Math.min(60, Math.max(0, parseInt(e.target.value) || 0)) }))} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-sm text-gray-500">{language === 'en' ? 'Total' : 'Total'}</p>
                <p className="text-2xl font-bold text-gray-900">{editForm.ca1 + editForm.ca2 + editForm.exam}/100</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditingGrade(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">{t('common.cancel', language)}</button>
                <button onClick={handleEditSave} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">{t('common.save', language)}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============ REPORT CARDS VIEW ============
export const ReportCardsView: React.FC = () => {
  const { language, students, grades } = useAppContext();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [showReport, setShowReport] = useState(false);

  const student = students.find(s => s.id === selectedStudent);
  const studentGrades = grades.filter(g => g.studentId === selectedStudent);
  const avgScore = studentGrades.length > 0 ? Math.round(studentGrades.reduce((s, g) => s + g.total, 0) / studentGrades.length) : 0;

  // Calculate class position (simplified)
  const classmates = students.filter(s => student && s.level === student.level && s.section === student.section);
  const classAverages = classmates.map(s => {
    const sGrades = grades.filter(g => g.studentId === s.id);
    return { id: s.id, avg: sGrades.length > 0 ? sGrades.reduce((sum, g) => sum + g.total, 0) / sGrades.length : 0 };
  }).sort((a, b) => b.avg - a.avg);
  const position = classAverages.findIndex(c => c.id === selectedStudent) + 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('dash.reports', language)}</h2>
          <p className="text-sm text-gray-500">{language === 'en' ? 'Generate and print student report cards' : 'Générer et imprimer les bulletins des élèves'}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">{language === 'en' ? 'Select Student' : 'Sélectionner un Élève'}</label>
          <select value={selectedStudent} onChange={e => { setSelectedStudent(e.target.value); setShowReport(false); }} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">{language === 'en' ? 'Choose a student...' : 'Choisir un élève...'}</option>
            {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName} - {getLevelLabel(s.level, language)}</option>)}
          </select>
        </div>
        <button
          onClick={() => { if (selectedStudent) setShowReport(true); else toast.error(language === 'en' ? 'Select a student first' : 'Sélectionnez d\'abord un élève'); }}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-2 transition-all"
        >
          <FileText className="w-4 h-4" /> {language === 'en' ? 'Generate Report' : 'Générer le Bulletin'}
        </button>
      </div>

      {showReport && student && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden print:shadow-none print:border-0">
          <div className="flex justify-end p-4 print:hidden">
            <button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center gap-2">
              <Printer className="w-4 h-4" /> {t('common.print', language)}
            </button>
          </div>

          {/* Report Card Content */}
          <div className="px-8 pb-8">
            {/* Header */}
            <div className="text-center border-b-2 border-blue-600 pb-4 mb-6">
              <h1 className="text-2xl font-bold text-blue-800">BSME ACADEMY</h1>
              <p className="text-sm text-gray-500">Bilingual School of Management & Excellence</p>
              <p className="text-sm text-gray-500">Douala, Cameroon | Tel: +237 670 001 000</p>
              <h2 className="text-lg font-bold text-gray-900 mt-3">
                {language === 'en' ? 'STUDENT REPORT CARD' : 'BULLETIN DE NOTES'} - {language === 'en' ? 'Term 1' : 'Trimestre 1'}
              </h2>
            </div>

            {/* Student Info */}
            <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 rounded-xl p-4">
              <div className="space-y-1">
                <p className="text-sm"><span className="text-gray-500">{language === 'en' ? 'Name:' : 'Nom:'}</span> <span className="font-semibold">{student.firstName} {student.lastName}</span></p>
                <p className="text-sm"><span className="text-gray-500">ID:</span> <span className="font-semibold">{student.id}</span></p>
                <p className="text-sm"><span className="text-gray-500">{language === 'en' ? 'Class:' : 'Classe:'}</span> <span className="font-semibold">{getLevelLabel(student.level, language)}</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-sm"><span className="text-gray-500">Section:</span> <span className="font-semibold">{student.section === 'english' ? t('common.english', language) : t('common.french', language)}</span></p>
                <p className="text-sm"><span className="text-gray-500">{language === 'en' ? 'Position:' : 'Rang:'}</span> <span className="font-semibold">{position}/{classmates.length}</span></p>
                <p className="text-sm"><span className="text-gray-500">{language === 'en' ? 'Average:' : 'Moyenne:'}</span> <span className="font-semibold text-blue-600">{avgScore}%</span></p>
              </div>
            </div>

            {/* Grades Table */}
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border border-blue-700 px-3 py-2 text-left text-xs">{language === 'en' ? 'Subject' : 'Matière'}</th>
                  <th className="border border-blue-700 px-3 py-2 text-center text-xs">CA1/20</th>
                  <th className="border border-blue-700 px-3 py-2 text-center text-xs">CA2/20</th>
                  <th className="border border-blue-700 px-3 py-2 text-center text-xs">{language === 'en' ? 'Exam/60' : 'Examen/60'}</th>
                  <th className="border border-blue-700 px-3 py-2 text-center text-xs">Total/100</th>
                  <th className="border border-blue-700 px-3 py-2 text-center text-xs">{language === 'en' ? 'Grade' : 'Note'}</th>
                  <th className="border border-blue-700 px-3 py-2 text-left text-xs">{language === 'en' ? 'Remark' : 'Remarque'}</th>
                </tr>
              </thead>
              <tbody>
                {studentGrades.map((g, i) => (
                  <tr key={g.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-3 py-2 text-sm font-medium">{g.subject}</td>
                    <td className="border border-gray-200 px-3 py-2 text-sm text-center">{g.ca1}</td>
                    <td className="border border-gray-200 px-3 py-2 text-sm text-center">{g.ca2}</td>
                    <td className="border border-gray-200 px-3 py-2 text-sm text-center">{g.exam}</td>
                    <td className="border border-gray-200 px-3 py-2 text-sm text-center font-bold">{g.total}</td>
                    <td className="border border-gray-200 px-3 py-2 text-sm text-center font-bold">{g.grade}</td>
                    <td className="border border-gray-200 px-3 py-2 text-xs text-gray-600">
                      {language === 'en' ? g.commentEn : g.commentFr}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50 font-bold">
                  <td className="border border-gray-200 px-3 py-2 text-sm" colSpan={4}>{language === 'en' ? 'Overall Average' : 'Moyenne Générale'}</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-center text-blue-700">{avgScore}%</td>
                  <td className="border border-gray-200 px-3 py-2 text-sm text-center" colSpan={2}>
                    {avgScore >= 80 ? 'A' : avgScore >= 70 ? 'B' : avgScore >= 60 ? 'C' : avgScore >= 50 ? 'D' : avgScore >= 40 ? 'E' : 'F'}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Teacher Comment */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{language === 'en' ? 'Class Teacher\'s Comment (EN)' : 'Commentaire de l\'Enseignant (EN)'}</h4>
                <p className="text-sm text-gray-600 italic">
                  {avgScore >= 70 ? 'An excellent student with great potential. Keep up the good work!' : avgScore >= 50 ? 'A good student who can improve with more effort and dedication.' : 'Needs significant improvement. Parents are advised to provide additional support.'}
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{language === 'en' ? 'Class Teacher\'s Comment (FR)' : 'Commentaire de l\'Enseignant (FR)'}</h4>
                <p className="text-sm text-gray-600 italic">
                  {avgScore >= 70 ? 'Un(e) excellent(e) élève avec un grand potentiel. Continuez ainsi!' : avgScore >= 50 ? 'Un(e) bon(ne) élève qui peut s\'améliorer avec plus d\'efforts et de dévouement.' : 'Nécessite une amélioration significative. Les parents sont invités à fournir un soutien supplémentaire.'}
                </p>
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="border-b border-gray-300 mb-2 h-12" />
                <p className="text-xs text-gray-500">{language === 'en' ? 'Class Teacher' : 'Enseignant'}</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-300 mb-2 h-12" />
                <p className="text-xs text-gray-500">{language === 'en' ? 'Principal' : 'Directeur/Directrice'}</p>
              </div>
              <div className="text-center">
                <div className="border-b border-gray-300 mb-2 h-12" />
                <p className="text-xs text-gray-500">{language === 'en' ? 'Parent/Guardian' : 'Parent/Tuteur'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradesView;
