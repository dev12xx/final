import { useNavigate } from 'react-router-dom';
import { Users, Building, Globe, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const FormSelector = () => {
    const navigate = useNavigate();

    const options = [
        {
            id: 'client',
            title: 'Client / Citoyen',
            icon: <Users className="w-8 h-8" />,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            border: 'border-blue-100',
            desc: 'Pour signaler la corruption dans les services publics ou les relations clients.'
        },
        {
            id: 'employee',
            title: 'Employé / Interne',
            icon: <Building className="w-8 h-8" />,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            desc: 'Signalement sécurisé pour les employés au sein d\'une organisation.'
        },
        {
            id: 'external',
            title: 'Partenaire Externe',
            icon: <Globe className="w-8 h-8" />,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            border: 'border-amber-100',
            desc: 'Pour les fournisseurs, prestataires ou tout tiers externe.'
        }
    ];

    return (
        <div className="py-20 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Commencez votre signalement</h1>
                    <p className="text-slate-600">Veuillez sélectionner la catégorie qui décrit le mieux votre situation.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {options.map((opt) => (
                        <motion.button
                            key={opt.id}
                            whileHover={{ y: -8 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(`/submit/${opt.id}`)}
                            className="group flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all"
                        >
                            <div className={`w-20 h-20 ${opt.bg} ${opt.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
                                {opt.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{opt.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">{opt.desc}</p>

                            <div className="w-full pt-4 border-t border-slate-50 flex items-center justify-center gap-2 text-primary-600 font-semibold group-hover:translate-x-1 transition-transform">
                                Continuer <ChevronRight className="w-4 h-4" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FormSelector;
