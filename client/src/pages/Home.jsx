import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { FaCompass, FaCalendarAlt, FaMapMarkerAlt, FaSearch, FaRegClock, FaTicketAlt, FaShieldAlt, FaArrowRight } from 'react-icons/fa';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEvents();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    const fetchEvents = async () => {
        try {
            const { data } = await api.get(`/events?search=${search}`);
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* --- Hero Section --- */}
            <div className="relative mx-4 mt-6 rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-900 text-white border-b-4 border-indigo-500 mb-16">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-slate-900/90 to-transparent"></div>

                <div className="relative p-10 md:p-24 text-center flex flex-col items-center z-10">
                    <span className="bg-indigo-500/20 text-indigo-300 backdrop-blur-md px-5 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-8 border border-indigo-500/30">
                        ✨ Discover the Future
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tighter">
                        Experience <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-slate-100">
                            Beyond Limits
                        </span>
                    </h1>
                    <p className="text-indigo-100/70 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join the most exclusive tech summits, music festivals, and workshops.
                        Your gateway to the extraordinary starts here.
                    </p>

                    {/* Search Bar */}
                    <div className="w-full max-w-xl mx-auto relative group">
                        <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
                        <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-xl group-focus-within:text-indigo-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search events, workshops, festivals..."
                            className="relative w-full pl-16 pr-6 py-6 rounded-2xl text-lg text-white bg-white/10 backdrop-blur-xl border border-white/20 focus:border-indigo-400 focus:outline-none transition-all placeholder-slate-400 font-medium shadow-2xl"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* --- Events Section --- */}
            <div className="max-w-7xl mx-auto px-6 w-full pb-16">
                <div className="flex items-center justify-between mb-12 border-b border-slate-200 pb-6">
                    <div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Upcoming Events</h2>
                        <p className="text-slate-500 mt-1 font-medium italic">Handpicked experiences for you</p>
                    </div>
                    <div className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm border border-indigo-100">
                        {events.length} results found
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center py-32 space-y-4">
                        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold animate-pulse">Syncing with E-Horizon...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                        <p className="text-2xl font-bold text-slate-400">No events found matching your search.</p>
                        <button onClick={() => setSearch('')} className="mt-4 text-indigo-600 font-bold underline">Clear Search</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {events.map(event => (
                            <div key={event._id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-indigo-200 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col">
                                <div className="h-56 bg-slate-200 overflow-hidden relative">
                                    {event.image ? (
                                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-3xl opacity-90 uppercase tracking-widest">
                                            {event.category}
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-2xl text-sm font-black text-slate-900 shadow-xl border border-slate-100">
                                        {event.ticketPrice === 0 ? <span className="text-emerald-600">FREE</span> : <span>₹{event.ticketPrice}</span>}
                                    </div>
                                </div>

                                <div className="p-8 flex-grow flex flex-col">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                                        <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">{event.category}</span>
                                    </div>

                                    <h2 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors line-clamp-1">{event.title}</h2>

                                    <div className="space-y-3 mb-8 text-slate-500 font-medium text-sm">
                                        <div className="flex items-center gap-3">
                                            <FaCalendarAlt className="text-indigo-400" />
                                            <span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FaMapMarkerAlt className="text-indigo-400" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="flex justify-between items-end mb-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Availability</p>
                                            <p className="text-xs font-bold text-slate-900">{event.availableSeats} Left</p>
                                        </div>
                                        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
                                            <div
                                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                                                style={{ width: `${(event.availableSeats / event.totalSeats) * 100}%` }}
                                            ></div>
                                        </div>
                                        <Link to={`/events/${event._id}`} className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/40">
                                            View Event <FaArrowRight className="text-xs" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Features Section (Moved Above Footer) --- */}
            <div className="bg-white border-t border-slate-200 pt-20 pb-20 mt-auto">
                <div className="max-w-7xl mx-auto px-6 w-full">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Why Choose E. Horizon</h2>
                        <p className="text-slate-500 mt-3 font-medium">The premier platform for managing and attending events.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <FaRegClock />, title: "Express Checkout", desc: "Book your spot in under 30 seconds with our optimized flow.", color: "bg-indigo-600" },
                            { icon: <FaTicketAlt />, title: "Smart Access", desc: "One-click ticket downloads and real-time dashboard updates.", color: "bg-purple-600" },
                            { icon: <FaShieldAlt />, title: "Ironclad Security", desc: "Every transaction is protected by 2FA and bank-grade encryption.", color: "bg-slate-800" }
                        ].map((feature, i) => (
                            <div key={i} className="group bg-slate-50 p-10 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center text-center hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500">
                                <div className={`w-14 h-14 ${feature.color} text-white rounded-2xl flex items-center justify-center text-xl mb-6 group-hover:rotate-12 transition-transform shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Footer --- */}
            <footer className="bg-slate-900 text-white pt-20 pb-10 px-6 rounded-t-[3rem]">
                <div className="max-w-7xl mx-auto flex flex-col items-center">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500 rounded-lg">
                            <FaCompass className="text-white text-xl" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter">E. Horizon</span>
                    </div>
                    <p className="text-indigo-200/50 text-center max-w-md mx-auto mb-12 leading-relaxed font-medium">
                        The simplest way to discover and host events. From local workshops to global tech summits.
                    </p>
                    <div className="w-full border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-xs text-indigo-300/40 font-bold uppercase tracking-[0.2em]">
                            &copy; {new Date().getFullYear()} E. Horizon Platform
                        </div>
                        {/* COMING SOON: Uncomment these links when the pages are created 
                        <div className="flex gap-8 text-xs font-black uppercase text-indigo-300/60 tracking-widest">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
                        </div>
                        */}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;