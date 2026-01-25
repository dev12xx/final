import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Send, CheckCircle2, RefreshCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ComplaintFormPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Charter, 2: Email/Captcha, 3: Form, 4: Success
    const [loading, setLoading] = useState(false);

    // Charter State
    const [charterAccepted, setCharterAccepted] = useState(false);

    // Captcha State
    const [captchaVal, setCaptchaVal] = useState('');
    const [userInputCaptcha, setUserInputCaptcha] = useState('');
    const [captchaError, setCaptchaError] = useState(false);

    // Email State
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        location: '',
        date: '',
        anonymous: true,
        name: '',
        phone: '',
        department: '', // For employee
        relationship: '', // For external
    });

    useEffect(() => {
        generateCaptcha();
    }, []);

    const generateCaptcha = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaVal(result);
    };

    const handleCharterSubmit = (e) => {
        e.preventDefault();
        if (charterAccepted) {
            setStep(2);
        }
    };

    const handleEmailCaptchaSubmit = (e) => {
        e.preventDefault();
        if (userInputCaptcha.toUpperCase() !== captchaVal) {
            setCaptchaError(true);
            generateCaptcha();
            setUserInputCaptcha('');
            return;
        }

        setCaptchaError(false);
        setLoading(true);
        setTimeout(() => {
            const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log("------------------------------------------");
            console.log(`CODE DE VÉRIFICATION : ${randomOtp}`);
            console.log("------------------------------------------");
            setSentOtp(randomOtp);
            setLoading(false);
        }, 1000);
    };

    const handleOtpVerify = (e) => {
        e.preventDefault();
        if (otp === sentOtp) {
            setStep(3);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
            const newSubmission = {
                ...formData,
                id: `REF-${Math.floor(Math.random() * 9000) + 1000}`,
                type,
                dateSubmitted: new Date().toISOString().split('T')[0],
                status: 'Pending',
                email
            };
            submissions.push(newSubmission);
            localStorage.setItem('submissions', JSON.stringify(submissions));
            setStep(4);
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="py-12 px-4 min-h-screen bg-slate-50">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12 flex items-center justify-between">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center flex-1 last:flex-none">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step >= i ? 'bg-primary-600 border-primary-600 text-white' : 'bg-white border-slate-300 text-slate-400'
                                }`}>
                                {step > i ? <CheckCircle2 className="w-6 h-6" /> : i}
                            </div>
                            {i < 4 && (
                                <div className={`h-1 flex-grow mx-2 rounded-full transition-all ${step > i ? 'bg-primary-600' : 'bg-slate-200'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12 border border-slate-200">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Confidentiality Charter */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Charte de Confidentialité</h2>
                                    <p className="text-slate-600">Veuillez lire et accepter notre charte de confidentialité avant de continuer.</p>
                                </div>

                                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-8 max-h-60 overflow-y-auto text-sm text-slate-600 leading-relaxed">
                                    <p className="mb-4"><strong>Introduction</strong>: Cette charte de confidentialité explique comment nous traitons vos données lors de la soumission d'une plainte anti-corruption.</p>
                                    <p className="mb-4"><strong>Anonymat</strong>: Nous garantissons votre anonymat si vous choisissez l'option de soumission anonyme. Vos données de connexion sont traitées avec la plus grande confidentialité.</p>
                                    <p className="mb-4"><strong>Utilisation des données</strong>: Les informations fournies seront utilisées exclusivement à des fins d'enquête interne et ne seront jamais partagées avec des tiers sans votre consentement explicite, sauf obligation légale.</p>
                                    <p className="mb-4"><strong>Sécurité</strong>: Nous utilisons des protocoles de sécurité avancés pour protéger vos informations contre tout accès non autorisé.</p>
                                    <p>En acceptant cette charte, vous confirmez que les informations fournies sont sincères et exactes au mieux de votre connaissance.</p>
                                </div>

                                <form onSubmit={handleCharterSubmit} className="space-y-6">
                                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-white border border-slate-200 rounded-xl hover:border-primary-500 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-primary-600"
                                            checked={charterAccepted}
                                            onChange={(e) => setCharterAccepted(e.target.checked)}
                                            required
                                        />
                                        <span className="font-medium text-slate-700">J'ai lu et j'accepte la charte de confidentialité</span>
                                    </label>
                                    <button
                                        type="submit"
                                        disabled={!charterAccepted}
                                        className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continuer
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 2: Email & Captcha Verification */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <Mail className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold">Vérification de Sécurité</h2>
                                    <p className="text-slate-600">Veuillez fournir votre email et résoudre le captcha pour continuer.</p>
                                </div>

                                {!sentOtp ? (
                                    <form onSubmit={handleEmailCaptchaSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Adresse Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="input-field"
                                                placeholder="votre@email.com"
                                            />
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-slate-100">
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Sécurité (Captcha)</label>
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="flex items-center gap-4 bg-slate-100 p-6 rounded-2xl border-2 border-dashed border-slate-300 select-none w-full justify-center">
                                                    <span className="text-3xl font-mono font-bold tracking-[0.5em] text-slate-800 italic transform skew-x-12">
                                                        {captchaVal}
                                                    </span>
                                                    <button type="button" onClick={generateCaptcha} className="text-primary-600 hover:rotate-180 transition-transform duration-500">
                                                        <RefreshCw className="w-6 h-6" />
                                                    </button>
                                                </div>

                                                <input
                                                    type="text"
                                                    placeholder="Entrez les caractères"
                                                    value={userInputCaptcha}
                                                    onChange={(e) => setUserInputCaptcha(e.target.value)}
                                                    className={`input-field text-center text-xl tracking-widest uppercase font-bold px-4 ${captchaError ? 'border-rose-500 ring-2 ring-rose-500/20' : ''}`}
                                                    required
                                                />
                                                {captchaError && <p className="text-rose-500 text-sm">Caractères incorrects. Réessayez.</p>}
                                            </div>
                                        </div>

                                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Envoyer le code de vérification'}
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleOtpVerify} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Code de Vérification (Entrez 123456)</label>
                                            <input
                                                type="text"
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="input-field text-center text-2xl tracking-[0.2em] font-bold"
                                                placeholder="••••••"
                                                maxLength={6}
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary w-full py-4">Vérifier & Procéder</button>
                                        <button type="button" onClick={() => setSentOtp('')} className="text-primary-600 w-full text-sm font-medium">Réinitialiser l'Email</button>
                                    </form>
                                )}
                            </motion.div>
                        )}

                        {/* Step 3: Actual Form */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold capitalize">Formulaire de Plainte - {type === 'client' ? 'Client' : type === 'employee' ? 'Employé' : 'Partenaire Externe'}</h2>
                                    <p className="text-slate-600">Veuillez fournir autant de détails que possible pour aider notre enquête.</p>
                                </div>

                                <form onSubmit={handleFormSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Objet</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="ex: Processus d'appel d'offres déloyal"
                                            className="input-field"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Date de l'incident</label>
                                            <input
                                                type="date"
                                                required
                                                className="input-field"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Lieu</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Bureau / Nom du site"
                                                className="input-field"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {type === 'client' && (
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Nom complet</label>
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="ex: Jean Dupont"
                                                    className="input-field"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Numéro de téléphone</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="ex: +213..."
                                                    className="input-field"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {type === 'employee' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Votre Département</label>
                                            <input
                                                type="text"
                                                placeholder="ex: IT, Finance"
                                                className="input-field"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            />
                                        </div>
                                    )}

                                    {type === 'external' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Relation avec l'organisation</label>
                                            <select
                                                className="input-field"
                                                value={formData.relationship}
                                                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                                            >
                                                <option value="">Sélectionnez une option</option>
                                                <option value="supplier">Fournisseur</option>
                                                <option value="contractor">Prestataire</option>
                                                <option value="other">Autre</option>
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                        <textarea
                                            required
                                            rows={5}
                                            placeholder="Décrivez l'incident en détail..."
                                            className="input-field resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        ></textarea>
                                    </div>

                                    {type !== 'client' && (
                                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    className="w-5 h-5 accent-primary-600"
                                                    checked={formData.anonymous}
                                                    onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
                                                />
                                                <span className="font-medium text-slate-700">Soumettre anonymement</span>
                                            </label>
                                            {!formData.anonymous && (
                                                <div className="mt-4 grid md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                                    <input
                                                        type="text"
                                                        placeholder="Votre Nom"
                                                        className="input-field"
                                                        required={!formData.anonymous}
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="Numéro de Téléphone"
                                                        className="input-field"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
                                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Send className="w-6 h-6" /> Envoyer le rapport</>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {/* Step 4: Success */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-10"
                            >
                                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-12 h-12" />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Rapport Soumis !</h2>
                                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                    Merci pour votre courage. Votre rapport a été reçu et a reçu un identifiant de référence unique.
                                </p>

                                <div className="bg-primary-50 p-6 rounded-2xl border border-primary-100 mb-8 inline-block px-12">
                                    <p className="text-primary-700 text-sm font-bold uppercase tracking-wider mb-2">ID de Référence</p>
                                    <p className="text-3xl font-mono font-black text-primary-900">REF-{Math.floor(Math.random() * 9000) + 1000}</p>
                                </div>

                                <div className="space-y-4">
                                    <button
                                        onClick={() => navigate('/track')}
                                        className="btn-primary w-full"
                                    >
                                        Suivre le statut
                                    </button>
                                    <button
                                        onClick={() => navigate('/')}
                                        className="w-full text-slate-500 font-medium hover:text-slate-800 transition-colors"
                                    >
                                        Retour à l'accueil
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ComplaintFormPage;
