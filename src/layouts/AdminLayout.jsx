import { Outlet, Navigate, Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, Shield } from 'lucide-react';

const AdminLayout = () => {
    // Simple check for simulation
    const isAuthenticated = localStorage.getItem('isAdmin');

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    return (
        <div className="min-h-screen bg-slate-100 flex">
            <aside className="w-64 bg-white border-r border-slate-200 sticky top-0 h-screen">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <img src="/Logo-Gica.png" alt="Logo" className="w-12 h-12 object-contain" />
                        <div className="h-8 w-px bg-slate-200"></div>
                        <span className="font-bold text-lg">Anti Corruption schb</span>
                    </div>

                    <nav className="space-y-2">
                        <Link to="/admin" className="flex items-center gap-3 p-3 bg-primary-50 text-primary-700 rounded-lg font-medium">
                            <LayoutDashboard className="w-5 h-5" /> Tableau de Bord
                        </Link>
                        <button
                            onClick={() => {
                                localStorage.removeItem('isAdmin');
                                window.location.href = '/admin/login';
                            }}
                            className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            <LogOut className="w-5 h-5" /> Déconnexion
                        </button>
                    </nav>
                </div>
            </aside>

            <main className="flex-grow p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
