import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaCheck, FaTimes, FaRupeeSign, FaUsers, FaClock, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showEventForm, setShowEventForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
    });

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const [eventsRes, bookingsRes] = await Promise.all([
                api.get('/events'),
                api.get('/bookings/my') // Admin gets all bookings
            ]);
            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error('Error fetching admin data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', formData);
            setShowEventForm(false);
            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating event');
        }
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                fetchData();
            } catch (error) {
                alert('Error deleting event');
            }
        }
    };

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
            fetchData();
        } catch (error) {
            alert(error.response?.data?.message || 'Error confirming booking');
        }
    };

    const handleCancelBooking = async (id) => {
        if (window.confirm('Reject this user\'s booking request?')) {
            try {
                await api.delete(`/bookings/${id}`);
                fetchData();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold animate-pulse">Initializing Command Center...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
            
            {/* --- Admin Header --- */}
            <div className="relative bg-slate-900 rounded-[2.5rem] p-8 md:p-12 mb-10 shadow-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/40 via-purple-900/20 to-transparent"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                        <span className="text-indigo-300 font-black tracking-[0.2em] uppercase text-xs">System Online</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">Command Center</h1>
                    <p className="text-indigo-200/70 font-medium">Manage events, monitor revenue, and authorize bookings.</p>
                </div>

                <button
                    onClick={() => setShowEventForm(!showEventForm)}
                    className="relative z-10 flex items-center gap-3 bg-white hover:bg-indigo-50 text-indigo-900 font-black py-4 px-8 rounded-2xl transition-all shadow-xl hover:shadow-white/20 hover:-translate-y-1 w-full md:w-auto justify-center"
                >
                    {showEventForm ? <><FaTimes /> Close Form</> : <><FaPlus /> Create Event</>}
                </button>
            </div>

            {/* --- Event Creation Form --- */}
            {showEventForm && (
                <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-10 animate-fade-in-down">
                    <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><FaPlus /></div>
                        Launch New Event
                    </h2>
                    <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
                            <input required type="text" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder-slate-400" placeholder="E.g., Tech Summit 2026" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <input required type="text" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder-slate-400" placeholder="E.g., Conference, Music" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                            <input required type="date" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                            <input required type="text" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder-slate-400" placeholder="City, Venue" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Total Capacity</label>
                            <input required type="number" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder-slate-400" placeholder="Total Seats" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ticket Price (₹)</label>
                            <input required type="number" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder-slate-400" placeholder="0 for Free" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
                        </div>
                        
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                            <input type="text" className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder-slate-400" placeholder="https://unsplash.com/... (Direct Image Link)" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>

                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea required className="w-full bg-slate-50 border border-slate-200 px-5 py-4 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900 placeholder-slate-400 h-32 resize-none" placeholder="What is this event about?" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                        
                        <button type="submit" className="md:col-span-2 bg-slate-900 hover:bg-indigo-600 text-white font-black py-4 mt-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-1">
                            Publish Event to Platform
                        </button>
                    </form>
                </div>
            )}

            {/* --- Admin Stats Row --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Total Revenue</p>
                        <h3 className="text-4xl font-black text-emerald-500">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0).toLocaleString()}</h3>
                    </div>
                    <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"><FaRupeeSign /></div>
                </div>
                
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Paid Clients</p>
                        <h3 className="text-4xl font-black text-indigo-500">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
                    </div>
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"><FaUsers /></div>
                </div>
                
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center justify-between group hover:border-amber-200 transition-colors">
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Action Required</p>
                        <h3 className="text-4xl font-black text-amber-500">{bookings.filter(b => b.status === 'pending').length}</h3>
                    </div>
                    <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"><FaClock /></div>
                </div>
            </div>

            {/* --- Management Sections --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                
                {/* Active Events List */}
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black mb-6 text-slate-900 flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-slate-100 text-slate-600 rounded-xl"><FaCalendarAlt /></div>
                        Active Events <span className="text-slate-400 text-sm ml-auto font-bold">{events.length} Total</span>
                    </h2>
                    
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <ul className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto custom-scrollbar">
                            {events.length === 0 ? (
                                <li className="p-10 text-slate-400 text-center font-medium">No events currently active.</li>
                            ) : (
                                events.map(event => (
                                    <li key={event._id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900 mb-2 truncate">{event.title}</h4>
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-500"></span>{new Date(event.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</span>
                                                <span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>{event.availableSeats}/{event.totalSeats} seats</span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteEvent(event._id)} className="w-full sm:w-auto text-red-400 hover:text-white hover:bg-red-500 border border-red-100 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors shrink-0 flex items-center justify-center gap-2">
                                            <FaTrash /> Delete
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                {/* Booking Requests List */}
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black mb-6 text-slate-900 flex items-center gap-3 tracking-tight">
                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl"><FaTicketAlt /></div>
                        Booking Queue <span className="text-slate-400 text-sm ml-auto font-bold">{bookings.length} Total</span>
                    </h2>
                    
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <ul className="divide-y divide-slate-100 max-h-[700px] overflow-y-auto custom-scrollbar">
                            {bookings.length === 0 ? (
                                <li className="p-10 text-slate-400 text-center font-medium">No booking requests pending.</li>
                            ) : (
                                bookings.map(booking => (
                                    <li key={booking._id} className={`p-6 hover:bg-slate-50 transition-colors border-l-4 ${booking.status === 'pending' ? 'border-l-amber-400' : booking.status === 'confirmed' ? 'border-l-emerald-400' : 'border-l-red-400'}`}>
                                        
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-bold text-slate-900 text-lg leading-tight flex-1 pr-4">{booking.eventId?.title || 'Deleted Event'}</h4>
                                            <div className="flex flex-col gap-1.5 items-end shrink-0">
                                                <span className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>{booking.status}</span>
                                                {booking.status !== 'cancelled' && <span className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border ${booking.paymentStatus === 'paid' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
                                            <div className="grid grid-cols-2 gap-y-3 text-sm">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">User</span>
                                                    <span className="font-bold text-slate-900">{booking.userId?.name}</span>
                                                    <span className="text-xs text-slate-500 truncate">{booking.userId?.email}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Value</span>
                                                    <span className={`font-black text-lg ${booking.amount === 0 ? 'text-emerald-500' : 'text-slate-900'}`}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="flex flex-wrap gap-2">
                                                <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 text-xs font-black uppercase tracking-widest py-3 px-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                                    <FaCheck /> Paid
                                                </button>
                                                <button onClick={() => handleConfirmBooking(booking._id, 'not_paid')} className="flex-1 bg-slate-50 hover:bg-slate-800 text-slate-600 hover:text-white border border-slate-200 text-xs font-black uppercase tracking-widest py-3 px-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                                    <FaCheck /> Unpaid
                                                </button>
                                                <button onClick={() => handleCancelBooking(booking._id)} className="w-[100px] bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-red-200 text-xs font-black uppercase tracking-widest py-3 px-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                                                    <FaTimes /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;