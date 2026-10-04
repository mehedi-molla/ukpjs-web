import { Ambulance, Bus, Droplet, Flame, Fuel, Hospital, PhoneCall, Pill, ShieldAlert, Stethoscope, Zap, type LucideIcon } from 'lucide-react';

// Categories and entries live in the database (contact_categories / contacts).
// This file only maps each category's stored `icon` name to a component and sets per-category field labels.
export const emergencyServiceIcons: Record<string, LucideIcon> = {
  'shield-alert': ShieldAlert, stethoscope: Stethoscope, bus: Bus, hospital: Hospital, pill: Pill,
  ambulance: Ambulance, flame: Flame, droplet: Droplet, zap: Zap, fuel: Fuel,
};

export const emergencyServiceIcon = (icon: string | null): LucideIcon => (icon && emergencyServiceIcons[icon]) || PhoneCall;

interface FieldLabel { bn: string; en: string }

// Which contact columns each category shows, and what they mean there. Empty fields are not rendered.
export interface EmergencyFieldLabels {
  designation?: FieldLabel;
  serviceArea?: FieldLabel;
  availability?: FieldLabel;
}

const hours = { bn: 'খোলা থাকে', en: 'Open hours' };

export const emergencyFieldLabels: Record<string, EmergencyFieldLabels> = {
  police: { designation: { bn: 'পদবি', en: 'Designation' }, serviceArea: { bn: 'থানা', en: 'Station' }, availability: { bn: 'সময়', en: 'Availability' } },
  doctor: { designation: { bn: 'বিশেষজ্ঞতা', en: 'Specialty' }, serviceArea: { bn: 'চেম্বার / হাসপাতাল', en: 'Chamber / hospital' }, availability: { bn: 'রোগী দেখার সময়', en: 'Visiting hours' } },
  microbus: { designation: { bn: 'গাড়ি / সিট', en: 'Vehicle / seats' }, availability: { bn: 'সময়', en: 'Availability' } },
  hospital: { designation: { bn: 'ধরন', en: 'Type' }, availability: hours },
  pharmacy: { availability: hours },
  ambulance: { designation: { bn: 'ধরন', en: 'Type' }, availability: { bn: 'সময়', en: 'Availability' } },
  fire_service: { designation: { bn: 'পদবি', en: 'Designation' }, serviceArea: { bn: 'স্টেশন', en: 'Station' }, availability: { bn: 'সময়', en: 'Availability' } },
  blood_bank: { designation: { bn: 'ধরন', en: 'Type' }, availability: hours },
  electricity: { designation: { bn: 'অফিস', en: 'Office' }, availability: hours },
  gas: { designation: { bn: 'সেবা', en: 'Service' }, availability: hours },
};

export const defaultEmergencyFieldLabels: EmergencyFieldLabels = {
  designation: { bn: 'পদবি', en: 'Designation' }, serviceArea: { bn: 'সেবা এলাকা', en: 'Service area' }, availability: { bn: 'সময়', en: 'Availability' },
};
