import React, { useState, useCallback } from 'react';
import { calculateRetirementPlan, PlannerInput, PlannerOutput } from '../services/FinancialMath';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

const InputField: React.FC<{label: string, id: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type?: string, symbol?: string, placeholder?: string}> = ({ label, id, value, onChange, type = 'number', symbol, placeholder }) => (
    <div className="group">
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1 group-focus-within:text-violet-400 transition-colors">{label}</label>
        <div className="relative">
            {symbol && <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 font-medium select-none">{symbol}</span>}
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-slate-900/50 border border-slate-700 rounded-lg shadow-sm py-2.5 text-white placeholder-slate-600 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all outline-none ${symbol ? 'pl-8' : 'px-4'}`}
                min="0"
            />
        </div>
    </div>
);

const ResultCard: React.FC<{title: string, value: string, subtext: string, icon: React.ReactNode, accentColor?: string}> = ({title, value, subtext, icon, accentColor = "text-white"}) => (
    <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-700/50 hover:border-violet-500/30 transition-colors flex flex-col items-center text-center shadow-lg">
        <div className="text-violet-400 mb-3 bg-violet-500/10 p-3 rounded-full">{icon}</div>
        <p className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-1">{title}</p>
        <p className={`text-3xl font-bold ${accentColor} mb-2`}>{value}</p>
        <p className="text-xs text-slate-500 font-medium">{subtext}</p>
    </div>
);

const GrowthChart: React.FC<{ projections: { year: number; age: number; savings: number }[] }> = ({ projections }) => {
    // Determine strict sampling to show ~20 bars max for mobile/desktop performance and readability
    const sampleRate = Math.ceil(projections.length / 20);
    const data = projections.filter((_, index) => index % sampleRate === 0 || index === projections.length - 1);
    const maxSavings = Math.max(...data.map(p => p.savings));

    return (
        <div className="mt-8 pt-6 border-t border-slate-700/50">
             <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 15.293 6.293A1 1 0 0115 7h1z" clipRule="evenodd" />
                </svg>
                Projected Savings Growth
            </h3>
            <div className="flex items-end justify-between h-48 gap-1">
                {data.map((point, i) => {
                    const heightPercent = Math.max((point.savings / maxSavings) * 100, 5); // Min 5% height
                    return (
                        <div key={i} className="flex flex-col items-center flex-1 group relative">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs p-2 rounded whitespace-nowrap z-10 pointer-events-none shadow-xl border border-slate-700">
                                Age {point.age}: {formatCurrency(point.savings)}
                            </div>
                            <div 
                                style={{ height: `${heightPercent}%` }} 
                                className="w-full bg-violet-500/30 hover:bg-violet-400 rounded-t-sm transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500/50"></div>
                            </div>
                            <span className="text-[10px] text-slate-500 mt-1">{point.age}</span>
                        </div>
                    )
                })}
            </div>
             <p className="text-center text-xs text-slate-500 mt-2">Age vs. Total Savings</p>
        </div>
    );
};


const RetirementPlannerTool: React.FC = () => {
    const [inputs, setInputs] = useState({
        currentAge: '30',
        currentSavings: '50000',
        annualSalary: '80000',
        annualContribution: '10',
        desiredAnnualIncome: '60000',
        annualReturn: '7',
        inflationRate: '3',
    });
    const [result, setResult] = useState<PlannerOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleCalculate = useCallback(() => {
        setError('');
        setResult(null);

        const numericInputs = Object.entries(inputs).map(([key, value]) => ({ inputKey: key, value: parseFloat(value as string) }));
        const invalidInput = numericInputs.find(input => isNaN(input.value) || input.value < 0);

        if (invalidInput) {
            setError(`Please enter a valid, non-negative number for ${invalidInput.inputKey}.`);
            return;
        }

        setIsLoading(true);

        const plannerInput: PlannerInput = {
            currentAge: parseFloat(inputs.currentAge),
            currentSavings: parseFloat(inputs.currentSavings),
            annualContribution: parseFloat(inputs.annualSalary) * (parseFloat(inputs.annualContribution) / 100),
            annualReturn: parseFloat(inputs.annualReturn),
            desiredAnnualIncome: parseFloat(inputs.desiredAnnualIncome),
            inflationRate: parseFloat(inputs.inflationRate),
        };
        
        // Simulate computation time for UX feel
        setTimeout(() => {
            const plan = calculateRetirementPlan(plannerInput);
            setResult(plan);
            setIsLoading(false);
        }, 800);
    }, [inputs]);

    return (
        <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-8 items-start">
            {/* Input Section */}
            <div className="lg:col-span-5 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6 md:p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Financial Details</h2>
                    <p className="text-slate-400 text-sm">Input your current stats to generate a personalized forecast.</p>
                </div>
                
                <div className="space-y-5">
                    <InputField label="Current Age" id="currentAge" value={inputs.currentAge} onChange={handleInputChange} placeholder="e.g., 30"/>
                    <InputField label="Current Savings" id="currentSavings" value={inputs.currentSavings} onChange={handleInputChange} symbol="$" placeholder="e.g., 50000"/>
                    <InputField label="Annual Salary" id="annualSalary" value={inputs.annualSalary} onChange={handleInputChange} symbol="$" placeholder="e.g., 80000"/>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Savings Rate" id="annualContribution" value={inputs.annualContribution} onChange={handleInputChange} symbol="%" placeholder="e.g., 10"/>
                        <InputField label="Est. Return" id="annualReturn" value={inputs.annualReturn} onChange={handleInputChange} symbol="%" placeholder="e.g., 7"/>
                    </div>
                    <InputField label="Desired Annual Retirement Income" id="desiredAnnualIncome" value={inputs.desiredAnnualIncome} onChange={handleInputChange} symbol="$" placeholder="e.g., 60000"/>
                    <InputField label="Inflation Rate" id="inflationRate" value={inputs.inflationRate} onChange={handleInputChange} symbol="%" placeholder="e.g., 3"/>
                </div>
                
                <button 
                    onClick={handleCalculate}
                    disabled={isLoading}
                    className="w-full mt-8 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center transform active:scale-[0.98]"
                >
                    {isLoading ? (
                        <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                        </span>
                    ) : 'Calculate My Plan'}
                </button>
                {error && <p className="text-red-400 text-sm mt-4 text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}
            </div>

            {/* Output Section */}
            <div className="lg:col-span-7 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6 md:p-8 min-h-[600px] flex flex-col relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <h2 className="text-2xl font-bold text-white mb-6 text-center lg:text-left relative z-10">Retirement Outlook</h2>
                
                {isLoading && (
                    <div className="flex-grow flex flex-col items-center justify-center text-slate-300 z-10">
                        <div className="w-16 h-16 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mb-4"></div>
                        <p className="animate-pulse">Crunching the numbers...</p>
                    </div>
                )}
                
                {result && !isLoading && (
                    <div className="space-y-6 z-10 animate-fadeIn">
                        {result.canRetire ? (
                            <div className="text-center p-6 bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700 rounded-2xl">
                                <p className="text-lg text-slate-400 mb-1">Financial Freedom Achieved At</p>
                                <div className="text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-tighter shadow-emerald-500/20 drop-shadow-lg">
                                    {result.retirementAge}
                                </div>
                                <p className="text-slate-500 text-sm mt-2">Years of Age</p>
                            </div>
                        ) : (
                             <div className="text-center p-6 bg-amber-900/20 border border-amber-500/30 rounded-2xl">
                                <div className="inline-block p-3 bg-amber-500/20 rounded-full mb-3 text-amber-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                                <p className="text-xl font-bold text-white mb-1">Gap Detected</p>
                                <p className="text-slate-400">With current parameters, retirement savings may not sustain you until age 100. Consider increasing contributions or adjusting your retirement age.</p>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-4">
                           <ResultCard 
                                title="Target Nest Egg"
                                value={formatCurrency(result.nestEgg)}
                                subtext="Adjusted for inflation"
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                           />
                           <ResultCard 
                                title="Monthly Savings Needed"
                                value={formatCurrency(result.requiredMonthlySavings)}
                                subtext={result.canRetire ? "To maintain timeline" : "To retire at 65"}
                                accentColor={result.requiredMonthlySavings > parseFloat(inputs.annualSalary) * (parseFloat(inputs.annualContribution)/100) / 12 ? 'text-amber-400' : 'text-emerald-400'}
                                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                           />
                        </div>

                        <GrowthChart projections={result.projections} />
                    </div>
                )}

                {!isLoading && !result && (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-slate-400 p-8 z-10">
                        <div className="bg-slate-700/30 p-4 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Ready to Plan?</h3>
                        <p className="max-w-xs mx-auto">Enter your details in the panel on the left to generate your personalized retirement strategy.</p>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default RetirementPlannerTool;