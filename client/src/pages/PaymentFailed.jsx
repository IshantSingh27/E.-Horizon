import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle, FaRedo, FaArrowLeft } from 'react-icons/fa';

const PaymentFailed = () => {
    return (
        <div className="min-h-[calc(100vh-80px)] bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative bg-white p-10 md:p-14 rounded-[2.5rem] shadow-2xl shadow-rose-500/10 border border-rose-50 max-w-lg w-full text-center z-10 animate-fade-in-up">
                <div className="w-24 h-24 bg-rose-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner -rotate-3">
                    <FaTimesCircle className="text-rose-500 text-5xl drop-shadow-sm" />
                </div>
                
                <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Booking Failed</h1>
                <p className="text-slate-500 mb-10 text-lg font-medium leading-relaxed">
                    We couldn't process your request. Please ensure your details are correct or try again in a few minutes.
                </p>
                
                <div className="space-y-4">
                    <Link to="/" className="flex items-center justify-center gap-3 w-full bg-slate-900 hover:bg-rose-500 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg hover:shadow-rose-500/40 hover:-translate-y-1">
                        <FaArrowLeft /> Return to Events
                    </Link>
                    <Link to="/dashboard" className="flex items-center justify-center gap-2 w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-4 px-6 rounded-2xl transition-colors border border-slate-200">
                        <FaRedo className="text-xs" /> Go to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;