import { Shield, Target, Users, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
    return (
        <div className="py-16">
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-slate-900 mb-6">À Propos de Notre Mission</h1>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Nous nous engageons à promouvoir l'intégrité, la transparence et la responsabilité à tous les niveaux de la société grâce à un signalement sécurisé et anonyme.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Pourquoi Nous Existons</h2>
                            <p className="text-slate-600 mb-4 leading-relaxed">
                                La corruption érode la confiance, affaiblit la démocratie et entrave le développement économique. Souvent, les individus sont témoins de corruption mais restent silencieux par peur de représailles.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                Notre plateforme a été conçue pour combler ce fossé. En offrant un moyen sûr, crypté et anonyme de signaler les fautes, nous permettons aux citoyens, employés et partenaires de s'élever contre la corruption sans crainte.
                            </p>
                        </div>
                        <div className="bg-primary-50 p-8 rounded-3xl border border-primary-100">
                            <Shield className="w-16 h-16 text-primary-600 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Anonymat Total</h3>
                            <p className="text-slate-600">
                                Nous utilisons un cryptage de pointe pour garantir la protection de votre identité. Vos rapports sont traités avec la plus grande confidentialité.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white p-12 rounded-3xl">
                        <h2 className="text-3xl font-bold mb-12 text-center">Nos Valeurs</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            {[
                                { icon: <Target className="w-10 h-10 mx-auto text-primary-400 mb-4" />, title: "Intégrité" },
                                { icon: <Users className="w-10 h-10 mx-auto text-primary-400 mb-4" />, title: "Confiance" },
                                { icon: <CheckCircle2 className="w-10 h-10 mx-auto text-primary-400 mb-4" />, title: "Justice" }
                            ].map((val, i) => (
                                <div key={i}>
                                    {val.icon}
                                    <h3 className="text-xl font-bold">{val.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
