import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Shield, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Simple mock logic
        if (username === 'admin' && password === 'admin') {
            localStorage.setItem('isAdmin', 'true');
            navigate('/admin');
        } else {
            setError(true);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4 p-4">
                        <img src="/Logo-Gica.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Accès Administrateur</h1>
                    <p className="text-slate-500">Entrez vos identifiants pour gérer les rapports</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">Nom d'utilisateur ou mot de passe invalide.</p>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Nom d'utilisateur</label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input-field pr-12"
                                placeholder="admin"
                            />
                            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Mot de passe</label>
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field pr-12"
                                placeholder="••••••••"
                            />
                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full py-4 text-lg">
                        Se connecter
                    </button>
                </form>

                <p className="text-center text-slate-400 text-sm mt-8">
                    Personnel autorisé uniquement. Tous les accès sont journalisés.
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
