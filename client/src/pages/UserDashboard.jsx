import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaRegCalendarAlt, FaHistory, FaMapMarkerAlt } from 'react-icons/fa';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings/my');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold animate-pulse">Loading dashboard...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            
            {/* --- Hero Welcome Card --- */}
            <div className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/20"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                
                <div className="relative p-8 md:p-12 flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-6 md:gap-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-[2rem] flex items-center justify-center text-4xl font-black uppercase tracking-widest shadow-xl shrink-0 rotate-3 hover:rotate-6 transition-transform">
                        {user?.name.charAt(0)}
                    </div>
                    <div className="flex flex-col items-center sm:items-start">
                        <span className="bg-indigo-500/20 text-indigo-300 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase mb-3 border border-indigo-500/30 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Active Member
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">Welcome, {user?.name}!</h1>
                        <p className="text-indigo-200/70 font-medium text-sm md:text-base">Manage your event requests and bookings here.</p>
                    </div>
                </div>
            </div>

            {/* --- Section Header --- */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                        <FaHistory />
                    </div>
                    My Bookings & Requests
                </h2>
                <span className="text-slate-500 font-bold text-sm bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                    Total: {bookings.length}
                </span>
            </div>

            {/* --- Main Content --- */}
            {bookings.length === 0 ? (
                <div className="bg-white rounded-[2rem] shadow-sm p-16 text-center border-2 border-dashed border-slate-200 max-w-2xl mx-auto">
                    <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <FaTicketAlt className="text-slate-300 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">No Events Yet</h3>
                    <p className="text-slate-500 mb-8 font-medium">Your schedule is completely clear. Discover something amazing.</p>
                    <Link to="/" className="inline-block bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1">
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {bookings.map((booking) => (
                        <div key={booking._id} className="group bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col hover:-translate-y-1">
                            <div className="p-8 border-b border-slate-50 flex-grow relative">
                                
                                {booking.eventId ? (
                                    <>
                                        {/* Status Badges */}
                                        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm border ${
                                                booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-amber-50 text-amber-600 border-amber-100'
                                            }`}>
                                                {booking.status}
                                            </span>
                                            {booking.status !== 'cancelled' && (
                                                <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest shadow-sm border ${
                                                    booking.paymentStatus === 'paid' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                                                }`}>
                                                    {booking.paymentStatus.replace('_', ' ')}
                                                </span>
                                            )}
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 leading-tight mb-6 pr-24 line-clamp-2">
                                            {booking.eventId.title}
                                        </h3>
                                        
                                        <div className="space-y-4 text-sm font-medium text-slate-500">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                                    <FaRegCalendarAlt />
                                                </div>
                                                <span>{new Date(booking.eventId.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center shrink-0">
                                                    <FaMapMarkerAlt />
                                                </div>
                                                <span className="line-clamp-1">{booking.eventId.location}</span>
                                            </div>
                                            
                                            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                                                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Paid</span>
                                                <span className="text-lg font-black text-slate-900">
                                                    {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex items-center justify-center flex-col text-center">
                                        <div className="w-12 h-12 bg-red-50 text-red-400 rounded-xl flex items-center justify-center mb-3 text-xl"><FaTimesCircle /></div>
                                        <p className="text-red-500 font-bold text-sm">Event Unavailable</p>
                                        <p className="text-slate-400 text-xs mt-1">This event may have been deleted.</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Action Footer */}
                            <div className="p-4 bg-slate-50 flex justify-between items-center shrink-0 border-t border-slate-100">
                                {booking.eventId && booking.status !== 'cancelled' ? (
                                    <>
                                        <Link 
                                            to={`/events/${booking.eventId._id}`} 
                                            className="text-indigo-600 font-black text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => cancelBooking(booking._id)}
                                            className="text-slate-400 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors flex items-center gap-2"
                                        >
                                            <FaTimesCircle className="text-sm" /> Cancel
                                        </button>
                                    </>
                                ) : (
                                    <div className="w-full text-center text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-100 py-2 rounded-xl">
                                        Booking Cancelled
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;