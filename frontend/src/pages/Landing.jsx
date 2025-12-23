import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, ShieldCheck, Zap, Building, Wrench, Users, FileText, LayoutDashboard, ChevronRight, Star } from 'lucide-react';

const Landing = () => {
  return (
    <div className="font-sans text-slate-900 bg-slate-50 min-h-screen selection:bg-indigo-500 selection:text-white">
      
      {/* --- HERO SECTION --- */}
      <div className="relative pt-20 pb-32 overflow-hidden bg-white rounded-b-[3rem] shadow-sm">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            
            {/* --- PILL BADGE REMOVED HERE --- */}

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight pt-10">
                The Operating System for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Property Management</span>
            </h1>
            
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                Stop using spreadsheets and WhatsApp. Propel brings Agents, Contractors, and Payments into one unified, automated workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register" className="h-14 px-8 rounded-full bg-slate-900 text-white font-bold flex items-center gap-2 hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20 text-lg">
                    Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/login" className="h-14 px-8 rounded-full bg-white border border-slate-200 text-slate-900 font-bold flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all text-lg">
                    View Demo
                </Link>
            </div>

            {/* --- HERO DASHBOARD MOCKUP --- */}
            <div className="mt-20 relative mx-auto max-w-5xl group perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative rounded-xl bg-slate-900 p-2 shadow-2xl transform transition-transform duration-500 hover:rotate-x-1">
                    <div className="rounded-lg bg-slate-900 border border-slate-800 overflow-hidden relative aspect-[16/9]">
                        {/* Mockup Header */}
                        <div className="h-12 border-b border-slate-800 bg-slate-900 flex items-center px-4 justify-between">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="text-xs font-mono text-slate-500">dashboard.propel.com</div>
                        </div>
                        {/* Mockup Body */}
                        <div className="p-8 grid grid-cols-12 gap-6 h-full bg-slate-950/50">
                            {/* Sidebar */}
                            <div className="col-span-2 hidden md:block space-y-4">
                                <div className="h-8 w-full bg-slate-800 rounded-lg animate-pulse"></div>
                                <div className="h-4 w-2/3 bg-slate-800/50 rounded-lg"></div>
                                <div className="h-4 w-3/4 bg-slate-800/50 rounded-lg"></div>
                                <div className="h-4 w-1/2 bg-slate-800/50 rounded-lg"></div>
                            </div>
                            {/* Main Area */}
                            <div className="col-span-12 md:col-span-10 grid grid-cols-3 gap-6">
                                
                                {/* --- UPDATED CARD 1: Bigger Text & Higher Contrast --- */}
                                <div className="col-span-2 bg-slate-900 border border-indigo-500/30 p-6 rounded-xl relative overflow-hidden shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-24 h-24 text-white"/></div>
                                    <div className="flex justify-between mb-8">
                                        <div className="h-12 w-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400"><Wrench className="h-6 w-6" /></div>
                                        <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full h-fit border border-green-500/20">ACTIVE JOB</span>
                                    </div>
                                    <div className="text-white font-bold text-2xl mb-2">Emergency Leak Repair</div>
                                    <div className="text-indigo-200 font-medium text-lg mb-6 flex items-center gap-2">
                                        <Building className="h-4 w-4" /> Flat 4B • High Priority
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 w-3/4 h-full rounded-full"></div>
                                    </div>
                                </div>

                                {/* Card 2 */}
                                <div className="col-span-1 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-xl text-white flex flex-col justify-between shadow-lg">
                                    <div>
                                        <div className="text-indigo-200 text-sm font-medium mb-1">Total Spent</div>
                                        <div className="text-3xl font-bold">$12.4k</div>
                                    </div>
                                    <div className="text-xs bg-white/20 px-2 py-1 rounded w-fit backdrop-blur-sm">↑ 14% vs last mo</div>
                                </div>

                                {/* Bottom Row */}
                                <div className="col-span-3 bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-green-500/20 rounded-full flex items-center justify-center text-green-500"><CheckCircle className="w-5 h-5"/></div>
                                        <div className="text-slate-300 text-sm"><span className="text-white font-bold">Invoice #9021</span> generated automatically.</div>
                                    </div>
                                    <div className="text-sm text-indigo-400 font-bold cursor-pointer hover:text-indigo-300 flex items-center gap-1">Download PDF <ArrowRight className="w-3 h-3"/></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* --- BENTO GRID FEATURES --- */}
      <div className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Everything you need to scale</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Propel handles the messy parts of property management so you can focus on growing your portfolio.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1: Large Left (IMAGE CARD) */}
            <div className="md:col-span-2 bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden relative min-h-[300px] flex flex-col justify-end p-8">
                {/* Background Image */}
                <img 
                    src="https://images.unsplash.com/photo-1581578014828-56894c15d58d?q=80&w=2070&auto=format&fit=crop" 
                    alt="Professional Contractor"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white mb-4"><Users className="w-6 h-6"/></div>
                    <h3 className="text-2xl font-bold text-white mb-2">Vetted Contractor Network</h3>
                    <p className="text-slate-300 max-w-md">Instantly connect with 5,000+ verified professionals. We handle background checks, insurance, and performance ratings.</p>
                </div>
            </div>

            {/* Feature 2: Small Right (Gradient) */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-white mb-6"><ShieldCheck className="w-6 h-6"/></div>
                    <h3 className="text-2xl font-bold mb-2">Escrow Vault</h3>
                    <p className="text-indigo-100 text-sm">Funds are locked securely in smart contracts. Pay only when you're 100% happy.</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            </div>

            {/* Feature 3: Small Left (Simple) */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between">
                <div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-6"><FileText className="w-6 h-6"/></div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Instant Invoicing</h3>
                    <p className="text-slate-500 text-sm">Automatic, compliance-ready receipts generated instantly after payment.</p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-green-600 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" /> IRS Compliant
                </div>
            </div>

            {/* Feature 4: Large Right (IMAGE CARD) */}
            <div className="md:col-span-2 bg-slate-900 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden min-h-[300px] flex flex-col justify-end p-8">
                 {/* Background Image */}
                 <img 
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop" 
                    alt="Analytics Dashboard"
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center text-white mb-4"><LayoutDashboard className="w-6 h-6"/></div>
                    <h3 className="text-2xl font-bold text-white mb-2">Centralized Command Center</h3>
                    <p className="text-slate-300 max-w-md">Track every repair across 100+ properties in a single view. Filter by priority, status, or location.</p>
                </div>
            </div>

        </div>
      </div>

      {/* --- TRUST FOOTER --- */}
      <div className="bg-white border-t border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by innovative agencies</p>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="text-2xl font-black text-slate-800 flex items-center gap-2"><Building /> ESTATE<span className="font-light">PRO</span></div>
                <div className="text-2xl font-black text-slate-800 flex items-center gap-2">URBAN<span className="font-light">LIVING</span></div>
                <div className="text-2xl font-black text-slate-800 flex items-center gap-2">SKY<span className="font-light">LINE</span></div>
                <div className="text-2xl font-black text-slate-800 flex items-center gap-2">OPEN<span className="font-light">DOOR</span></div>
            </div>
        </div>
      </div>

    </div>
  );
};
export default Landing;
