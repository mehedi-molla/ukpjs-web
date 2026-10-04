<?php

namespace Database\Seeders;

use App\Models\Contact;
use App\Models\ContactCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Flags the contact categories shown under /emergency and adds placeholder entries.
 * Sample entries are is_demo=true with no phone number, so nothing invented is ever published.
 * Replace them from Admin → Contacts (set a real phone, tick Verified, untick Demo).
 */
class EmergencyServiceSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function (): void {
            foreach ($this->categories() as $sort => [$slug, $nameBn, $nameEn, $descBn, $descEn, $icon, $featured]) {
                $category = ContactCategory::firstOrCreate(['slug' => $slug], ['name_bn' => $nameBn, 'name_en' => $nameEn]);
                $category->update([
                    'is_active' => true, 'is_emergency_service' => true, 'is_home_featured' => $featured,
                    'icon' => $icon, 'sort_order' => $sort + 1, 'description_bn' => $descBn, 'description_en' => $descEn,
                ]);

                foreach ($this->entries()[$slug] ?? [] as $index => $entry) {
                    $isNational = isset($entry['phone']);
                    Contact::updateOrCreate(
                        ['legacy_id' => "emergency-{$slug}-".($index + 1)],
                        $entry + [
                            'category_id' => $category->id, 'is_emergency' => true, 'is_published' => true,
                            'is_verified' => $isNational, 'is_demo' => ! $isNational, 'sort_order' => $index,
                            'last_verified_at' => $isNational ? now()->toDateString() : null,
                        ],
                    );
                }
            }
        });
    }

    /** @return array<int, array{string, string, string, string, string, string, bool}> */
    private function categories(): array
    {
        return [
            ['police', 'পুলিশ', 'Police', 'থানা ও পুলিশ সহায়তা, আইনশৃঙ্খলা ও নিরাপত্তা।', 'Local police station help, law and safety.', 'shield-alert', true],
            ['doctor', 'ডাক্তার', 'Doctor', 'এলাকার চিকিৎসকের পরামর্শ ও জরুরি চিকিৎসা।', 'Local doctors for advice and urgent treatment.', 'stethoscope', true],
            ['microbus', 'মাইক্রোবাস', 'Microbus', 'রোগী বা যাত্রী পরিবহনে জরুরি মাইক্রোবাস।', 'Emergency microbus for patients or travel.', 'bus', true],
            ['hospital', 'হাসপাতাল', 'Hospital', 'উপজেলা ও নিকটবর্তী হাসপাতালের জরুরি বিভাগ।', 'Upazila and nearby hospital emergency units.', 'hospital', true],
            ['pharmacy', 'ফার্মেসি', 'Pharmacy', 'প্রয়োজনীয় ঔষধ ও রাতের ফার্মেসি।', 'Essential medicines and late-night pharmacies.', 'pill', true],
            ['ambulance', 'এ্যাম্বুলেন্স', 'Ambulance', 'রোগী দ্রুত হাসপাতালে নেওয়ার এ্যাম্বুলেন্স।', 'Ambulance to get patients to hospital fast.', 'ambulance', false],
            ['fire_service', 'ফায়ার সার্ভিস', 'Fire Service', 'অগ্নিকাণ্ড ও দুর্ঘটনায় উদ্ধার সহায়তা।', 'Fire and accident rescue support.', 'flame', false],
            ['blood_bank', 'ব্লাড ব্যাংক', 'Blood Bank', 'জরুরি রক্তের প্রয়োজনে ব্লাড ব্যাংক।', 'Blood banks for urgent needs.', 'droplet', false],
            ['electricity', 'বিদ্যুৎ', 'Electricity', 'বিদ্যুৎ বিভ্রাট ও লাইনের ত্রুটির অভিযোগ।', 'Report power outages and line faults.', 'zap', false],
            ['gas', 'গ্যাস', 'Gas', 'গ্যাস লিক বা সিলিন্ডার সংক্রান্ত জরুরি সহায়তা।', 'Help with gas leaks or cylinder issues.', 'fuel', false],
        ];
    }

    /**
     * Entries with a 'phone' key are official national hotlines and are published as verified.
     * All others are demo placeholders without a phone number.
     */
    private function entries(): array
    {
        $national999 = ['name_bn' => 'জাতীয় জরুরি সেবা ৯৯৯', 'name_en' => 'National Emergency Service 999', 'phone' => '999', 'availability' => '24/7', 'area' => 'সারাদেশ (টোল ফ্রি)'];

        return [
            'police' => [
                $national999 + ['designation_bn' => 'পুলিশ, ফায়ার ও এ্যাম্বুলেন্স', 'designation_en' => 'Police, fire & ambulance'],
                ['name_bn' => 'অফিসার ইনচার্জ (নমুনা)', 'name_en' => 'Officer in Charge (sample)', 'designation_bn' => 'অফিসার ইনচার্জ', 'designation_en' => 'Officer in Charge', 'service_area' => 'কুমারখালী থানা', 'area' => 'কুমারখালী'],
                ['name_bn' => 'ডিউটি অফিসার (নমুনা)', 'name_en' => 'Duty Officer (sample)', 'designation_bn' => 'ডিউটি অফিসার', 'designation_en' => 'Duty Officer', 'service_area' => 'কুমারখালী থানা', 'availability' => '24/7', 'area' => 'কুমারখালী'],
                ['name_bn' => 'বিট পুলিশিং অফিসার (নমুনা)', 'name_en' => 'Beat Policing Officer (sample)', 'designation_bn' => 'সাব-ইন্সপেক্টর', 'designation_en' => 'Sub-Inspector', 'service_area' => 'উমারখালী বিট', 'area' => 'উমারখালী'],
            ],
            'doctor' => [
                ['name_bn' => 'স্বাস্থ্য বাতায়ন ১৬২৬৩', 'name_en' => 'Health Hotline 16263', 'phone' => '16263', 'designation_bn' => 'টেলিমেডিসিন ডাক্তার', 'designation_en' => 'Telemedicine doctors', 'availability' => '24/7', 'area' => 'সারাদেশ'],
                ['name_bn' => 'ডাঃ মোঃ রফিকুল ইসলাম (নমুনা)', 'name_en' => 'Dr. Md. Rafiqul Islam (sample)', 'designation_bn' => 'মেডিসিন বিশেষজ্ঞ', 'designation_en' => 'Medicine specialist', 'service_area' => 'কুমারখালী উপজেলা স্বাস্থ্য কমপ্লেক্স', 'availability' => 'সকাল ৯টা – দুপুর ২টা', 'area' => 'কুমারখালী'],
                ['name_bn' => 'ডাঃ নাসরিন সুলতানা (নমুনা)', 'name_en' => 'Dr. Nasrin Sultana (sample)', 'designation_bn' => 'গাইনি ও প্রসূতি', 'designation_en' => 'Gynaecology & obstetrics', 'service_area' => 'উমারখালী বাজার চেম্বার', 'availability' => 'বিকাল ৪টা – রাত ৮টা', 'area' => 'উমারখালী'],
                ['name_bn' => 'ডাঃ আবু সাঈদ (নমুনা)', 'name_en' => 'Dr. Abu Sayeed (sample)', 'designation_bn' => 'শিশু বিশেষজ্ঞ', 'designation_en' => 'Paediatrician', 'service_area' => 'কিস্তুপুর মোড় চেম্বার', 'availability' => 'শুক্র ও শনি, বিকাল ৫টা – রাত ৯টা', 'area' => 'কিস্তুপুর'],
            ],
            'microbus' => [
                ['name_bn' => 'মোঃ জাহিদ হাসান (নমুনা)', 'name_en' => 'Md. Zahid Hasan (sample)', 'designation_bn' => 'টয়োটা হায়েস · ১১ সিট', 'designation_en' => 'Toyota Hiace · 11 seats', 'availability' => '24/7', 'area' => 'উমারখালী'],
                ['name_bn' => 'মোঃ সোহেল রানা (নমুনা)', 'name_en' => 'Md. Sohel Rana (sample)', 'designation_bn' => 'নোয়া · ৭ সিট', 'designation_en' => 'Noah · 7 seats', 'area' => 'কিস্তুপুর'],
                ['name_bn' => 'মোঃ আলমগীর হোসেন (নমুনা)', 'name_en' => 'Md. Alamgir Hossain (sample)', 'designation_bn' => 'হায়েস (এসি) · ১৪ সিট', 'designation_en' => 'Hiace (AC) · 14 seats', 'area' => 'কুমারখালী'],
            ],
            'hospital' => [
                ['name_bn' => 'উপজেলা স্বাস্থ্য কমপ্লেক্স (নমুনা)', 'name_en' => 'Upazila Health Complex (sample)', 'designation_bn' => 'সরকারি', 'designation_en' => 'Government', 'availability' => '24/7', 'area' => 'কুমারখালী'],
                ['name_bn' => 'জেনারেল হাসপাতাল (নমুনা)', 'name_en' => 'General Hospital (sample)', 'designation_bn' => 'সরকারি · জেলা', 'designation_en' => 'Government · District', 'availability' => '24/7', 'area' => 'কুষ্টিয়া সদর'],
                ['name_bn' => 'শেফা ক্লিনিক (নমুনা)', 'name_en' => 'Shefa Clinic (sample)', 'designation_bn' => 'বেসরকারি ক্লিনিক', 'designation_en' => 'Private clinic', 'availability' => 'সকাল ৮টা – রাত ১০টা', 'area' => 'উমারখালী বাজার'],
            ],
            'pharmacy' => [
                ['name_bn' => 'মা ফার্মেসি (নমুনা)', 'name_en' => 'Maa Pharmacy (sample)', 'availability' => 'সকাল ৮টা – রাত ১১টা', 'area' => 'উমারখালী বাজার'],
                ['name_bn' => 'নিউ লাইফ ড্রাগ হাউস (নমুনা)', 'name_en' => 'New Life Drug House (sample)', 'availability' => '24/7', 'area' => 'কুমারখালী হাসপাতাল মোড়'],
                ['name_bn' => 'সেবা মেডিকেল হল (নমুনা)', 'name_en' => 'Seba Medical Hall (sample)', 'availability' => 'সকাল ৯টা – রাত ১০টা', 'area' => 'কিস্তুপুর'],
            ],
            'ambulance' => [
                $national999 + ['designation_bn' => 'সরকারি এ্যাম্বুলেন্স', 'designation_en' => 'Government ambulance'],
                ['name_bn' => 'কমিউনিটি এ্যাম্বুলেন্স (নমুনা)', 'name_en' => 'Community Ambulance (sample)', 'designation_bn' => 'অক্সিজেনসহ', 'designation_en' => 'With oxygen', 'availability' => '24/7', 'area' => 'উমারখালী'],
                ['name_bn' => 'উপজেলা হাসপাতাল এ্যাম্বুলেন্স (নমুনা)', 'name_en' => 'Upazila Hospital Ambulance (sample)', 'designation_bn' => 'সরকারি', 'designation_en' => 'Government', 'area' => 'কুমারখালী'],
            ],
            'fire_service' => [
                $national999 + ['designation_bn' => 'ফায়ার সার্ভিস', 'designation_en' => 'Fire service'],
                ['name_bn' => 'ফায়ার স্টেশন নিয়ন্ত্রণ কক্ষ (নমুনা)', 'name_en' => 'Fire Station Control Room (sample)', 'service_area' => 'কুমারখালী ফায়ার স্টেশন', 'availability' => '24/7', 'area' => 'কুমারখালী'],
                ['name_bn' => 'স্টেশন অফিসার (নমুনা)', 'name_en' => 'Station Officer (sample)', 'designation_bn' => 'স্টেশন অফিসার', 'designation_en' => 'Station Officer', 'service_area' => 'কুমারখালী ফায়ার স্টেশন', 'area' => 'কুমারখালী'],
            ],
            'blood_bank' => [
                ['name_bn' => 'হাসপাতাল ব্লাড ব্যাংক (নমুনা)', 'name_en' => 'Hospital Blood Bank (sample)', 'designation_bn' => 'সরকারি', 'designation_en' => 'Government', 'availability' => '24/7', 'area' => 'কুষ্টিয়া সদর'],
                ['name_bn' => 'সন্ধানী ব্লাড ব্যাংক (নমুনা)', 'name_en' => 'Sandhani Blood Bank (sample)', 'designation_bn' => 'স্বেচ্ছাসেবী', 'designation_en' => 'Volunteer', 'availability' => 'সকাল ৯টা – রাত ৯টা', 'area' => 'কুষ্টিয়া'],
                ['name_bn' => 'যুব সংঘ রক্তদাতা দল (নমুনা)', 'name_en' => 'Jubo Songho Donor Team (sample)', 'designation_bn' => 'স্বেচ্ছাসেবী রক্তদাতা', 'designation_en' => 'Volunteer donors', 'area' => 'উমারখালী'],
            ],
            'electricity' => [
                ['name_bn' => 'পল্লী বিদ্যুৎ অভিযোগ কেন্দ্র (নমুনা)', 'name_en' => 'Palli Bidyut Complaint Centre (sample)', 'designation_bn' => 'অভিযোগ কেন্দ্র', 'designation_en' => 'Complaint centre', 'availability' => '24/7', 'area' => 'কুমারখালী'],
                ['name_bn' => 'লাইনম্যান (নমুনা)', 'name_en' => 'Lineman (sample)', 'designation_bn' => 'লাইনম্যান', 'designation_en' => 'Lineman', 'area' => 'উমারখালী'],
                ['name_bn' => 'জোনাল অফিস (নমুনা)', 'name_en' => 'Zonal Office (sample)', 'designation_bn' => 'জোনাল অফিস', 'designation_en' => 'Zonal office', 'availability' => 'সকাল ৯টা – বিকাল ৫টা', 'area' => 'কুমারখালী'],
            ],
            'gas' => [
                ['name_bn' => 'এলপিজি সিলিন্ডার ডিলার (নমুনা)', 'name_en' => 'LPG Cylinder Dealer (sample)', 'designation_bn' => 'সিলিন্ডার সরবরাহ', 'designation_en' => 'Cylinder supply', 'availability' => 'সকাল ৮টা – রাত ৯টা', 'area' => 'উমারখালী বাজার'],
                ['name_bn' => 'গ্যাস স্টোভ মেকানিক (নমুনা)', 'name_en' => 'Gas Stove Mechanic (sample)', 'designation_bn' => 'চুলা ও রেগুলেটর মেরামত', 'designation_en' => 'Stove & regulator repair', 'area' => 'কিস্তুপুর'],
                ['name_bn' => 'এলপিজি পরিবেশক (নমুনা)', 'name_en' => 'LPG Distributor (sample)', 'designation_bn' => 'পরিবেশক', 'designation_en' => 'Distributor', 'availability' => 'সকাল ৯টা – সন্ধ্যা ৭টা', 'area' => 'কুমারখালী'],
            ],
        ];
    }
}
