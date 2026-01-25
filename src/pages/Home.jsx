import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, Building, Globe, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 font-semibold text-sm mb-6 border border-primary-100">
                            Signalement Sécurisé & Anonyme
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
                            Luttez contre la corruption. <span className="text-primary-600">Protégez l'avenir.</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            Notre plateforme offre un environnement sécurisé pour signaler les comportements contraires à l'éthique. Ensemble, construisons une société plus transparente.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center font-medium">
                            <button
                                onClick={() => navigate('/submit')}
                                className="btn-primary flex items-center justify-center gap-2"
                            >
                                Déposer une plainte <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate('/about')}
                                className="px-8 py-4 bg-slate-50 text-slate-700 rounded-xl hover:bg-slate-100 transition-all border border-slate-200"
                            >
                                En savoir plus
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-0">
                    <div className="absolute top-[10%] left-[5%] w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob"></div>
                    <div className="absolute bottom-[10%] right-[5%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40 animate-blob animation-delay-2000"></div>
                </div>
            </section>

            {/* Feature Section */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Users className="w-10 h-10 text-primary-600" />,
                                title: "Clients",
                                desc: "Signalez des problèmes liés au service client ou aux interactions publiques.",
                                color: "bg-blue-50"
                            },
                            {
                                icon: <Building className="w-10 h-10 text-emerald-600" />,
                                title: "Employés",
                                desc: "Canal interne sécurisé pour signaler la corruption organisationnelle.",
                                color: "bg-emerald-50"
                            },
                            {
                                icon: <Globe className="w-10 h-10 text-amber-600" />,
                                title: "Externes",
                                desc: "Signalez les fautes des partenaires, fournisseurs ou tiers.",
                                color: "bg-amber-50"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all"
                            >
                                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
