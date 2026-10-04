import React from 'react';
import { Transaction } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { formatCurrency, formatDate, getFundTypeLabel, getPaymentMethodLabel } from '../utils/formatters';
import { Printer, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const { lang, t } = useLanguage();

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const isBn = lang === 'bn';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white text-stone-900 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Action Header (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-3.5 bg-stone-100 border-b border-stone-200">
          <div className="flex items-center gap-2 text-stone-700 font-semibold text-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>{t('অফিসিয়াল মানি রসিদ', 'Official Money Receipt')}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{t('প্রিন্ট / রসিদ কপি', 'Print Receipt')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div id="receipt-print-area" className="p-8 sm:p-10 bg-white border-8 border-double border-emerald-900/20 m-4 rounded-xl relative">
          
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <span className="text-8xl font-serif font-black text-emerald-950 uppercase rotate-[-25deg]">
              UKPJS
            </span>
          </div>

          {/* Org Header */}
          <div className="text-center pb-6 border-b border-stone-300">
            <div className="inline-block px-3 py-0.5 mb-2 bg-emerald-50 text-emerald-800 text-[11px] font-semibold tracking-wider rounded-md border border-emerald-200">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-emerald-950 tracking-tight">
              উমারখালী কিস্তুপুর প্রবাসী যুব সংঘ
            </h2>
            <p className="text-xs text-stone-600 font-medium">
              Umarkhali Kistupur Probashi Jubo Songho
            </p>
            <p className="text-[11px] text-stone-500 mt-1">
              উমারখালী, কিস্তুপুর, জেলা: কুষ্টিয়া | মানব কল্যাণে ও শরিয়াহর নির্দেশনায় নিবেদিত
            </p>
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-4 py-4 border-b border-dashed border-stone-300 text-xs">
            <div>
              <span className="text-stone-500 block">{t('রসিদ / ভাউচার নম্বর:', 'Receipt / Voucher No:')}</span>
              <span className="font-mono font-bold text-stone-900 text-sm">{transaction.voucherNo}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block">{t('তারিখ:', 'Date:')}</span>
              <span className="font-medium text-stone-900">{formatDate(transaction.date, isBn)}</span>
            </div>
          </div>

          {/* Transaction Info Grid */}
          <div className="py-4 space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between items-baseline py-1 border-b border-stone-100">
              <span className="text-stone-600">{t('দাতা / সদস্যের নাম:', 'Donor / Member Name:')}</span>
              <span className="font-semibold text-stone-900 text-right">
                {transaction.isAnonymous 
                  ? t('গোপনীয় দানশীল ভাই (Anonymous)', 'Anonymous Contributor') 
                  : (transaction.memberName || transaction.donorName || t('সাধারণ শুভাকাঙ্ক্ষী', 'General Donor'))}
              </span>
            </div>

            <div className="flex justify-between items-baseline py-1 border-b border-stone-100">
              <span className="text-stone-600">{t('তহবিল ও খাতের বিবরণ:', 'Fund & Category:')}</span>
              <span className="font-medium text-emerald-900 text-right">
                {getFundTypeLabel(transaction.fundType, isBn)} · {transaction.categoryName}
              </span>
            </div>

            {transaction.projectName && (
              <div className="flex justify-between items-baseline py-1 border-b border-stone-100">
                <span className="text-stone-600">{t('সংযুক্ত প্রকল্প:', 'Related Project:')}</span>
                <span className="font-medium text-stone-800 text-right">{transaction.projectName}</span>
              </div>
            )}

            <div className="flex justify-between items-baseline py-1 border-b border-stone-100">
              <span className="text-stone-600">{t('পরিশোধের মাধ্যম:', 'Payment Method:')}</span>
              <span className="font-medium text-stone-800 text-right">
                {getPaymentMethodLabel(transaction.paymentMethod, isBn)}
                {transaction.referenceNo && ` (Ref: ${transaction.referenceNo})`}
              </span>
            </div>

            {transaction.description && (
              <div className="py-1 text-stone-600 text-xs italic">
                <span>{t('মন্তব্য / উদ্দেশ্য: ', 'Note: ')}</span>
                <span>{transaction.description}</span>
              </div>
            )}

            {/* Total Amount Box */}
            <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-800 block">
                  {t('মোট প্রাপ্ত অর্থ', 'Total Received Amount')}
                </span>
                <span className="text-[11px] text-emerald-600">
                  {t('আল্লাহ তায়ালা আপনার দান কবুল করুন', 'May Allah accept your noble contribution')}
                </span>
              </div>
              <div className="text-2xl font-bold font-mono text-emerald-950">
                {formatCurrency(transaction.amount, isBn)}
              </div>
            </div>
          </div>

          {/* Signature & Seal Footer */}
          <div className="pt-8 mt-4 border-t border-stone-300 flex items-end justify-between text-xs text-stone-600">
            <div className="text-center">
              <div className="w-28 border-b border-stone-400 mb-1 mx-auto" />
              <span>{t('আদায়কারী / হিসাবরক্ষক', 'Collector / Accountant')}</span>
              <p className="text-[10px] text-stone-400 font-mono mt-0.5">{transaction.enteredBy}</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-emerald-800/40 flex flex-col items-center justify-center p-1 text-[8px] font-bold text-emerald-900 text-center leading-tight uppercase rotate-[-5deg]">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-700 mb-0.5" />
                <span>UKPJS</span>
                <span>VERIFIED</span>
              </div>
            </div>

            <div className="text-center">
              <div className="w-28 border-b border-stone-400 mb-1 mx-auto" />
              <span>{t('সভাপতি / সম্পাদক', 'President / Secretary')}</span>
              <p className="text-[10px] text-stone-400 mt-0.5">{t('উমারখালী কিস্তুপুর', 'UKPJS Kushtia')}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
