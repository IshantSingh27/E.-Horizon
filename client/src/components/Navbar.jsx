import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaCompass, FaCalendarAlt, FaLayerGroup, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-white/10 shadow-xl">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center py-5">
                    {/* Logo */}
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="p-2 bg-indigo-500 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-indigo-500/20">
                            <FaCompass className="text-white text-xl" />
                        </div>
                        <span className="text-white text-2xl font-black tracking-tighter">E-Horizon</span>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex items-center gap-10">
                        <Link to="/" className="text-slate-300 hover:text-indigo-400 font-bold text-sm uppercase tracking-widest transition">Events</Link>
                        {user ? (
                            <div className="flex items-center gap-6">
                                <Link 
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                                    className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 font-bold text-sm uppercase tracking-widest transition"
                                >
                                    <FaUserCircle className="text-lg" /> Dashboard
                                </Link>
                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl font-bold text-sm transition"
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-6">
                                <Link to="/login" className="text-slate-300 hover:text-white font-bold text-sm uppercase tracking-widest transition">Login</Link>
                                <Link 
                                    to="/register" 
                                    className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition shadow-lg shadow-indigo-500/20"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Icon (Simple version) */}
                    <div className="md:hidden text-white font-bold">Menu</div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;