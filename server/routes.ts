import { Router, Request, Response } from 'express';
import { db } from './db';
import { Transaction, Project, Member, ImportantContact, ContactCategoryItem, Notice, WelfareRequest } from '../src/types';

export const apiRouter = Router();

// ---------------- AUTHENTICATION ----------------
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = db.getData();

  // Demo credentials check
  // Super admin: admin@ukpjs.org / admin123
  // Member: tariq@ukpjs.org / member123
  let user = data.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());

  if (!user) {
    if (email === 'admin@ukpjs.org' || email === 'admin') {
      user = data.users.find(u => u.role === 'super_admin');
    } else if (email === 'tariq@ukpjs.org' || email === 'member') {
      user = data.users.find(u => u.role === 'member');
    }
  }

  if (user) {
    db.logAction(user.id, user.name, 'USER_LOGIN', 'auth', user.id, `${user.name} সিস্টেমে লগইন করেছেন`);
    return res.json({
      success: true,
      token: `ukpjs_tok_${user.id}_${Date.now()}`,
      user,
    });
  }

  return res.status(401).json({
    success: false,
    message: 'ভুল ইমেইল অথবা পাসওয়ার্ড। অনুগ্রহ করে সঠিক তথ্য প্রদান করুন।',
  });
});

apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const data = db.getData();

  if (authHeader && authHeader.includes('usr-')) {
    const userId = authHeader.split('_')[2];
    const user = data.users.find(u => u.id === userId);
    if (user) {
      const member = user.memberId ? data.members.find(m => m.id === user.memberId || m.memberId === user.memberId) : null;
      return res.json({ user, member });
    }
  }

  // Default to Super Admin for seamless demo experience
  const defaultUser = data.users[0];
  const member = defaultUser.memberId ? data.members.find(m => m.id === defaultUser.memberId || m.memberId === defaultUser.memberId) : null;
  return res.json({ user: defaultUser, member });
});

// ---------------- FINANCIAL SUMMARY ----------------
apiRouter.get('/financial-summary', (_req: Request, res: Response) => {
  const summary = db.calculateFinancialSummary();
  res.json(summary);
});

// ---------------- TRANSACTIONS ----------------
apiRouter.get('/transactions', (req: Request, res: Response) => {
  const { type, fundType, projectId, memberId, search, status, limit, page } = req.query;
  const data = db.getData();
  let list = [...data.transactions];

  if (type) list = list.filter(t => t.type === type);
  if (fundType) list = list.filter(t => t.fundType === fundType);
  if (projectId) list = list.filter(t => t.projectId === projectId);
  if (memberId) list = list.filter(t => t.memberId === memberId);
  if (status) list = list.filter(t => t.status === status);

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(t => 
      t.voucherNo.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      (t.memberName && t.memberName.toLowerCase().includes(q)) ||
      (t.donorName && t.donorName.toLowerCase().includes(q)) ||
      (t.projectName && t.projectName.toLowerCase().includes(q)) ||
      (t.referenceNo && t.referenceNo.toLowerCase().includes(q)) ||
      t.categoryName.toLowerCase().includes(q)
    );
  }

  // Sort descending by date and time
  list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = list.length;
  const pageNum = parseInt(String(page || '1'), 10);
  const pageSize = parseInt(String(limit || '50'), 10);
  const startIndex = (pageNum - 1) * pageSize;
  const paginated = list.slice(startIndex, startIndex + pageSize);

  res.json({
    data: paginated,
    total,
    page: pageNum,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
});

apiRouter.post('/transactions', (req: Request, res: Response) => {
  const {
    type,
    fundType,
    categoryId,
    categoryName,
    amount,
    date,
    projectId,
    memberId,
    donorName,
    isAnonymous,
    paymentMethod,
    referenceNo,
    description,
    paidTo,
    enteredBy,
    receiptUrl,
  } = req.body;

  if (!type || !amount || !date || !categoryId) {
    return res.status(400).json({ error: 'আবশ্যকীয় ফিল্ডগুলো পূরণ করুন (Type, Amount, Date, Category)' });
  }

  const data = db.getData();
  const voucherNo = db.generateNextVoucherNo();

  let projectName: string | undefined;
  if (projectId) {
    const prj = data.projects.find(p => p.id === projectId);
    if (prj) projectName = prj.titleBn;
  }

  let memberName: string | undefined;
  if (memberId) {
    const mem = data.members.find(m => m.id === memberId || m.memberId === memberId);
    if (mem) memberName = mem.nameBn;
  }

  const newTrx: Transaction = {
    id: `trx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    voucherNo,
    type,
    fundType: fundType || 'general_hadiya',
    categoryId,
    categoryName: categoryName || 'সাধারণ',
    amount: Number(amount),
    date,
    projectId,
    projectName,
    memberId,
    memberName,
    donorName,
    isAnonymous: Boolean(isAnonymous),
    paymentMethod: paymentMethod || 'cash',
    referenceNo,
    description: description || '',
    paidTo,
    enteredBy: enteredBy || 'সুপার এডমিন',
    receiptUrl,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };

  data.transactions.unshift(newTrx);

  // If this is a monthly donation for a member, also sync/create MonthlyDonation record
  if (type === 'income' && fundType === 'monthly_donation' && memberId) {
    const trxDate = new Date(date);
    const m = trxDate.getMonth() + 1;
    const y = trxDate.getFullYear();

    const existingMd = data.monthlyDonations.find(
      md => md.memberId === memberId && md.month === m && md.year === y
    );

    if (existingMd) {
      existingMd.paidAmount += Number(amount);
      existingMd.status = existingMd.paidAmount >= existingMd.expectedAmount ? 'paid' : 'partial';
      existingMd.paymentDate = date;
      existingMd.voucherNo = voucherNo;
      existingMd.updatedAt = new Date().toISOString();
    } else {
      const memberObj = data.members.find(mem => mem.id === memberId || mem.memberId === memberId);
      const expected = memberObj?.monthlyPledgeAmount || Number(amount);
      data.monthlyDonations.push({
        id: `md-${Date.now()}`,
        memberId,
        memberName: memberName || 'সদস্য',
        month: m,
        year: y,
        expectedAmount: expected,
        paidAmount: Number(amount),
        paymentDate: date,
        paymentMethod: paymentMethod || 'cash',
        voucherNo,
        status: Number(amount) >= expected ? 'paid' : 'partial',
        updatedAt: new Date().toISOString(),
      });
    }
  }

  db.logAction(
    'usr-admin-1',
    enteredBy || 'এডমিন',
    'CREATE_TRANSACTION',
    'transactions',
    newTrx.id,
    `${voucherNo}: ৳${newTrx.amount} (${type === 'income' ? 'আয়' : 'ব্যয়'}) এন্ট্রি করা হয়েছে`
  );

  db.save();
  return res.status(201).json(newTrx);
});

apiRouter.put('/transactions/:id/cancel', (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const data = db.getData();

  const trx = data.transactions.find(t => t.id === id);
  if (!trx) {
    return res.status(404).json({ error: 'লেনদেন পাওয়া যায়নি' });
  }

  trx.status = 'cancelled';
  trx.description += ` [বাতিল করা হয়েছে: ${reason || 'প্রশাসনিক সিদ্ধান্ত'}]`;

  db.logAction(
    'usr-admin-1',
    'সুপার এডমিন',
    'CANCEL_TRANSACTION',
    'transactions',
    trx.id,
    `${trx.voucherNo} বাতিল করা হয়েছে। কারণ: ${reason || 'কোন কারণ উল্লেখ করা হয়নি'}`
  );

  db.save();
  res.json({ success: true, transaction: trx });
});

// ---------------- PROJECTS ----------------
apiRouter.get('/projects', (_req: Request, res: Response) => {
  const data = db.getData();
  const enhancedProjects = data.projects.map(prj => {
    const fin = db.getProjectFinancials(prj.id);
    return {
      ...prj,
      collectedAmount: fin.collected,
      expenseAmount: fin.spent,
      remainingFund: fin.balance,
      contributorsCount: fin.contributorsCount,
    };
  });

  res.json(enhancedProjects);
});

apiRouter.get('/projects/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const data = db.getData();
  const prj = data.projects.find(p => p.slug === slugOrId || p.id === slugOrId || p.code === slugOrId);

  if (!prj) {
    return res.status(404).json({ error: 'প্রকল্প খুঁজে পাওয়া যায়নি' });
  }

  const fin = db.getProjectFinancials(prj.id);
  res.json({
    ...prj,
    collectedAmount: fin.collected,
    expenseAmount: fin.spent,
    remainingFund: fin.balance,
    contributorsCount: fin.contributorsCount,
    transactions: fin.transactions,
  });
});

apiRouter.post('/projects', (req: Request, res: Response) => {
  const data = db.getData();
  const body = req.body;

  const nextCodeNum = data.projects.length + 1;
  const code = body.code || `PRJ-${String(nextCodeNum).padStart(2, '0')}`;
  const slug = body.slug || (body.titleEn ? body.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `project-${Date.now()}`);

  const newProject: Project = {
    id: `prj-${Date.now()}`,
    code,
    slug,
    titleBn: body.titleBn,
    titleEn: body.titleEn || body.titleBn,
    category: body.category || 'সামাজিক উন্নয়ন',
    shortDescBn: body.shortDescBn || '',
    shortDescEn: body.shortDescEn || '',
    fullDescBn: body.fullDescBn || '',
    fullDescEn: body.fullDescEn || '',
    featuredImage: body.featuredImage || '/src/assets/images/hero_community_welfare_1790158962676.jpg',
    galleryImages: body.galleryImages || [body.featuredImage || '/src/assets/images/hero_community_welfare_1790158962676.jpg'],
    videoUrl: body.videoUrl,
    startDate: body.startDate || new Date().toISOString().split('T')[0],
    expectedEndDate: body.expectedEndDate,
    actualEndDate: body.actualEndDate,
    estimatedBudget: Number(body.estimatedBudget || 0),
    status: body.status || 'upcoming',
    location: body.location || 'উমারখালী কিস্তুপুর',
    responsibleMembers: body.responsibleMembers || ['আব্দুর রহমান'],
    beneficiariesCount: Number(body.beneficiariesCount || 0),
    beneficiaryInfoBn: body.beneficiaryInfoBn,
    beneficiaryInfoEn: body.beneficiaryInfoEn,
    isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
    isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : false,
    completionOutcomeBn: body.completionOutcomeBn,
    completionOutcomeEn: body.completionOutcomeEn,
    createdAt: new Date().toISOString(),
  };

  data.projects.unshift(newProject);
  db.logAction('usr-admin-1', 'সুপার এডমিন', 'CREATE_PROJECT', 'projects', newProject.id, `নতুন প্রকল্প "${newProject.titleBn}" যুক্ত করা হয়েছে`);
  db.save();

  res.status(201).json(newProject);
});

apiRouter.put('/projects/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.projects.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'প্রকল্প খুঁজে পাওয়া যায়নি' });
  }

  data.projects[index] = {
    ...data.projects[index],
    ...req.body,
  };

  db.logAction('usr-admin-1', 'সুপার এডমিন', 'UPDATE_PROJECT', 'projects', id, `প্রকল্প "${data.projects[index].titleBn}" আপডেট করা হয়েছে`);
  db.save();

  res.json(data.projects[index]);
});

// ---------------- MEMBERS ----------------
apiRouter.get('/members', (req: Request, res: Response) => {
  const { search, memberType, activeOnly } = req.query;
  const data = db.getData();
  let list = [...data.members];

  if (activeOnly === 'true') {
    list = list.filter(m => m.isActive);
  }
  if (memberType) {
    list = list.filter(m => m.memberType === memberType);
  }
  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(m => 
      m.nameBn.toLowerCase().includes(q) ||
      m.nameEn.toLowerCase().includes(q) ||
      m.memberId.toLowerCase().includes(q) ||
      m.phone.includes(q) ||
      m.country.toLowerCase().includes(q)
    );
  }

  // Calculate each member's contributions
  const membersWithContributions = list.map(mem => {
    const memTrxs = data.transactions.filter(t => t.memberId === mem.id && t.status === 'completed');
    const totalDonation = memTrxs.reduce((sum, t) => sum + t.amount, 0);
    const monthlyTotal = memTrxs.filter(t => t.fundType === 'monthly_donation').reduce((sum, t) => sum + t.amount, 0);
    const projectTotal = memTrxs.filter(t => t.fundType === 'project_donation').reduce((sum, t) => sum + t.amount, 0);

    return {
      ...mem,
      totalDonation,
      monthlyTotal,
      projectTotal,
      transactionCount: memTrxs.length,
    };
  });

  res.json(membersWithContributions);
});

apiRouter.post('/members', (req: Request, res: Response) => {
  const data = db.getData();
  const body = req.body;

  const nextSeq = data.members.length + 1;
  const memberId = body.memberId || `MEM-${String(nextSeq).padStart(3, '0')}`;

  const newMember: Member = {
    id: `mem-${Date.now()}`,
    memberId,
    nameBn: body.nameBn,
    nameEn: body.nameEn || body.nameBn,
    phone: body.phone,
    whatsapp: body.whatsapp || body.phone,
    email: body.email,
    addressBn: body.addressBn || 'উমারখালী কিস্তুপুর',
    addressEn: body.addressEn || 'Umarkhali Kistupur',
    village: body.village || 'উমারখালী কিস্তুপুর',
    country: body.country || 'বাংলাদেশ (Bangladesh)',
    occupationBn: body.occupationBn,
    occupationEn: body.occupationEn,
    memberType: body.memberType || 'general',
    monthlyPledgeAmount: Number(body.monthlyPledgeAmount || 1000),
    joiningDate: body.joiningDate || new Date().toISOString().split('T')[0],
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    isPublicProfile: body.isPublicProfile !== undefined ? Boolean(body.isPublicProfile) : true,
    notes: body.notes,
    createdAt: new Date().toISOString(),
  };

  data.members.unshift(newMember);
  db.logAction('usr-admin-1', 'সুপার এডমিন', 'CREATE_MEMBER', 'members', newMember.id, `নতুন সদস্য ${newMember.nameBn} (${newMember.memberId}) নিবন্ধন করা হয়েছে`);
  db.save();

  res.status(201).json(newMember);
});

apiRouter.put('/members/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.members.findIndex(m => m.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'সদস্য খুঁজে পাওয়া যায়নি' });
  }

  data.members[index] = {
    ...data.members[index],
    ...req.body,
  };

  db.logAction('usr-admin-1', 'সুপার এডমিন', 'UPDATE_MEMBER', 'members', id, `সদস্য ${data.members[index].nameBn} তথ্য আপডেট করা হয়েছে`);
  db.save();

  res.json(data.members[index]);
});

// ---------------- MONTHLY DONATIONS ----------------
apiRouter.get('/monthly-donations', (req: Request, res: Response) => {
  const { year, month, memberId } = req.query;
  const data = db.getData();
  let list = [...data.monthlyDonations];

  if (year) list = list.filter(md => md.year === Number(year));
  if (month) list = list.filter(md => md.month === Number(month));
  if (memberId) list = list.filter(md => md.memberId === memberId);

  res.json(list);
});

apiRouter.post('/monthly-donations/record', (req: Request, res: Response) => {
  const { memberId, month, year, amount, paymentMethod, notes } = req.body;
  const data = db.getData();

  const member = data.members.find(m => m.id === memberId || m.memberId === memberId);
  if (!member) {
    return res.status(404).json({ error: 'সদস্য পাওয়া যায়নি' });
  }

  // Create financial transaction
  const voucherNo = db.generateNextVoucherNo();
  const nowStr = new Date().toISOString().split('T')[0];

  const trx: Transaction = {
    id: `trx-${Date.now()}`,
    voucherNo,
    type: 'income',
    fundType: 'monthly_donation',
    categoryId: 'cat-in-5',
    categoryName: 'সদস্যের মাসিক হাদিয়া (Member Monthly Hadiya)',
    amount: Number(amount),
    date: nowStr,
    memberId: member.id,
    memberName: member.nameBn,
    paymentMethod: paymentMethod || 'cash',
    description: `${year} সালের ${month} মাসের মাসিক চাঁদা/হাদিয়া`,
    enteredBy: 'সুপার এডমিন',
    status: 'completed',
    createdAt: new Date().toISOString(),
  };

  data.transactions.unshift(trx);

  // Update or create monthly donation ledger entry
  let md = data.monthlyDonations.find(
    d => d.memberId === member.id && d.month === Number(month) && d.year === Number(year)
  );

  if (md) {
    md.paidAmount += Number(amount);
    md.status = md.paidAmount >= md.expectedAmount ? 'paid' : 'partial';
    md.paymentDate = nowStr;
    md.paymentMethod = paymentMethod;
    md.voucherNo = voucherNo;
    md.notes = notes || md.notes;
    md.updatedAt = new Date().toISOString();
  } else {
    md = {
      id: `md-${Date.now()}`,
      memberId: member.id,
      memberName: member.nameBn,
      month: Number(month),
      year: Number(year),
      expectedAmount: member.monthlyPledgeAmount || Number(amount),
      paidAmount: Number(amount),
      paymentDate: nowStr,
      paymentMethod: paymentMethod || 'cash',
      voucherNo,
      status: Number(amount) >= (member.monthlyPledgeAmount || 0) ? 'paid' : 'partial',
      notes,
      updatedAt: new Date().toISOString(),
    };
    data.monthlyDonations.push(md);
  }

  db.logAction(
    'usr-admin-1',
    'সুপার এডমিন',
    'RECORD_MONTHLY_DONATION',
    'monthlyDonations',
    md.id,
    `${member.nameBn} - ${year}/${month} মাসের ৳${amount} রসিদ ${voucherNo} তৈরি করা হয়েছে`
  );

  db.save();
  res.json({ success: true, monthlyDonation: md, transaction: trx });
});

// ---------------- CONTACT CATEGORIES ----------------
apiRouter.get('/contact-categories', (_req: Request, res: Response) => {
  const data = db.getData();
  const categories = [...(data.contactCategories || [])].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  res.json(categories);
});

apiRouter.post('/contact-categories', (req: Request, res: Response) => {
  const data = db.getData();
  if (!data.contactCategories) data.contactCategories = [];

  const slug = (req.body.slug || req.body.nameEn || `cat_${Date.now()}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

  const newCat: ContactCategoryItem = {
    id: `cat-${Date.now()}`,
    slug: slug || `cat_${Date.now()}`,
    nameBn: req.body.nameBn || 'নতুন ক্যাটাগরি',
    nameEn: req.body.nameEn || 'New Category',
    icon: req.body.icon || 'Folder',
    sortOrder: Number(req.body.sortOrder || data.contactCategories.length + 1),
    isActive: req.body.isActive !== undefined ? Boolean(req.body.isActive) : true,
    isCore: false,
    descriptionBn: req.body.descriptionBn || '',
  };

  data.contactCategories.push(newCat);
  db.logAction('usr-admin-1', 'সুপার এডমিন', 'CREATE_CATEGORY', 'contacts', newCat.id, `নতুন যোগাযোগ ক্যাটাগরি "${newCat.nameBn}" তৈরি করা হয়েছে`);
  db.save();
  res.status(201).json(newCat);
});

apiRouter.put('/contact-categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  if (!data.contactCategories) data.contactCategories = [];
  const index = data.contactCategories.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'ক্যাটাগরি খুঁজে পাওয়া যায়নি' });
  }

  data.contactCategories[index] = {
    ...data.contactCategories[index],
    ...req.body,
  };

  db.logAction('usr-admin-1', 'সুপার এডমিন', 'UPDATE_CATEGORY', 'contacts', id, `ক্যাটাগরি "${data.contactCategories[index].nameBn}" আপডেট করা হয়েছে`);
  db.save();
  res.json(data.contactCategories[index]);
});

apiRouter.delete('/contact-categories/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  if (!data.contactCategories) data.contactCategories = [];
  const index = data.contactCategories.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'ক্যাটাগরি পাওয়া যায়নি' });
  }

  const removed = data.contactCategories.splice(index, 1)[0];
  db.logAction('usr-admin-1', 'সুপার এডমিন', 'DELETE_CATEGORY', 'contacts', id, `ক্যাটাগরি "${removed.nameBn}" মুছে ফেলা হয়েছে`);
  db.save();
  res.json({ success: true });
});

// ---------------- IMPORTANT CONTACTS ----------------
apiRouter.get('/contacts', (req: Request, res: Response) => {
  const { category, isEmergency, isFeatured, search, publicOnly } = req.query;
  const data = db.getData();
  let list = [...(data.contacts || [])];

  if (publicOnly === 'true') {
    list = list.filter(c => c.isPublished !== false);
  }

  if (category && category !== 'all') {
    list = list.filter(c => c.category === category || c.categoryId === category);
  }

  if (isEmergency === 'true') {
    list = list.filter(c => c.isEmergency);
  }

  if (isFeatured === 'true') {
    list = list.filter(c => c.isFeatured);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(c => 
      (c.nameBn && c.nameBn.toLowerCase().includes(q)) ||
      (c.nameEn && c.nameEn.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.categoryNameBn && c.categoryNameBn.toLowerCase().includes(q)) ||
      (c.designationBn && c.designationBn.toLowerCase().includes(q)) ||
      (c.area && c.area.toLowerCase().includes(q)) ||
      (c.ward && c.ward.toLowerCase().includes(q)) ||
      (c.serviceAreaBn && c.serviceAreaBn.toLowerCase().includes(q)) ||
      (c.vehicleDetails && c.vehicleDetails.toLowerCase().includes(q)) ||
      (c.driverName && c.driverName.toLowerCase().includes(q))
    );
  }

  list.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999));
  res.json(list);
});

apiRouter.post('/contacts', (req: Request, res: Response) => {
  const data = db.getData();
  if (!data.contacts) data.contacts = [];

  const newContact: ImportantContact = {
    id: `cnt-${Date.now()}`,
    categoryId: req.body.categoryId,
    category: req.body.category || 'other',
    categoryNameBn: req.body.categoryNameBn || 'অন্যান্য প্রয়োজনীয় যোগাযোগ',
    categoryNameEn: req.body.categoryNameEn || req.body.category || 'Other',
    nameBn: req.body.nameBn,
    nameEn: req.body.nameEn || req.body.nameBn,
    designationBn: req.body.designationBn || '',
    designationEn: req.body.designationEn || '',
    phone: req.body.phone,
    altPhone: req.body.altPhone || '',
    whatsapp: req.body.whatsapp || '',
    addressBn: req.body.addressBn || '',
    addressEn: req.body.addressEn || '',
    area: req.body.area || req.body.serviceAreaBn || '',
    ward: req.body.ward || '',
    unionName: req.body.unionName || 'চাঁদগ্রাম ইউনিয়ন',
    institutionName: req.body.institutionName || '',
    vehicleDetails: req.body.vehicleDetails || '',
    vehicleType: req.body.vehicleType || '',
    vehicleModel: req.body.vehicleModel || '',
    vehicleNumber: req.body.vehicleNumber || '',
    seatingCapacity: req.body.seatingCapacity || '',
    isAc: Boolean(req.body.isAc),
    serviceAreaBn: req.body.serviceAreaBn || req.body.area || 'উমারখালী কিস্তুপুর',
    serviceAreaEn: req.body.serviceAreaEn || 'Umarkhali Kistupur',
    isEmergency: Boolean(req.body.isEmergency),
    availabilityBn: req.body.availabilityBn || 'প্রয়োজনে যোগাযোগ করুন',
    availabilityEn: req.body.availabilityEn || 'Available upon call',
    mapUrl: req.body.mapUrl || '',
    descriptionBn: req.body.descriptionBn || req.body.notes || '',
    descriptionEn: req.body.descriptionEn || '',
    photoUrl: req.body.photoUrl || '',
    vehiclePhotoUrl: req.body.vehiclePhotoUrl || '',
    driverName: req.body.driverName || '',
    driverPhotoUrl: req.body.driverPhotoUrl || '',
    isFeatured: Boolean(req.body.isFeatured),
    isVerified: req.body.isVerified !== undefined ? Boolean(req.body.isVerified) : true,
    lastVerifiedAt: req.body.lastVerifiedAt || new Date().toISOString().split('T')[0],
    isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : true,
    isDemoPlaceholder: Boolean(req.body.isDemoPlaceholder),
    sortOrder: Number(req.body.sortOrder || data.contacts.length + 1),
    notes: req.body.notes || '',
  };

  data.contacts.push(newContact);
  db.logAction('usr-admin-1', 'সুপার এডমিন', 'CREATE_CONTACT', 'contacts', newContact.id, `ডিরেক্টরিতে "${newContact.nameBn}" যুক্ত করা হয়েছে`);
  db.save();

  res.status(201).json(newContact);
});

apiRouter.put('/contacts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.contacts.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'যোগাযোগ খুঁজে পাওয়া যায়নি' });
  }

  data.contacts[index] = {
    ...data.contacts[index],
    ...req.body,
    sortOrder: req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : data.contacts[index].sortOrder,
    isEmergency: req.body.isEmergency !== undefined ? Boolean(req.body.isEmergency) : data.contacts[index].isEmergency,
    isPublished: req.body.isPublished !== undefined ? Boolean(req.body.isPublished) : data.contacts[index].isPublished,
    isVerified: req.body.isVerified !== undefined ? Boolean(req.body.isVerified) : data.contacts[index].isVerified,
    isFeatured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : data.contacts[index].isFeatured,
  };

  db.logAction('usr-admin-1', 'সুপার এডমিন', 'UPDATE_CONTACT', 'contacts', id, `যোগাযোগ "${data.contacts[index].nameBn}" আপডেট করা হয়েছে`);
  db.save();
  res.json(data.contacts[index]);
});

apiRouter.patch('/contacts/:id/toggle-publish', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const contact = data.contacts.find(c => c.id === id);
  if (!contact) return res.status(404).json({ error: 'Not found' });

  contact.isPublished = !contact.isPublished;
  db.logAction('usr-admin-1', 'সুপার এডমিন', 'TOGGLE_PUBLISH_CONTACT', 'contacts', id, `যোগাযোগ "${contact.nameBn}" ${contact.isPublished ? 'প্রকাশিত' : 'অপ্রকাশিত'} করা হয়েছে`);
  db.save();
  res.json({ success: true, isPublished: contact.isPublished });
});

apiRouter.patch('/contacts/:id/toggle-verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const contact = data.contacts.find(c => c.id === id);
  if (!contact) return res.status(404).json({ error: 'Not found' });

  contact.isVerified = !contact.isVerified;
  if (contact.isVerified) {
    contact.lastVerifiedAt = new Date().toISOString().split('T')[0];
  }
  db.logAction('usr-admin-1', 'সুপার এডমিন', 'TOGGLE_VERIFY_CONTACT', 'contacts', id, `যোগাযোগ "${contact.nameBn}" যাচাইকৃত স্ট্যাটাস পরিবর্তিত`);
  db.save();
  res.json({ success: true, isVerified: contact.isVerified, lastVerifiedAt: contact.lastVerifiedAt });
});

apiRouter.delete('/contacts/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const data = db.getData();
  const index = data.contacts.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'যোগাযোগ পাওয়া যায়নি' });
  }

  const removed = data.contacts.splice(index, 1)[0];
  db.logAction('usr-admin-1', 'সুপার এডমিন', 'DELETE_CONTACT', 'contacts', id, `যোগাযোগ "${removed.nameBn}" ডিলিট করা হয়েছে`);
  db.save();

  res.json({ success: true });
});

// ---------------- BLOOD DONORS ----------------
apiRouter.get('/blood-donors', (req: Request, res: Response) => {
  const { bloodGroup, availableOnly } = req.query;
  const data = db.getData();
  let list = data.bloodDonors.filter(b => b.isPublic);

  if (bloodGroup && bloodGroup !== 'all') {
    list = list.filter(b => b.bloodGroup === bloodGroup);
  }
  if (availableOnly === 'true') {
    list = list.filter(b => b.isAvailable);
  }

  res.json(list);
});

apiRouter.post('/blood-donors', (req: Request, res: Response) => {
  const data = db.getData();
  const newDonor = {
    id: `bd-${Date.now()}`,
    ...req.body,
    isPublic: true,
  };
  data.bloodDonors.push(newDonor);
  db.save();
  res.status(201).json(newDonor);
});

// ---------------- COMMITTEES ----------------
apiRouter.get('/committees', (_req: Request, res: Response) => {
  const data = db.getData();
  const list = [...data.committees].sort((a, b) => a.sortOrder - b.sortOrder);
  res.json(list);
});

// ---------------- NOTICES ----------------
apiRouter.get('/notices', (_req: Request, res: Response) => {
  const data = db.getData();
  const list = data.notices.filter(n => n.isActive).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const timeB = new Date(b.publishDate || b.date || b.createdAt || 0).getTime();
    const timeA = new Date(a.publishDate || a.date || a.createdAt || 0).getTime();
    return timeB - timeA;
  });
  res.json(list);
});

apiRouter.post('/notices', (req: Request, res: Response) => {
  const data = db.getData();
  const newNotice: Notice = {
    id: `not-${Date.now()}`,
    titleBn: req.body.titleBn,
    titleEn: req.body.titleEn || req.body.titleBn,
    contentBn: req.body.contentBn,
    contentEn: req.body.contentEn || req.body.contentBn,
    publishDate: req.body.publishDate || new Date().toISOString().split('T')[0],
    expiryDate: req.body.expiryDate,
    isPinned: Boolean(req.body.isPinned),
    isActive: true,
    attachmentUrl: req.body.attachmentUrl,
    createdAt: new Date().toISOString(),
  };

  data.notices.unshift(newNotice);
  db.logAction('usr-admin-1', 'সুপার এডমিন', 'CREATE_NOTICE', 'notices', newNotice.id, `নতুন নোটিশ "${newNotice.titleBn}" প্রকাশ করা হয়েছে`);
  db.save();

  res.status(201).json(newNotice);
});

// ---------------- WELFARE REQUESTS ----------------
apiRouter.get('/welfare-requests', (_req: Request, res: Response) => {
  const data = db.getData();
  res.json(data.welfareRequests);
});

apiRouter.post('/welfare-requests', (req: Request, res: Response) => {
  const data = db.getData();
  const seq = data.welfareRequests.length + 1;
  const trackingNo = `WR-2025-${String(seq).padStart(3, '0')}`;

  const newRequest: WelfareRequest = {
    id: `wlf-${Date.now()}`,
    trackingNo,
    applicantName: req.body.applicantName,
    guardianName: req.body.guardianName || '',
    phone: req.body.phone,
    village: req.body.village || 'উমারখালী কিস্তুপুর',
    assistanceType: req.body.assistanceType || 'medical',
    description: req.body.description,
    requestedAmount: Number(req.body.requestedAmount || 0),
    status: 'submitted',
    createdAt: new Date().toISOString(),
  };

  data.welfareRequests.unshift(newRequest);
  db.logAction('guest', 'আবেদনকারী', 'SUBMIT_WELFARE_REQUEST', 'welfare', newRequest.id, `নতুন সাহায্য আবেদন ট্র্যাকিং: ${trackingNo}`);
  db.save();

  res.status(201).json(newRequest);
});

apiRouter.put('/welfare-requests/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, approvedAmount, verificationNotes } = req.body;
  const data = db.getData();

  const reqObj = data.welfareRequests.find(w => w.id === id);
  if (!reqObj) {
    return res.status(404).json({ error: 'আবেদন খুঁজে পাওয়া যায়নি' });
  }

  reqObj.status = status;
  if (approvedAmount !== undefined) reqObj.approvedAmount = Number(approvedAmount);
  if (verificationNotes !== undefined) reqObj.verificationNotes = verificationNotes;
  if (status === 'disbursed') reqObj.disbursedDate = new Date().toISOString().split('T')[0];

  db.logAction(
    'usr-admin-1',
    'সুপার এডমিন',
    'UPDATE_WELFARE_STATUS',
    'welfare',
    id,
    `${reqObj.trackingNo} স্ট্যাটাস পরিবর্তন: ${status}`
  );

  db.save();
  res.json(reqObj);
});

// ---------------- WEBSITE SETTINGS ----------------
apiRouter.get('/settings', (_req: Request, res: Response) => {
  const data = db.getData();
  res.json(data.settings);
});

apiRouter.put('/settings', (req: Request, res: Response) => {
  const data = db.getData();
  data.settings = {
    ...data.settings,
    ...req.body,
  };

  db.logAction('usr-admin-1', 'সুপার এডমিন', 'UPDATE_SETTINGS', 'settings', 'org_settings', 'সংগঠনের ওয়েবসাইট ও পেমেন্ট সেটিংস আপডেট করা হয়েছে');
  db.save();

  res.json(data.settings);
});

// ---------------- AUDIT LOGS ----------------
apiRouter.get('/audit-logs', (_req: Request, res: Response) => {
  const data = db.getData();
  res.json(data.auditLogs.slice(0, 100));
});

// ---------------- COMPREHENSIVE REPORTS ----------------
apiRouter.get('/reports', (req: Request, res: Response) => {
  const { reportType, fromDate, toDate, projectId, memberId, fundType, paymentMethod } = req.query;
  const data = db.getData();

  let trxs = data.transactions.filter(t => t.status === 'completed');

  if (fromDate) trxs = trxs.filter(t => t.date >= String(fromDate));
  if (toDate) trxs = trxs.filter(t => t.date <= String(toDate));
  if (projectId) trxs = trxs.filter(t => t.projectId === projectId);
  if (memberId) trxs = trxs.filter(t => t.memberId === memberId);
  if (fundType) trxs = trxs.filter(t => t.fundType === fundType);
  if (paymentMethod) trxs = trxs.filter(t => t.paymentMethod === paymentMethod);

  if (reportType === 'income') {
    trxs = trxs.filter(t => t.type === 'income');
  } else if (reportType === 'expense') {
    trxs = trxs.filter(t => t.type === 'expense');
  }

  // Calculate opening balance before fromDate if applicable
  let openingBalance = 0;
  if (fromDate) {
    const priorTrxs = data.transactions.filter(t => t.status === 'completed' && t.date < String(fromDate));
    const priorIncome = priorTrxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const priorExpense = priorTrxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    openingBalance = priorIncome - priorExpense;
  }

  const totalIncome = trxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = trxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netAmount = totalIncome - totalExpense;
  const closingBalance = openingBalance + netAmount;

  res.json({
    reportType: reportType || 'general_ledger',
    fromDate: fromDate || null,
    toDate: toDate || null,
    openingBalance,
    totalIncome,
    totalExpense,
    netAmount,
    closingBalance,
    recordsCount: trxs.length,
    transactions: trxs,
  });
});
