import React, { useState } from 'react';
import SeoArticle from './SeoArticle';

interface ThemeLayoutProps {
  children: React.ReactNode;
}

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto relative text-slate-300 animate-fadeIn" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl p-6 border-b border-slate-700 flex justify-between items-center z-10 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-8 prose prose-invert prose-slate max-w-none">
                    {children}
                </div>
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

const ThemeLayout: React.FC<ThemeLayoutProps> = ({ children }) => {
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const renderModalContent = () => {
        switch (activeModal) {
            case 'About':
                return (
                    <div>
                        <p className="text-lg leading-relaxed mb-4">The Retirement Savings Planner is a sophisticated, open-source financial modeling tool developed by HSINI MOHAMED. Our mission is to democratize financial planning by providing free, high-quality tools that help individuals understand the complex mechanics of compound interest, inflation, and savings growth.</p>
                        <p className="leading-relaxed">In an era of economic uncertainty, having a clear visual representation of your financial trajectory is not just a luxury—it's a necessity. This application performs all calculations locally on your device, ensuring your sensitive financial data remains 100% private and secure.</p>
                    </div>
                );
            case 'Contact':
                return (
                    <div className="space-y-4">
                        <p className="text-lg">We value your feedback and inquiries. For professional engagements, support, or questions regarding this tool, please reach out via the following channels:</p>
                        <div className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
                            <ul className="space-y-3">
                                <li className="flex items-center space-x-3">
                                    <span className="text-violet-400 font-semibold w-20">Website:</span>
                                    <a href="https://doodax.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-violet-300 underline underline-offset-4 decoration-violet-500/30 hover:decoration-violet-500 transition-all">doodax.com</a>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-violet-400 font-semibold w-20">Email:</span>
                                    <a href="mailto:hsini.web@gmail.com" className="text-white hover:text-violet-300 underline underline-offset-4 decoration-violet-500/30 hover:decoration-violet-500 transition-all">hsini.web@gmail.com</a>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <span className="text-violet-400 font-semibold w-20">GitHub:</span>
                                    <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="text-white hover:text-violet-300 underline underline-offset-4 decoration-violet-500/30 hover:decoration-violet-500 transition-all">github.com/hsinidev</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                );
            case 'Guide':
                return <SeoArticle />;
            case 'Privacy Policy':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">1. Introduction</h3>
                        <p>Welcome to the Retirement Savings Planner. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (RetirementSavings.doodax.com) and tell you about your privacy rights and how the law protects you.</p>
                        
                        <h3 className="text-xl font-semibold text-white">2. Data Collection and Usage</h3>
                        <p><strong>Client-Side Processing:</strong> This application operates as a client-side single-page application (SPA). All financial inputs (age, salary, savings, etc.) are processed locally within your web browser's memory. We DO NOT transmit, store, or save your financial data on any external server or database.</p>
                        <p><strong>Analytics:</strong> We may use anonymous, aggregated analytics tools (like Google Analytics) to understand general usage patterns (e.g., number of visitors, page views). This data is not linked to your personal financial inputs.</p>
                        
                        <h3 className="text-xl font-semibold text-white">3. Cookies</h3>
                        <p>We use essential cookies to ensure the website functions correctly. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.</p>

                        <h3 className="text-xl font-semibold text-white">4. Third-Party Links</h3>
                        <p>This website may include links to third-party websites, plug-ins, and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.</p>
                        
                        <h3 className="text-xl font-semibold text-white">5. Changes to This Policy</h3>
                        <p>We keep our privacy policy under regular review. Any changes we make to our privacy policy in the future will be posted on this page. Please check back frequently to see any updates or changes to our privacy policy.</p>
                        
                        <p className="text-sm text-slate-500 mt-8">Last Updated: October 27, 2023</p>
                    </div>
                );
            case 'Terms of Service':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-white">1. Acceptance of Terms</h3>
                        <p>By accessing and using the Retirement Savings Planner (the "Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.</p>
                        
                        <h3 className="text-xl font-semibold text-white">2. Disclaimer of Warranties</h3>
                        <p>The Service is provided for educational and informational purposes only. It is not intended to provide legal, tax, or financial advice. The calculations and projections provided by this tool are estimates based on user inputs and hypothetical assumptions (such as future rates of return and inflation).</p>
                        <p>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE RESULTS OBTAINED FROM THE USE OF THE SERVICE WILL BE ACCURATE OR RELIABLE.</p>
                        
                        <h3 className="text-xl font-semibold text-white">3. Limitation of Liability</h3>
                        <p>You expressly understand and agree that HSINI MOHAMED and doodax.com shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data or other intangible losses resulting from the use or the inability to use the service.</p>
                        
                        <h3 className="text-xl font-semibold text-white">4. Intellectual Property</h3>
                        <p>The content, organization, graphics, design, compilation, and other matters related to the Site are protected under applicable copyrights, trademarks, and other proprietary rights. The copying, redistribution, use, or publication by you of any such matters or any part of the Site is strictly prohibited.</p>
                        
                         <h3 className="text-xl font-semibold text-white">5. Governing Law</h3>
                        <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the owner resides, without regard to its conflict of law provisions.</p>
                    </div>
                );
            case 'DMCA':
                return (
                    <div className="space-y-4">
                        <p>We respect the intellectual property rights of others. It is our policy to respond to any claim that Content posted on the Service infringes the copyright or other intellectual property infringement ("Infringement") of any person.</p>
                        <p>If you are a copyright owner, or authorized on behalf of one, and you believe that the copyrighted work has been copied in a way that constitutes copyright infringement that is taking place through the Service, you must submit your notice in writing to the attention of "Copyright Agent" via email at <strong>hsini.web@gmail.com</strong> and include in your notice a detailed description of the alleged Infringement.</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright's interest.</li>
                            <li>A description of the copyrighted work that you claim has been infringed.</li>
                            <li>A description of where the material that you claim is infringing is located on the Service.</li>
                            <li>Your address, telephone number, and email address.</li>
                            <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };
    
    const navLinks = ['About', 'Contact', 'Guide', 'Privacy Policy', 'Terms of Service', 'DMCA'];

    return (
        <div className="relative min-h-screen bg-slate-900 text-white overflow-hidden isolate selection:bg-violet-500 selection:text-white">
            {/* Enhanced Animated Nebula Background */}
            <div className="absolute inset-0 z-[-10] opacity-60" style={{
                backgroundImage: 'radial-gradient(circle at 20% 20%, #4c1d95, transparent 50%), radial-gradient(circle at 80% 80%, #2e1065, transparent 50%), radial-gradient(circle at 50% 50%, #1e1b4b, transparent 60%), radial-gradient(circle at 80% 20%, #312e81, transparent 40%)',
                backgroundSize: '200% 200%',
                animation: 'nebula 40s ease-in-out infinite alternate'
            }}></div>
            <style>{`
                @keyframes nebula {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 100% 100%; }
                }
            `}</style>
             <div className="absolute inset-0 z-[-9] opacity-30" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a78bfa\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                animation: 'starfield 100s linear infinite'
            }}></div>
             <style>{`
                @keyframes starfield {
                    from { background-position: 0 0; }
                    to { background-position: -5000px 5000px; }
                }
            `}</style>

            <div className="relative z-10 flex flex-col min-h-screen">
                <header className="sticky top-0 z-40 py-4 px-4 md:px-8 bg-slate-900/70 backdrop-blur-md border-b border-white/5 transition-all duration-300">
                    <nav className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                <span className="font-bold text-white text-lg">R</span>
                             </div>
                            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-violet-400 tracking-tight">
                                Retirement Savings Planner
                            </h1>
                        </div>
                        
                        <div className="hidden lg:flex space-x-6">
                             {navLinks.map(link => (
                                <button key={link} onClick={() => setActiveModal(link)} className="text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-md transition-all text-sm font-medium">
                                    {link}
                                </button>
                            ))}
                        </div>
                         <div className="lg:hidden">
                            <select 
                                onChange={(e) => {
                                    if(e.target.value) setActiveModal(e.target.value);
                                    e.target.value = ""; // Reset selection
                                }} 
                                className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none"
                            >
                                <option value="">Menu</option>
                                 {navLinks.map(link => <option key={link} value={link}>{link}</option>)}
                            </select>
                        </div>
                    </nav>
                </header>

                <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
                    {children}
                </main>

                <footer className="py-8 px-4 md:px-8 bg-slate-900/50 backdrop-blur-md border-t border-white/5 text-center text-slate-400">
                    <div className="container mx-auto flex flex-col items-center space-y-4">
                        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium">
                            {navLinks.map(link => (
                                <button key={link} onClick={() => setActiveModal(link)} className="hover:text-violet-400 transition-colors">
                                    {link}
                                </button>
                            ))}
                        </div>
                        <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
                        <div className="text-sm">
                            <p className="mb-2">
                                Powered by <a href="https://github.com/hsinidev" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-yellow-400 transition-colors" style={{ color: '#FFD700' }}>HSINI MOHAMED</a>
                            </p>
                            <p className="opacity-75">
                                &copy; {new Date().getFullYear()} doodax.com. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
            
            {activeModal && (
                <Modal title={activeModal} onClose={() => setActiveModal(null)}>
                    {renderModalContent()}
                </Modal>
            )}
        </div>
    );
};

export default ThemeLayout;