export const company = {
  name: "Manpower Global Agency",
  legalName: "Manpower Global Agency SRL",
  tagline: "Trust & Quality",
  regNumber: "J40/1234/2009",
  address: {
    street: "Bd. General Gheorghe Magheru, Etaj-05, Sector-01",
    city: "Bucharest",
    country: "Romania",
    postcode: "010321",
  },
  phones: ["+358-413114204", "+40 734 304 768"],
  whatsapp: "+40734304768",
  email: "info.fiaeurope@gmail.com",
  facebook: "https://facebook.com/manpowerglobalagencysrl",
  linkedin: "https://www.linkedin.com/company/manpower-global-agency-srl/",
  hours: [
    { days: "Monday – Friday", time: "9:00 AM – 6:00 PM" },
    { days: "Saturday", time: "10:00 AM – 2:00 PM" },
  ],
  stats: {
    clients: "50,000+",
    successRate: "98%",
    years: "15+",
    countries: "30+",
  },
};

export type Service = {
  slug: string;
  title: string;
  icon: string;
  shortDescription: string;
  description: string;
  features: string[];
  featured: boolean;
};

export const services: Service[] = [
  {
    slug: "work-permit-visa",
    title: "Work Permit Visa",
    icon: "briefcase",
    shortDescription: "Comprehensive assistance for employment-based immigration to Romania and EU countries.",
    description:
      "We handle the entire employment immigration process from job matching to visa approval — including employer sponsorship, contract verification and work permit filing with the Romanian General Inspectorate for Immigration.",
    features: ["Employment sponsorship", "Contract verification", "Work permit processing", "Employer liaison"],
    featured: true,
  },
  {
    slug: "student-visa",
    title: "Student Visa",
    icon: "graduation-cap",
    shortDescription: "Expert guidance for international students seeking education opportunities in Europe.",
    description:
      "From choosing a programme to landing on campus: university admission support, document legalisation, proof-of-funds preparation, student visa filing and post-study work guidance.",
    features: ["University admission support", "Student visa processing", "Accommodation assistance", "Post-study work guidance"],
    featured: true,
  },
  {
    slug: "business-visa",
    title: "Business Visa",
    icon: "building-2",
    shortDescription: "Streamlined processing for entrepreneurs and business professionals.",
    description:
      "Business plan review, company registration, intra-company transfers and self-employment visas across EU jurisdictions, handled by consultants who know each registry.",
    features: ["Business plan review", "Company registration", "Intra-company transfers", "Self-employment visas"],
    featured: true,
  },
  {
    slug: "investor-visa",
    title: "Investor / Property Visa",
    icon: "landmark",
    shortDescription: "Golden visa programmes and investment-based residency solutions.",
    description:
      "Investment advisory, property acquisition support and residency-by-investment filings for high-net-worth individuals and property investors.",
    features: ["Investment advisory", "Property acquisition", "Golden visa processing", "Residency by investment"],
    featured: true,
  },
  {
    slug: "family-reunification",
    title: "Family Reunification",
    icon: "users",
    shortDescription: "Reunite with your loved ones through our family visa services.",
    description:
      "Spouse and partner visas, child sponsorship, parent visas and extended family applications — prepared to withstand the documentary scrutiny these files attract.",
    features: ["Spouse/partner visas", "Child sponsorship", "Parent visas", "Extended family"],
    featured: true,
  },
  {
    slug: "trc-extension",
    title: "TRC Extension",
    icon: "file-text",
    shortDescription: "Temporary Residence Card renewal and extension services.",
    description:
      "Deadline tracking, document preparation, status verification and compliance review so your Temporary Residence Card never lapses.",
    features: ["Document preparation", "Deadline tracking", "Status verification", "Compliance review"],
    featured: true,
  },
  {
    slug: "permanent-residency",
    title: "PR & Citizenship",
    icon: "home",
    shortDescription: "Long-term settlement and citizenship pathway assistance.",
    description:
      "Permanent residency eligibility assessment, naturalisation guidance, application support and dual citizenship advice.",
    features: ["PR eligibility assessment", "Application support", "Naturalisation guidance", "Dual citizenship advice"],
    featured: true,
  },
  {
    slug: "non-eu-services",
    title: "Non-EU Services",
    icon: "globe",
    shortDescription: "Global immigration solutions beyond European borders.",
    description:
      "Gulf, North America and Asia-Pacific placements — including UAE employment visas, Canadian work permits and document attestation for non-EU destinations.",
    features: ["Gulf employment visas", "Canada work permits", "Document attestation", "Pre-departure orientation"],
    featured: false,
  },
];

export type Country = {
  slug: string;
  name: string;
  iso2: string;
  flag: string;
  region: string;
  isEu: boolean;
  summary: string;
  processingTime: string;
  salaryRange: string;
  visaTypes: { name: string; category: string; processingTime: string; note: string }[];
  requirements: string[];
};

export const countries: Country[] = [
  {
    slug: "romania",
    name: "Romania",
    iso2: "RO",
    flag: "🇷🇴",
    region: "Eastern Europe",
    isEu: true,
    summary:
      "Our home market. Romania combines a fast-growing economy, one of the EU's most accessible work-permit regimes and a clear five-year path to permanent residency.",
    processingTime: "45–90 days",
    salaryRange: "€10,000 – €60,000 / year",
    visaTypes: [
      { name: "Long-stay work visa (D/AM)", category: "Work", processingTime: "45–60 days", note: "Requires an approved work permit from IGI." },
      { name: "Study visa (D/SD)", category: "Study", processingTime: "30–45 days", note: "Letter of acceptance from an accredited university." },
      { name: "Family reunification (D/VF)", category: "Family", processingTime: "60–90 days", note: "Sponsor must hold a valid residence permit." },
      { name: "Golden visa / investor", category: "Investment", processingTime: "90 days", note: "Qualifying investment in Romanian assets." },
    ],
    requirements: [
      "Passport valid for at least 6 months beyond intended stay",
      "Approved work permit (aviz de angajare) issued by IGI",
      "Criminal record certificate, apostilled",
      "Medical insurance covering the full stay",
      "Proof of accommodation in Romania",
    ],
  },
  {
    slug: "poland",
    name: "Poland",
    iso2: "PL",
    flag: "🇵🇱",
    region: "Central Europe",
    isEu: true,
    summary:
      "High demand across manufacturing, logistics and construction, with a well-trodden work-permit route for non-EU nationals.",
    processingTime: "60–120 days",
    salaryRange: "€12,000 – €45,000 / year",
    visaTypes: [
      { name: "Type D national work visa", category: "Work", processingTime: "60–90 days", note: "Based on a voivode work permit." },
      { name: "Seasonal work permit", category: "Work", processingTime: "30–45 days", note: "Agriculture and hospitality." },
      { name: "Study visa", category: "Study", processingTime: "45 days", note: "Accredited Polish institution required." },
    ],
    requirements: [
      "Voivode-issued work permit or employer declaration",
      "Signed employment contract",
      "Proof of qualifications, translated",
      "Health insurance and proof of funds",
    ],
  },
  {
    slug: "croatia",
    name: "Croatia",
    iso2: "HR",
    flag: "🇭🇷",
    region: "Southern Europe",
    isEu: true,
    summary: "Schengen member since 2023 with strong seasonal and year-round demand in tourism, hospitality and shipbuilding.",
    processingTime: "45–90 days",
    salaryRange: "€12,000 – €38,000 / year",
    visaTypes: [
      { name: "Stay and work permit", category: "Work", processingTime: "45–75 days", note: "Single permit combining residence and work." },
      { name: "Seasonal permit", category: "Work", processingTime: "30 days", note: "Up to 6 months in tourism." },
    ],
    requirements: ["Employer-signed contract", "Proof of qualification", "Clean criminal record", "Valid passport and biometrics"],
  },
  {
    slug: "hungary",
    name: "Hungary",
    iso2: "HU",
    flag: "🇭🇺",
    region: "Central Europe",
    isEu: true,
    summary: "Automotive and electronics manufacturing hubs with consistent demand for skilled and semi-skilled workers.",
    processingTime: "60–90 days",
    salaryRange: "€11,000 – €40,000 / year",
    visaTypes: [
      { name: "Guest worker residence permit", category: "Work", processingTime: "60–90 days", note: "Employer-sponsored." },
      { name: "EU Blue Card", category: "Work", processingTime: "70 days", note: "For higher-qualified employment." },
    ],
    requirements: ["Employment contract", "Recognised diploma", "Accommodation confirmation", "Health insurance"],
  },
  {
    slug: "portugal",
    name: "Portugal",
    iso2: "PT",
    flag: "🇵🇹",
    region: "Western Europe",
    isEu: true,
    summary: "One of Europe's most welcoming residency regimes, with strong routes for job seekers, remote workers and investors.",
    processingTime: "60–120 days",
    salaryRange: "€14,000 – €55,000 / year",
    visaTypes: [
      { name: "Job seeker visa", category: "Work", processingTime: "60 days", note: "120 days in-country to find employment." },
      { name: "D7 passive income visa", category: "Residency", processingTime: "90 days", note: "Proof of stable income required." },
      { name: "D8 digital nomad visa", category: "Residency", processingTime: "60–90 days", note: "Remote employment or freelance income." },
    ],
    requirements: ["NIF (Portuguese tax number)", "Proof of accommodation", "Proof of means of subsistence", "Criminal record certificate"],
  },
  {
    slug: "malta",
    name: "Malta",
    iso2: "MT",
    flag: "🇲🇹",
    region: "Southern Europe",
    isEu: true,
    summary: "English-speaking EU member with continuous demand in gaming, finance, hospitality and healthcare.",
    processingTime: "45–90 days",
    salaryRange: "€15,000 – €55,000 / year",
    visaTypes: [
      { name: "Single permit", category: "Work", processingTime: "60–90 days", note: "Combined work and residence authorisation." },
      { name: "Key employee initiative", category: "Work", processingTime: "5–15 days", note: "Fast track for senior roles." },
    ],
    requirements: ["Jobsplus vacancy clearance", "Signed contract", "Proof of accommodation", "Police conduct certificate"],
  },
  {
    slug: "lithuania",
    name: "Lithuania",
    iso2: "LT",
    flag: "🇱🇹",
    region: "Baltics",
    isEu: true,
    summary: "Fast-growing logistics and transport sector with a shortage-occupation list that speeds up processing.",
    processingTime: "30–90 days",
    salaryRange: "€12,000 – €42,000 / year",
    visaTypes: [
      { name: "National D visa", category: "Work", processingTime: "30–45 days", note: "Simplified for shortage occupations." },
      { name: "Temporary residence permit", category: "Residency", processingTime: "60–90 days", note: "Renewable annually." },
    ],
    requirements: ["Employment mediation certificate", "Recognised qualification", "Valid passport", "Health insurance"],
  },
  {
    slug: "slovakia",
    name: "Slovakia",
    iso2: "SK",
    flag: "🇸🇰",
    region: "Central Europe",
    isEu: true,
    summary: "Automotive manufacturing centre of Europe, with steady demand for production operators and technicians.",
    processingTime: "60–100 days",
    salaryRange: "€12,000 – €40,000 / year",
    visaTypes: [
      { name: "Temporary residence for employment", category: "Work", processingTime: "60–90 days", note: "Labour market test applies." },
      { name: "EU Blue Card", category: "Work", processingTime: "60 days", note: "University degree required." },
    ],
    requirements: ["Job offer confirmation", "Apostilled education documents", "Criminal record certificate", "Accommodation proof"],
  },
  {
    slug: "germany",
    name: "Germany",
    iso2: "DE",
    flag: "🇩🇪",
    region: "Western Europe",
    isEu: true,
    summary: "Europe's largest labour market, now opened further by the Skilled Immigration Act and the Opportunity Card.",
    processingTime: "60–150 days",
    salaryRange: "€30,000 – €85,000 / year",
    visaTypes: [
      { name: "EU Blue Card", category: "Work", processingTime: "60–90 days", note: "Salary threshold and degree required." },
      { name: "Opportunity Card (Chancenkarte)", category: "Work", processingTime: "90 days", note: "Points-based job search visa." },
      { name: "Student visa", category: "Study", processingTime: "45–90 days", note: "Blocked account required." },
    ],
    requirements: ["Recognised qualification (Anabin listing)", "Blocked account or salary proof", "German or English proficiency", "Health insurance"],
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    iso2: "NL",
    flag: "🇳🇱",
    region: "Western Europe",
    isEu: true,
    summary: "Highly skilled migrant scheme with fast decisions for candidates hired by recognised sponsors.",
    processingTime: "30–90 days",
    salaryRange: "€35,000 – €90,000 / year",
    visaTypes: [
      { name: "Highly Skilled Migrant permit", category: "Work", processingTime: "2–4 weeks", note: "Employer must be an IND recognised sponsor." },
      { name: "Orientation year permit", category: "Work", processingTime: "90 days", note: "For recent graduates." },
    ],
    requirements: ["IND recognised sponsor", "Salary above the applicable threshold", "Valid passport", "Antecedents certificate"],
  },
  {
    slug: "uae",
    name: "United Arab Emirates",
    iso2: "AE",
    flag: "🇦🇪",
    region: "Middle East",
    isEu: false,
    summary: "Tax-free income and rapid processing across construction, hospitality, healthcare and logistics.",
    processingTime: "15–45 days",
    salaryRange: "€9,000 – €70,000 / year",
    visaTypes: [
      { name: "Employment visa", category: "Work", processingTime: "15–30 days", note: "Sponsored by the UAE employer." },
      { name: "Golden visa", category: "Investment", processingTime: "30–45 days", note: "10-year renewable residency." },
    ],
    requirements: ["Attested education certificates", "Medical fitness test", "Emirates ID registration", "Employer sponsorship"],
  },
  {
    slug: "canada",
    name: "Canada",
    iso2: "CA",
    flag: "🇨🇦",
    region: "North America",
    isEu: false,
    summary: "Express Entry and provincial nominee programmes offering a direct route to permanent residency.",
    processingTime: "6–12 months",
    salaryRange: "€28,000 – €80,000 / year",
    visaTypes: [
      { name: "Express Entry (FSW)", category: "Residency", processingTime: "6–8 months", note: "Points-based, CRS score dependent." },
      { name: "LMIA work permit", category: "Work", processingTime: "4–6 months", note: "Employer-specific." },
      { name: "Study permit", category: "Study", processingTime: "8–12 weeks", note: "Designated learning institution required." },
    ],
    requirements: ["IELTS/CELPIP language results", "Educational Credential Assessment", "Proof of funds", "Police clearance certificates"],
  },
];

export type Job = {
  slug: string;
  title: string;
  company: string;
  countrySlug: string;
  location: string;
  category: string;
  employmentType: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  tag: string;
  vacancies: number;
  experienceRequired: number;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  deadline: string;
};

export const jobs: Job[] = [
  {
    slug: "software-engineer-bucharest",
    title: "Software Engineer",
    company: "Tech Solutions SRL",
    countrySlug: "romania",
    location: "Bucharest, Romania",
    category: "IT & Software",
    employmentType: "Full-time",
    salaryMin: 40000,
    salaryMax: 60000,
    currency: "EUR",
    tag: "Work Permit Included",
    vacancies: 4,
    experienceRequired: 3,
    description:
      "Join a Bucharest product team building payment infrastructure for EU merchants. Full relocation and work permit sponsorship provided.",
    responsibilities: [
      "Design and ship backend services in TypeScript and Go",
      "Own features end to end, from design document to production",
      "Take part in on-call rotation and incident review",
    ],
    requirements: [
      "3+ years of professional software engineering experience",
      "Strong knowledge of at least one backend language",
      "English at B2 level or above",
      "Bachelor's degree in Computer Science or equivalent experience",
    ],
    benefits: ["Work permit sponsorship", "Relocation allowance", "Private medical insurance", "Hybrid working"],
    deadline: "2026-11-30",
  },
  {
    slug: "healthcare-professional-cluj",
    title: "Healthcare Professional",
    company: "National Hospital",
    countrySlug: "romania",
    location: "Cluj-Napoca, Romania",
    category: "Healthcare",
    employmentType: "Full-time",
    salaryMin: 35000,
    salaryMax: 50000,
    currency: "EUR",
    tag: "Work Permit Included",
    vacancies: 12,
    experienceRequired: 2,
    description:
      "Registered nurses and allied health professionals needed across surgical and intensive care wards. Qualification recognition support included.",
    responsibilities: [
      "Deliver direct patient care within your registered scope",
      "Maintain accurate clinical documentation",
      "Work within a multidisciplinary ward team",
    ],
    requirements: [
      "Recognised nursing or allied health qualification",
      "2+ years of post-registration experience",
      "Willingness to complete Romanian language training",
    ],
    benefits: ["Qualification recognition support", "Language training", "Accommodation assistance", "Work permit sponsorship"],
    deadline: "2026-12-15",
  },
  {
    slug: "marketing-manager-berlin",
    title: "Marketing Manager",
    company: "Global Brands EU",
    countrySlug: "germany",
    location: "Berlin, Germany",
    category: "Marketing",
    employmentType: "Full-time",
    salaryMin: 55000,
    salaryMax: 75000,
    currency: "EUR",
    tag: "Blue Card Eligible",
    vacancies: 1,
    experienceRequired: 5,
    description:
      "Lead EU campaign strategy for a consumer brand portfolio. Salary comfortably above the EU Blue Card threshold.",
    responsibilities: [
      "Own the annual EU marketing plan and budget",
      "Manage a team of four and external agencies",
      "Report performance to the executive team quarterly",
    ],
    requirements: [
      "5+ years in brand or performance marketing",
      "University degree recognised in Germany (Anabin)",
      "Fluent English; German is an advantage",
    ],
    benefits: ["EU Blue Card sponsorship", "Relocation package", "30 days annual leave", "Company pension"],
    deadline: "2026-10-31",
  },
  {
    slug: "financial-analyst-amsterdam",
    title: "Financial Analyst",
    company: "Finance Corp",
    countrySlug: "netherlands",
    location: "Amsterdam, Netherlands",
    category: "Finance",
    employmentType: "Full-time",
    salaryMin: 50000,
    salaryMax: 70000,
    currency: "EUR",
    tag: "HSM Visa Eligible",
    vacancies: 2,
    experienceRequired: 3,
    description:
      "Financial planning and analysis role with an IND recognised sponsor — highly skilled migrant permits typically decided within four weeks.",
    responsibilities: [
      "Build and maintain rolling forecast models",
      "Partner with commercial teams on business cases",
      "Prepare monthly management reporting packs",
    ],
    requirements: ["3+ years in FP&A or audit", "Advanced Excel and SQL", "Fluent English"],
    benefits: ["Highly skilled migrant sponsorship", "30% ruling application support", "Hybrid working", "Travel allowance"],
    deadline: "2026-11-15",
  },
  {
    slug: "warehouse-operative-poland",
    title: "Warehouse Operative",
    company: "Logistics Partners Sp. z o.o.",
    countrySlug: "poland",
    location: "Wrocław, Poland",
    category: "Logistics",
    employmentType: "Full-time",
    salaryMin: 14000,
    salaryMax: 19000,
    currency: "EUR",
    tag: "Accommodation Provided",
    vacancies: 40,
    experienceRequired: 0,
    description:
      "Large-scale intake for distribution centre operations. No prior experience required — training, accommodation and transport provided.",
    responsibilities: ["Order picking and packing", "Operating handheld scanners", "Maintaining safety standards on the floor"],
    requirements: ["Physically fit and able to work shifts", "Basic English or Polish", "Clean criminal record"],
    benefits: ["Accommodation provided", "Transport to site", "Overtime available", "Work permit sponsorship"],
    deadline: "2026-12-31",
  },
  {
    slug: "hospitality-staff-malta",
    title: "Hospitality Team Member",
    company: "Mediterranean Hotels Group",
    countrySlug: "malta",
    location: "St. Julian's, Malta",
    category: "Hospitality",
    employmentType: "Full-time",
    salaryMin: 16000,
    salaryMax: 24000,
    currency: "EUR",
    tag: "English Speaking",
    vacancies: 25,
    experienceRequired: 1,
    description:
      "Front-of-house and food & beverage roles across a group of four-star properties. English is the working language.",
    responsibilities: ["Guest service at reception, bar or restaurant", "Cash handling and POS operation", "Maintaining brand service standards"],
    requirements: ["1+ year in hospitality", "Conversational English", "Willingness to work shifts and weekends"],
    benefits: ["Single permit sponsorship", "Shared accommodation", "Meals on duty", "Seasonal bonus"],
    deadline: "2026-10-15",
  },
];

export const programmes = [
  { level: "Masters", title: "MSc Computer Science", institution: "Technical University of Munich", country: "Germany", fee: "€1,500/year", intake: "March 2026" },
  { level: "MBA", title: "MBA International Business", institution: "INSEAD Business School", country: "France", fee: "€50,000/year", intake: "April 2026" },
  { level: "Bachelors", title: "BSc Medicine", institution: "University of Bucharest", country: "Romania", fee: "€6,000/year", intake: "February 2026" },
  { level: "PhD", title: "PhD Engineering", institution: "Delft University", country: "Netherlands", fee: "Funded", intake: "Rolling" },
];

export const processSteps = [
  { step: "01", title: "Submit Application", description: "Complete our online form with your details and required documents." },
  { step: "02", title: "Document Review", description: "Our experts verify and prepare your documentation." },
  { step: "03", title: "Embassy Submission", description: "We submit your application to the relevant embassy or VFS." },
  { step: "04", title: "Processing", description: "Track your application status in real time." },
  { step: "05", title: "Approval", description: "Receive your visa and prepare for your journey." },
];

export const whyUs = [
  { icon: "shield", title: "EU Certified Experts", description: "Our team consists of licensed immigration consultants with deep expertise in EU regulations." },
  { icon: "clock", title: "Fast Processing", description: "Expedited visa processing with average turnaround times 40% faster than industry standard." },
  { icon: "award", title: "98% Success Rate", description: "One of the highest approval rates in the industry, backed by 15+ years of experience." },
  { icon: "users", title: "50,000+ Clients", description: "Trusted by individuals, families, and businesses across 30+ countries worldwide." },
  { icon: "headphones", title: "24/7 Support", description: "Round-the-clock assistance throughout your application journey." },
  { icon: "file-check", title: "Complete Transparency", description: "Real-time tracking and regular updates on your application status." },
];

export const testimonials = [
  {
    name: "Maria Popescu",
    role: "IT Professional",
    route: "India → Romania",
    rating: 5,
    quote:
      "Manpower made my work visa process incredibly smooth. Their team handled everything professionally, and I received my visa faster than expected. Highly recommend!",
  },
  {
    name: "Ahmed Hassan",
    role: "University Student",
    route: "Egypt → Germany",
    rating: 5,
    quote:
      "The student visa guidance was exceptional. They helped me secure admission and visa for my dream university. The 24/7 support was invaluable during the process.",
  },
  {
    name: "Li Wei Chen",
    role: "Business Owner",
    route: "China → Romania",
    rating: 5,
    quote:
      "As an investor, I needed reliable partners for my business visa. Manpower exceeded all expectations with their professionalism and expertise in EU immigration.",
  },
  {
    name: "Sarah Thompson",
    role: "Healthcare Worker",
    route: "Philippines → Italy",
    rating: 5,
    quote:
      "The family reunification process was handled with such care and attention. My family is now together in Europe thanks to their dedicated team.",
  },
];

export const departments = [
  {
    eyebrow: "Services Department",
    title: "Travel & Support Services",
    description: "Comprehensive travel and lifestyle support services for our clients.",
    items: [
      { icon: "plane", title: "International & National Tourism", description: "Curated travel packages for leisure and business across domestic and international destinations." },
      { icon: "ticket", title: "Air Ticketing", description: "Comprehensive ticketing for planes, buses, trains, and ships with competitive rates." },
      { icon: "car", title: "Airport Pick & Drop", description: "Professional airport transfer services ensuring comfortable and timely arrivals." },
      { icon: "hotel", title: "Hotel Reservation", description: "Premium hotel bookings worldwide with exclusive partner discounts." },
      { icon: "utensils", title: "Recreation & Entertainment", description: "Curated entertainment and leisure activities for individuals and groups." },
      { icon: "credit-card", title: "Money Transfer", description: "Secure international money transfer services to your home country." },
    ],
  },
  {
    eyebrow: "Logistics Department",
    title: "Corporate & Legal Solutions",
    description: "Professional business and legal support for your European ventures.",
    items: [
      { icon: "file-text", title: "Company Formation", description: "Complete company registration and formation services across EU jurisdictions." },
      { icon: "scale", title: "Legal Aid & Lawyer Services", description: "Access to qualified legal professionals for immigration and business matters." },
      { icon: "trending-up", title: "Employer Transfer & TRC", description: "Seamless employer transfer and TRC extension management." },
      { icon: "package", title: "Industry & Logistics Support", description: "Comprehensive support for industrial and logistics operations." },
      { icon: "shopping-cart", title: "Buyer & Seller Services", description: "B2B marketplace connections and client acquisition services." },
      { icon: "building", title: "Property Buy & Sell", description: "Real estate acquisition and sales support across Romania and EU." },
    ],
  },
];

export const sisterConcerns = [
  { icon: "package", title: "Textile & Garments", description: "Manufacturing excellence" },
  { icon: "utensils", title: "Restaurant & Hospitality", description: "Premium dining experiences" },
  { icon: "shopping-cart", title: "Food & Beverage", description: "Quality food products" },
  { icon: "plane", title: "Export-Import", description: "Global trade solutions" },
  { icon: "car", title: "Delivery & Courier", description: "Logistics services" },
  { icon: "building", title: "Real Estate", description: "Property investments" },
];

export const values = [
  { icon: "shield", title: "Trust & Integrity", description: "We maintain the highest ethical standards in all our dealings." },
  { icon: "users", title: "Client-Centric", description: "Your success is our priority. We go above and beyond to deliver results." },
  { icon: "globe", title: "Global Expertise", description: "Deep knowledge of immigration laws across 30+ countries." },
  { icon: "award", title: "Excellence", description: "We strive for excellence in every application we handle." },
];

export const timeline = [
  { year: "2009", title: "Company Founded", description: "Started operations in Bucharest, Romania" },
  { year: "2012", title: "EU Expansion", description: "Extended services to 10+ EU countries" },
  { year: "2016", title: "10,000 Clients", description: "Milestone of successful visa applications" },
  { year: "2020", title: "Digital Platform", description: "Launched online tracking system" },
  { year: "2023", title: "50,000 Clients", description: "Continued growth and expansion" },
];

export const faqs = [
  {
    question: "How long does a Romanian work permit take?",
    answer:
      "The employer files for a work permit (aviz de angajare) with the General Inspectorate for Immigration, which typically takes 30–45 days. Once approved, the long-stay D/AM visa is decided within a further 20–30 days, so plan for 60–90 days end to end.",
    category: "Work visa",
  },
  {
    question: "Do you guarantee that my visa will be approved?",
    answer:
      "No reputable agency can guarantee a visa — the decision belongs to the consulate or immigration authority. What we guarantee is that your file is complete, correctly translated and legalised, and submitted to the right authority on time. That is what produces our 98% approval rate.",
    category: "General",
  },
  {
    question: "What documents do I need to start?",
    answer:
      "To open a file we need your passport bio page, an up-to-date CV, your highest education certificate and any experience letters. Police clearance and medical certificates are requested later, once the destination and route are confirmed, because they have limited validity.",
    category: "Documents",
  },
  {
    question: "How long does the whole process take?",
    answer:
      "It depends on the destination and the route. Romanian work permits typically run 60–90 days end to end, Netherlands highly skilled migrant permits can be decided in under four weeks, and Canadian permanent residency takes 6–12 months. We give you a realistic timeline for your specific case at the first consultation.",
    category: "Process",
  },
  {
    question: "Can my family join me?",
    answer:
      "Yes. Once you hold a valid residence permit, your spouse and dependent children can apply for family reunification. Most EU states require you to have held your permit for 12 months and to show adequate accommodation and income.",
    category: "Family",
  },
  {
    question: "Do you help with accommodation and travel?",
    answer:
      "Yes. Our services department arranges air ticketing, airport pick-up and initial accommodation, and many of our employer partners include accommodation in the package.",
    category: "Support",
  },
  {
    question: "Is my personal data safe?",
    answer:
      "We are a Romanian company and process your data under the GDPR. Documents are stored in an encrypted, access-controlled store, are visible only to you and the consultant assigned to your file, and are deleted on request once your case closes.",
    category: "Privacy",
  },
  {
    question: "What is a TRC and when must I renew it?",
    answer:
      "A Temporary Residence Card is your in-country residence document. It is usually issued for 12 months and must be renewed at least 30 days before it expires. We track renewal deadlines for every client on our books.",
    category: "Residency",
  },
  {
    question: "Can I switch employers after I arrive?",
    answer:
      "In most EU states you can, but the new employer must file a transfer or a fresh permit before you start work. Leaving a job without arranging this can invalidate your residence permit.",
    category: "Work visa",
  },
  {
    question: "How do I track my application?",
    answer:
      "Every application gets a reference code in the format MGA-YYYY-NNNNNN. Sign in to your dashboard to see the live status timeline, outstanding documents and your next appointment.",
    category: "Tracking",
  },
];

export const posts = [
  {
    slug: "romania-work-permit-quota-2026",
    title: "Romania sets its 2026 work permit quota — what it means for applicants",
    excerpt:
      "The government has approved the annual quota for newly admitted foreign workers. Here is how quotas are consumed through the year and why filing early matters.",
    tags: ["Romania", "Work permit", "Policy"],
    publishedAt: "2026-08-18",
    readingTime: "5 min read",
    body: [
      "Romania sets an annual ceiling on the number of newly admitted non-EU workers. The quota is published at the start of the year and consumed on a first-come, first-served basis as employers file work permit applications with the General Inspectorate for Immigration.",
      "In practice this means the calendar matters as much as the paperwork. Files submitted in the first half of the year face shorter queues; by the fourth quarter, processing slows noticeably as the remaining allocation is drawn down.",
      "If your employer has confirmed a role, the single most useful thing you can do is get your documents legalised early. Criminal record certificates and medical certificates have limited validity, so we sequence them deliberately — education and experience documents first, time-limited documents last.",
    ],
  },
  {
    slug: "eu-blue-card-changes",
    title: "EU Blue Card: lower salary thresholds and easier switching",
    excerpt:
      "The revised Blue Card directive has been transposed across most member states. Shorter contracts now qualify, and moving between EU countries is simpler.",
    tags: ["EU", "Blue Card", "Skilled migration"],
    publishedAt: "2026-07-02",
    readingTime: "6 min read",
    body: [
      "The recast Blue Card directive lowers the minimum contract duration to six months and reduces the salary threshold member states may set, widening eligibility considerably for mid-career professionals.",
      "It also improves intra-EU mobility: after 12 months in the first member state, Blue Card holders can move to a second member state under a simplified procedure rather than starting again.",
      "Recognition of qualifications remains the practical bottleneck. For Germany, check your degree against the Anabin database before you apply; for the Netherlands, confirm your employer is an IND recognised sponsor.",
    ],
  },
  {
    slug: "documents-that-delay-applications",
    title: "The five documents that delay most visa applications",
    excerpt:
      "After 15 years and 50,000 files, the same five documents cause the majority of avoidable delays. Here is how to get each one right the first time.",
    tags: ["Documents", "Practical guide"],
    publishedAt: "2026-06-11",
    readingTime: "7 min read",
    body: [
      "First: the apostille. A criminal record certificate without an apostille or, where applicable, consular legalisation is not accepted anywhere in the EU. The apostille must be issued by the competent authority in the country that issued the document.",
      "Second: sworn translations. Most consulates require translations by a translator authorised in the destination country, not simply a certified translator at home.",
      "Third: proof of accommodation. A tenancy agreement must show the correct address, the landlord's details and a term that covers the period of stay.",
      "Fourth: proof of funds. Bank statements should cover the last six months, be stamped by the bank, and show a stable balance rather than a single large deposit made the week before filing.",
      "Fifth: the passport itself. It must be valid for at least three months beyond your intended departure, have two blank pages, and have been issued within the last ten years.",
    ],
  },
];
