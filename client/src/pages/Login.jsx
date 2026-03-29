import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // New state for eye icon
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, verifyOTP } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (!showOTP) {
                const data = await login(email, password);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/'); 
            } else {
                const data = await verifyOTP(email, otp);
                if (data.role === 'admin') navigate('/admin');
                else navigate('/'); 
            }
        } catch (err) {
            if (err.needsVerification) {
                setShowOTP(true);
                setError('Account not verified. A new OTP has been sent to your email.');
            } else {
                setError(err.message || err);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4">
            
            {/* Background Accent Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100 z-10">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Welcome Back</h2>
                    <p className="text-slate-500 font-medium">Sign in to your E-Horizon account</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-8 text-center border border-red-100 font-bold text-sm shadow-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!showOTP ? (
                        <>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder-slate-400"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"} // Toggles between text and password
                                        required
                                        className="w-full pl-5 pr-12 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder-slate-400"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center">Verification Code (OTP)</label>
                            <input
                                type="text"
                                required
                                placeholder="000000"
                                className="w-full px-5 py-5 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-black tracking-[1em] text-center text-3xl text-slate-900 placeholder-slate-300 shadow-inner"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength="6"
                            />
                            <p className="text-center text-xs text-indigo-500 font-bold mt-4 animate-pulse">Check your email for the code</p>
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1 disabled:opacity-70 disabled:hover:transform-none"
                    >
                        {loading ? 'Processing...' : (showOTP ? 'Verify OTP & Log In' : 'Sign In')}
                    </button>
                </form>

                <p className="text-center mt-10 text-slate-500 text-sm font-medium">
                    Don't have an account? <Link to="/register" className="text-indigo-600 font-black hover:text-indigo-500 transition-colors ml-1">Sign up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;