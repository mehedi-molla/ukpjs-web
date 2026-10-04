export const bnNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

export function toBengaliNumber(n: number | string | undefined | null): string {
  if (n === undefined || n === null) return '০';
  const str = n.toString();
  return str.replace(/[0-9]/g, digit => bnNumerals[parseInt(digit, 10)]);
}

export function formatCurrency(amount: number | undefined | null, isBengali: boolean = true): string {
  const val = Number(amount || 0);
  const formatted = val.toLocaleString('en-IN'); // South Asian grouping e.g. 1,00,000
  if (isBengali) {
    return `${toBengaliNumber(formatted)} ৳`;
  }
  return `৳ ${formatted}`;
}

export function formatDate(dateStr: string | undefined | null, isBengali: boolean = true): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;

  const day = d.getDate();
  const year = d.getFullYear();
  const monthNamesBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const monthNamesEn = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  if (isBengali) {
    return `${toBengaliNumber(day)} ${monthNamesBn[d.getMonth()]}, ${toBengaliNumber(year)}`;
  }
  return `${day} ${monthNamesEn[d.getMonth()]}, ${year}`;
}

export function getFundTypeLabel(fundType: string, isBengali: boolean = true): string {
  const map: Record<string, { bn: string; en: string }> = {
    general_hadiya: { bn: 'সাধারণ হাদিয়া', en: 'General Hadiya' },
    monthly_donation: { bn: 'মাসিক অনুদান', en: 'Monthly Contribution' },
    project_donation: { bn: 'প্রকল্প অনুদান', en: 'Project Fund' },
    zakat: { bn: 'যাকাত তহবিল', en: 'Zakat Fund' },
    sadaqah: { bn: 'সদকাহ', en: 'Sadaqah' },
    special_campaign: { bn: 'বিশেষ ক্যাম্পেইন', en: 'Special Campaign' },
    emergency_fund: { bn: 'জরুরি তহবিল', en: 'Emergency Fund' },
  };
  return map[fundType] ? (isBengali ? map[fundType].bn : map[fundType].en) : fundType;
}

export function getPaymentMethodLabel(method: string, isBengali: boolean = true): string {
  const map: Record<string, { bn: string; en: string }> = {
    cash: { bn: 'নগদ ক্যাশ (Cash)', en: 'Cash' },
    bkash: { bn: 'বিকাশ (bKash)', en: 'bKash' },
    nagad: { bn: 'নগদ (Nagad)', en: 'Nagad' },
    rocket: { bn: 'রকেট (Rocket)', en: 'Rocket' },
    bank: { bn: 'ব্যাংক হিসাব (Bank)', en: 'Bank Transfer' },
    other: { bn: 'অন্যান্য', en: 'Other' },
  };
  return map[method] ? (isBengali ? map[method].bn : map[method].en) : method;
}
