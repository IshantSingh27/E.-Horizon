import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaChair, FaMoneyBillWave, FaArrowLeft } from 'react-icons/fa';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(false);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // IMPORTANT: Ensure you are using backticks ` here for the template literal
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);
            } catch (err) {
                setError('Failed to load event details.');
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [id]);

    const handleBooking = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setBookingLoading(true);
        setError('');
        setSuccessMsg('');

        try {
            if (!showOTP) {
                await api.post('/bookings/send-otp');
                setShowOTP(true);
                setSuccessMsg('OTP sent to your email. Please verify to confirm booking.');
            } else {
                await api.post('/bookings', { eventId: event._id, otp });
                setSuccessMsg('Booking requested! Awaiting admin confirmation.');
                setShowOTP(false);
                setEvent({ ...event, availableSeats: event.availableSeats - 1 });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold animate-pulse">Loading Event Details...</p>
        </div>
    );
    
    if (error && !event) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl text-center max-w-md">
                <div className="text-red-500 text-5xl mb-4">⚠️</div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">Event Not Found</h2>
                <p className="text-slate-500 mb-6">{error}</p>
                <button onClick={() => navigate('/')} className="text-indigo-600 font-bold hover:underline">← Back to Events</button>
            </div>
        </div>
    );

    const isSoldOut = event.availableSeats <= 0;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* --- Hero Image Section --- */}
            <div className="relative w-full h-[50vh] min-h-[400px] bg-slate-900">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/20 to-transparent"></div>
                
                <div className="absolute top-8 left-8 md:left-16 z-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl font-bold transition-all shadow-lg border border-white/10">
                        <FaArrowLeft /> Back
                    </button>
                </div>
            </div>

            {/* --- Main Content --- */}
            <div className="max-w-7xl mx-auto px-6 -mt-32 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Column: Event Details */}
                    <div className="w-full lg:w-2/3 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100">
                        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest mb-6 border border-indigo-100">
                            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                            {event.category}
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight tracking-tight">{event.title}</h1>
                        
                        <div className="prose prose-lg text-slate-500 mb-10 leading-relaxed max-w-none">
                            <p>{event.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 text-xl">
                                    <FaCalendarAlt />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Date</p>
                                    <p className="font-bold text-slate-900">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 text-xl">
                                    <FaMapMarkerAlt />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Location</p>
                                    <p className="font-bold text-slate-900">{event.location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Booking Card */}
                    <div className="w-full lg:w-1/3 sticky top-32">
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            
                            <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Reserve Spot</h3>

                            <div className="space-y-6 mb-8 relative z-10">
                                <div className="flex justify-between items-center pb-6 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-lg"><FaMoneyBillWave /></div>
                                        <p className="font-bold text-slate-500">Ticket Price</p>
                                    </div>
                                    <p className="font-black text-2xl text-slate-900">
                                        {event.ticketPrice === 0 ? <span className="text-emerald-500">Free</span> : `₹${event.ticketPrice}`}
                                    </p>
                                </div>

                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center text-lg"><FaChair /></div>
                                            <p className="font-bold text-slate-500">Availability</p>
                                        </div>
                                        <p className="font-bold text-slate-900">
                                            <span className={event.availableSeats < 10 ? 'text-orange-500 font-black' : ''}>{event.availableSeats}</span> / {event.totalSeats}
                                        </p>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 mt-4 overflow-hidden">
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* OTP Flow UI */}
                            {showOTP && (
                                <div className="mb-6 p-5 bg-indigo-50 rounded-2xl border border-indigo-100">
                                    <label className="block text-xs font-black text-indigo-400 uppercase tracking-widest mb-3 text-center">Verification Code</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="000000"
                                        className="w-full px-4 py-4 rounded-xl bg-white border border-indigo-200 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-black tracking-[1em] text-center text-2xl text-slate-900 shadow-inner"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        maxLength="6"
                                    />
                                    <p className="text-center text-[10px] text-indigo-500 font-bold mt-3">Check your email for the 6-digit code</p>
                                </div>
                            )}

                            {/* Alerts */}
                            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center font-bold text-sm border border-red-100">{error}</div>}
                            {successMsg && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl mb-6 text-center font-bold text-sm border border-emerald-100">{successMsg}</div>}

                            {/* Main Action Button */}
                            <button
                                onClick={handleBooking}
                                disabled={isSoldOut || bookingLoading || (showOTP && !otp)}
                                className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-wider transition-all shadow-lg ${
                                    isSoldOut || (successMsg && !showOTP)
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                                        : 'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-500/40 hover:-translate-y-1'
                                }`}
                            >
                                {bookingLoading ? 'Processing...' : (
                                    showOTP ? 'Verify & Confirm' : 
                                    (successMsg && !showOTP ? 'Request Sent ✅' : 
                                    (isSoldOut ? 'Sold Out' : 'Book Ticket'))
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default EventDetail;