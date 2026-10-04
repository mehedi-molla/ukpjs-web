import fs from 'fs';
import path from 'path';
import { 
  Project, 
  Member, 
  Transaction, 
  MonthlyDonation, 
  ImportantContact, 
  ContactCategoryItem,
  BloodDonor, 
  CommitteeMember, 
  Notice, 
  WelfareRequest, 
  WebsiteSettings,
  User,
  AuditLog,
  FinancialSummary
} from '../src/types';

import { 
  initialProjects, 
  initialMembers, 
  initialTransactions, 
  initialMonthlyDonations, 
  initialContactCategories,
  initialImportantContacts, 
  initialBloodDonors, 
  initialCommittees, 
  initialNotices, 
  initialWelfareRequests, 
  initialSettings,
  initialUsers
} from '../src/data/initialData';

export interface DatabaseSchema {
  users: User[];
  members: Member[];
  projects: Project[];
  transactions: Transaction[];
  monthlyDonations: MonthlyDonation[];
  contactCategories: ContactCategoryItem[];
  contacts: ImportantContact[];
  bloodDonors: BloodDonor[];
  committees: CommitteeMember[];
  notices: Notice[];
  welfareRequests: WelfareRequest[];
  settings: WebsiteSettings;
  auditLogs: AuditLog[];
  lastVoucherSeq: number;
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

class DatabaseEngine {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        let updated = false;

        if (!parsed.contactCategories || !Array.isArray(parsed.contactCategories) || parsed.contactCategories.length === 0) {
          parsed.contactCategories = initialContactCategories;
          updated = true;
        }

        // Migrate contacts if Badarpasha UP or updated list or missing pharmacy
        if (!parsed.contacts || !Array.isArray(parsed.contacts) || !parsed.contacts.some((c: any) => c.category === 'pharmacy')) {
          parsed.contacts = initialImportantContacts;
          updated = true;
        }

        if (updated) {
          fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
        }

        return parsed;
      } catch (err) {
        console.error('Failed to read db.json, re-initializing from seeds:', err);
      }
    }

    const defaultDb: DatabaseSchema = {
      users: initialUsers,
      members: initialMembers,
      projects: initialProjects,
      transactions: initialTransactions,
      monthlyDonations: initialMonthlyDonations,
      contactCategories: initialContactCategories,
      contacts: initialImportantContacts,
      bloodDonors: initialBloodDonors,
      committees: initialCommittees,
      notices: initialNotices,
      welfareRequests: initialWelfareRequests,
      settings: initialSettings,
      auditLogs: [
        {
          id: 'log-1',
          userId: 'usr-admin-1',
          userName: 'সুপার এডমিন',
          action: 'SYSTEM_BOOTSTRAP',
          module: 'system',
          recordId: 'root',
          details: 'ডাটাবেজ সফলভাবে প্রাথমিক তথ্যাদিসহ ইনিশিয়ালাইজ করা হয়েছে',
          timestamp: new Date().toISOString(),
        }
      ],
      lastVoucherSeq: 14,
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8');
    return defaultDb;
  }

  public save(): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  public getData(): DatabaseSchema {
    return this.data;
  }

  public logAction(userId: string, userName: string, action: string, module: string, recordId: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      userName,
      action,
      module,
      recordId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs = this.data.auditLogs.slice(0, 500);
    }
    this.save();
  }

  public generateNextVoucherNo(): string {
    this.data.lastVoucherSeq = (this.data.lastVoucherSeq || 0) + 1;
    const year = new Date().getFullYear();
    const formattedSeq = String(this.data.lastVoucherSeq).padStart(6, '0');
    return `UKPJS-${year}-${formattedSeq}`;
  }

  public calculateFinancialSummary(): FinancialSummary {
    const validTrxs = this.data.transactions.filter(t => t.status === 'completed');
    
    let totalIncome = 0;
    let totalExpense = 0;
    let totalGeneralHadiya = 0;
    let totalMonthlyDonation = 0;
    let totalProjectDonation = 0;
    let totalZakat = 0;
    let totalSadaqah = 0;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    let thisMonthIncome = 0;
    let thisMonthExpense = 0;
    let lastMonthIncome = 0;
    let lastMonthExpense = 0;

    for (const trx of validTrxs) {
      const trxDate = new Date(trx.date);
      const trxYear = trxDate.getFullYear();
      const trxMonth = trxDate.getMonth() + 1;

      if (trx.type === 'income') {
        totalIncome += trx.amount;

        if (trx.fundType === 'general_hadiya') totalGeneralHadiya += trx.amount;
        else if (trx.fundType === 'monthly_donation') totalMonthlyDonation += trx.amount;
        else if (trx.fundType === 'project_donation') totalProjectDonation += trx.amount;
        else if (trx.fundType === 'zakat') totalZakat += trx.amount;
        else if (trx.fundType === 'sadaqah') totalSadaqah += trx.amount;

        if (trxYear === currentYear && trxMonth === currentMonth) {
          thisMonthIncome += trx.amount;
        } else if (trxYear === lastMonthYear && trxMonth === lastMonth) {
          lastMonthIncome += trx.amount;
        }
      } else if (trx.type === 'expense') {
        totalExpense += trx.amount;

        if (trxYear === currentYear && trxMonth === currentMonth) {
          thisMonthExpense += trx.amount;
        } else if (trxYear === lastMonthYear && trxMonth === lastMonth) {
          lastMonthExpense += trx.amount;
        }
      }
    }

    return {
      totalIncome,
      totalExpense,
      currentBalance: totalIncome - totalExpense,
      totalGeneralHadiya,
      totalMonthlyDonation,
      totalProjectDonation,
      totalZakat,
      totalSadaqah,
      thisMonthIncome,
      thisMonthExpense,
      lastMonthIncome,
      lastMonthExpense,
    };
  }

  public getProjectFinancials(projectId: string) {
    const projectTrxs = this.data.transactions.filter(
      t => t.projectId === projectId && t.status === 'completed'
    );
    const collected = projectTrxs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const spent = projectTrxs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const contributorsSet = new Set<string>();
    projectTrxs
      .filter(t => t.type === 'income')
      .forEach(t => {
        if (t.memberId) contributorsSet.add(t.memberId);
        else if (t.donorName) contributorsSet.add(t.donorName);
        else contributorsSet.add(t.id);
      });

    return {
      collected,
      spent,
      balance: collected - spent,
      contributorsCount: contributorsSet.size,
      transactions: projectTrxs,
    };
  }
}

export const db = new DatabaseEngine();
