import { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Clock, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [submissions, setSubmissions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState(null);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('submissions') || '[]');
        setSubmissions(data);
    }, []);

    const updateStatus = (id, newStatus) => {
        const updated = submissions.map(s => s.id === id ? { ...s, status: newStatus } : s);
        setSubmissions(updated);
        localStorage.setItem('submissions', JSON.stringify(updated));
        if (selectedSubmission && selectedSubmission.id === id) {
            setSelectedSubmission({ ...selectedSubmission, status: newStatus });
        }
    };

    const deleteSubmission = (id) => {
        const updated = submissions.filter(s => s.id !== id);
        setSubmissions(updated);
        localStorage.setItem('submissions', JSON.stringify(updated));
        if (selectedSubmission && selectedSubmission.id === id) {
            setSelectedSubmission(null);
        }
    };

    const filteredSubmissions = submissions.filter(s =>
        filter === 'all' ? true :
            (filter === 'en cours' && s.status === 'Pending') ||
            (filter === 'accepté' && s.status === 'Accepted') ||
            (filter === 'refusé' && s.status === 'Declined')
    );

    return (
        <div>
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Gestion des Signalements</h1>
                    <p className="text-slate-500">Suivez et gérez les plaintes déposées.</p>
                </div>

                <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200">
                    {[
                        { id: 'all', label: 'Tout' },
                        { id: 'en cours', label: 'En cours' },
                        { id: 'accepté', label: 'Accepté' },
                        { id: 'refusé', label: 'Refusé' }
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f.id ? 'bg-primary-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Référence</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Objet</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider">Statut</th>
                                <th className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredSubmissions.length > 0 ? filteredSubmissions.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-primary-700">{sub.id}</td>
                                    <td className="px-6 py-4 capitalize">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${sub.type === 'employee' ? 'bg-emerald-100 text-emerald-700' :
                                            sub.type === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                            {sub.type === 'client' ? 'Client' : sub.type === 'employee' ? 'Employé' : 'Externe'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{sub.subject}</td>
                                    <td className="px-6 py-4 text-slate-500">{sub.dateSubmitted}</td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1.5 font-semibold ${sub.status === 'Accepted' ? 'text-emerald-600' :
                                            sub.status === 'Declined' ? 'text-rose-600' : 'text-amber-600'
                                            }`}>
                                            {sub.status === 'Accepted' ? <CheckCircle className="w-4 h-4" /> :
                                                sub.status === 'Declined' ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                            {sub.status === 'Accepted' ? 'Accepté' : sub.status === 'Declined' ? 'Refusé' : 'En cours'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => setSelectedSubmission(sub)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg" title="Voir les détails"><Eye className="w-5 h-5" /></button>
                                            <button onClick={() => updateStatus(sub.id, 'Accepted')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Accepter"><CheckCircle className="w-5 h-5" /></button>
                                            <button onClick={() => updateStatus(sub.id, 'Declined')} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg" title="Refuser"><XCircle className="w-5 h-5" /></button>
                                            <button onClick={() => deleteSubmission(sub.id)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-rose-600 rounded-lg" title="Supprimer"><Trash2 className="w-5 h-5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-20 text-center text-slate-400">
                                        Aucun signalement trouvé.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 border-b border-slate-100 sticky top-0 bg-white z-10 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Détails du Signalement</h2>
                                <p className="text-primary-600 font-mono font-bold">{selectedSubmission.id}</p>
                            </div>
                            <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <XCircle className="w-8 h-8 text-slate-300" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Statut Actuel</label>
                                    <span className={`inline-flex items-center gap-1.5 font-bold px-3 py-1 rounded-full text-sm ${selectedSubmission.status === 'Accepted' ? 'bg-emerald-50 text-emerald-700' :
                                        selectedSubmission.status === 'Declined' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                        {selectedSubmission.status === 'Accepted' ? 'Accepté' : selectedSubmission.status === 'Declined' ? 'Refusé' : 'En cours'}
                                    </span>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Date de Soumission</label>
                                    <p className="font-semibold text-slate-900">{selectedSubmission.dateSubmitted}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Type de Profil</label>
                                    <p className="font-semibold text-slate-900 capitalize">{selectedSubmission.type === 'client' ? 'Client' : selectedSubmission.type === 'employee' ? 'Employé' : 'Externe'}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Lieu</label>
                                    <p className="font-semibold text-slate-900">{selectedSubmission.location}</p>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Objet</label>
                                <p className="text-lg font-bold text-slate-900 mb-4">{selectedSubmission.subject}</p>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Description des faits</label>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedSubmission.description}</p>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="font-bold text-slate-900">Informations Complémentaires</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    {selectedSubmission.name && (
                                        <div>
                                            <span className="text-slate-400 block">Nom complet</span>
                                            <span className="font-semibold text-slate-700">{selectedSubmission.name}</span>
                                        </div>
                                    )}
                                    {selectedSubmission.phone && (
                                        <div>
                                            <span className="text-slate-400 block">Téléphone</span>
                                            <span className="font-semibold text-slate-700">{selectedSubmission.phone}</span>
                                        </div>
                                    )}
                                    {selectedSubmission.email && (
                                        <div>
                                            <span className="text-slate-400 block">Email de contact</span>
                                            <span className="font-semibold text-slate-700">{selectedSubmission.email}</span>
                                        </div>
                                    )}
                                    {selectedSubmission.department && (
                                        <div>
                                            <span className="text-slate-400 block">Département</span>
                                            <span className="font-semibold text-slate-700">{selectedSubmission.department}</span>
                                        </div>
                                    )}
                                    {selectedSubmission.relationship && (
                                        <div>
                                            <span className="text-slate-400 block">Relation</span>
                                            <span className="font-semibold text-slate-700">{selectedSubmission.relationship}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="text-slate-400 block">Anonymat</span>
                                        <span className="font-semibold text-slate-700">{selectedSubmission.anonymous ? 'Oui' : 'Non'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-slate-100">
                                <button onClick={() => updateStatus(selectedSubmission.id, 'Accepted')} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors">Accepter</button>
                                <button onClick={() => updateStatus(selectedSubmission.id, 'Declined')} className="flex-1 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors">Refuser</button>
                                <button onClick={() => deleteSubmission(selectedSubmission.id)} className="px-4 py-3 bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
