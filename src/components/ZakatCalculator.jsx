import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Wallet, TrendingUp, Info } from 'lucide-react';

const ZakatCalculator = () => {
    const [values, setValues] = useState({
        gold: '',
        silver: '',
        cash: '',
        investments: '',
        liabilities: ''
    });

    const calculateTotal = () => {
        const total = (Number(values.gold) || 0) +
            (Number(values.silver) || 0) +
            (Number(values.cash) || 0) +
            (Number(values.investments) || 0) -
            (Number(values.liabilities) || 0);
        return Math.max(0, total);
    };

    const zakatAmount = calculateTotal() * 0.025;

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return (
        <div className="flex flex-col h-full bg-[#0a1324] rounded-3xl p-8 border border-white/5">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#d4af37]/10 rounded-xl flex items-center justify-center text-[#d4af37]">
                    <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">Zakat <span className="text-[#d4af37]">Calculator</span></h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="space-y-4">
                    <InputField label="Gold Value" name="gold" value={values.gold} onChange={handleChange} />
                    <InputField label="Silver Value" name="silver" value={values.silver} onChange={handleChange} />
                    <InputField label="Cash in Hand" name="cash" value={values.cash} onChange={handleChange} />
                </div>
                <div className="space-y-4">
                    <InputField label="Investments" name="investments" value={values.investments} onChange={handleChange} />
                    <InputField label="Liabilities/Debts" name="liabilities" value={values.liabilities} onChange={handleChange} />
                    <div className="bg-[#d4af37]/5 rounded-xl p-4 border border-[#d4af37]/20">
                        <div className="flex items-center gap-2 text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-1">
                            <Info className="w-3 h-3" /> Note
                        </div>
                        <p className="text-[10px] text-slate-400">Rate is 2.5% of total wealth held for one lunar year above Nisab.</p>
                    </div>
                </div>
            </div>

            <div className="mt-auto bg-gradient-to-br from-[#d4af37]/10 to-transparent rounded-2xl p-6 border border-[#d4af37]/20 relative overflow-hidden">
                <Wallet className="absolute -bottom-4 -right-4 w-24 h-24 text-[#d4af37]/5 -rotate-12" />
                <div className="relative z-10">
                    <p className="text-xs uppercase tracking-widest text-[#d4af37] font-black mb-1">Total Zakat Due</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xs text-slate-500">PKR</span>
                        <motion.span
                            key={zakatAmount}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-bold text-white tabular-nums"
                        >
                            {zakatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </motion.span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ label, name, value, onChange }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            placeholder="0.00"
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-[#d4af37]/50 text-white text-sm transition-all"
        />
    </div>
);

export default ZakatCalculator;
