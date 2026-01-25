import { useState } from 'react';
import { Search, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatusChecker = () => {
    const [complaintId, setComplaintId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!complaintId) return;

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            // Mock result
            if (complaintId === 'REF-123') {
                setResult({
                    id: 'REF-123',
                    status: 'Accepté',
                    date: '2026-01-20',
                    message: 'Votre rapport a été vérifié et transmis au comité d\'enquête.'
                });
            } else if (complaintId === 'REF-456') {
                setResult({
                    id: 'REF-456',
                    status: 'Refusé',
                    date: '2026-01-21',
                    message: 'Preuves insuffisantes fournies. Veuillez soumettre un nouveau rapport avec plus de détails.'
                });
            } else {
                setResult({
                    id: complaintId,
                    status: 'En cours',
                    date: '2026-01-24',
                    message: 'Votre rapport est actuellement en cours d\'examen par notre équipe.'
                });
            }
            setLoading(false);
        }, 1500);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Accepté': return <CheckCircle2 className="w-12 h-12 text-emerald-500" />;
            case 'Refusé': return <XCircle className="w-12 h-12 text-rose-500" />;
            default: return <Clock className="w-12 h-12 text-amber-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Accepté': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Refusé': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-amber-50 text-amber-700 border-amber-100';
        }
    };

    return (
        <div className="py-20 min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-3">Suivez votre plainte</h1>
                        <p className="text-slate-600">Entrez l'identifiant de référence fourni après la soumission pour voir le statut actuel.</p>
                    </div>

                    <form onSubmit={handleSearch} className="mb-10">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ID de Référence (ex: REF-123)"
                                value={complaintId}
                                onChange={(e) => setComplaintId(e.target.value)}
                                className="input-field pr-32"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-300 transition-colors flex items-center gap-2"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Search className="w-4 h-4" /> Rechercher</>}
                            </button>
                        </div>
                    </form>

                    <AnimatePresence mode="wait">
                        {result && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="p-8 rounded-2xl border bg-slate-50"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-4">
                                        {getStatusIcon(result.status)}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Statut: {result.status}</h3>
                                    <div className={`px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border ${getStatusColor(result.status)}`}>
                                        Réf: {result.id}
                                    </div>
                                    <p className="text-slate-600 mb-4">{result.message}</p>
                                    <p className="text-sm text-slate-400">Dernière mise à jour: {result.date}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default StatusChecker;
