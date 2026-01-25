import { Outlet, Link } from 'react-router-dom';
import { Shield, Info, FileText, Search, Lock, Menu, X, Facebook } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="glass sticky top-0 z-50 border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-4">
                            <a href="https://www.schb.dz/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity" title="Visiter SCHB">
                                <img src="/Logo-Gica.png" alt="Logo" className="w-auto h-12 md:h-16 object-contain z-10 relative" />
                            </a>
                            <div className="hidden md:block h-8 w-px bg-slate-300"></div>
                            <Link to="/">
                                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent truncate max-w-[200px] md:max-w-none">
                                    Anti Corruption schb
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link to="/" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Accueil</Link>
                            <Link to="/submit" className="text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                                <FileText className="w-4 h-4" /> Déposer une Plainte
                            </Link>
                            <Link to="/track" className="text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                                <Search className="w-4 h-4" /> Suivi
                            </Link>
                            <Link to="/about" className="text-slate-600 hover:text-primary-600 font-medium transition-colors flex items-center gap-1">
                                <Info className="w-4 h-4" /> À Propos
                            </Link>
                            <Link to="/admin/login" className="px-4 py-2 text-slate-500 hover:text-primary-600 font-medium transition-colors flex items-center gap-1 border border-slate-200 rounded-lg">
                                <Lock className="w-4 h-4" /> Admin
                            </Link>
                        </div>

                        {/* Mobile Hamburger Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:text-primary-700 hover:bg-slate-50 rounded-lg transition-colors z-50"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-xl z-40 animate-in slide-in-from-top-4 duration-200 border-t border-slate-100 shadow-xl h-[calc(100vh-4rem)] overflow-y-auto">
                        <div className="flex flex-col p-6 space-y-2">
                            <Link
                                to="/"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-semibold text-slate-700 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-xl transition-all"
                            >
                                Accueil
                            </Link>
                            <Link
                                to="/submit"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-semibold text-slate-700 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                <FileText className="w-5 h-5" /> Déposer une Plainte
                            </Link>
                            <Link
                                to="/track"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-semibold text-slate-700 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                <Search className="w-5 h-5" /> Suivi
                            </Link>
                            <Link
                                to="/about"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-semibold text-slate-700 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-xl transition-all flex items-center gap-2"
                            >
                                <Info className="w-5 h-5" /> À Propos
                            </Link>
                            <Link
                                to="/admin/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-semibold text-slate-700 hover:text-primary-700 hover:bg-primary-50 px-4 py-3 rounded-xl transition-all flex items-center gap-2 border-t border-slate-100 mt-2 pt-4"
                            >
                                <Lock className="w-5 h-5" /> Admin
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="bg-slate-900 text-slate-400 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        <div>
                            <h3 className="text-white font-bold text-lg mb-4">Anti Corruption schb</h3>
                            <p className="mb-4">Plateforme sécurisée pour signaler la corruption de manière confidentielle.</p>
                            <div className="flex gap-4">
                                <a href="https://www.facebook.com/CIMENTERIE.HAMMA.BOUZIANE/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors">
                                    <Facebook className="w-6 h-6" />
                                </a>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <h3 className="text-white font-bold text-lg mb-4">Coordonnées</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                                <div>
                                    <h4 className="font-semibold text-slate-300">Direction Générale</h4>
                                    <p>Tél: 213 31 60 65 43</p>
                                    <p>Fax: 213 31 60 65 39</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-300">Unité de Production</h4>
                                    <p>Tél: 213 31 90 68 45</p>
                                    <p>Fax: 213 31 90 66 23</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-300">UC Constantine</h4>
                                    <p>Tél: 213 31 86 40 40</p>
                                    <p>Fax: 213 31 86 40 03</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-300">UC Annaba</h4>
                                    <p>Tél: 213 30 82 24 10</p>
                                    <p>Fax: 213 30 82 24 10</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-300">UC Skikda</h4>
                                    <p>Tél: 213 38 75 26 63</p>
                                    <p>Fax: 213 38 75 26 63</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-6 text-center text-sm">
                        <p>© 2026 Plateforme Anti-Corruption. Tous droits réservés.</p>
                        <p className="mt-2">Ensemble pour un avenir plus propre et plus transparent.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PublicLayout;
