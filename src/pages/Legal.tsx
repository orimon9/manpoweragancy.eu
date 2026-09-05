import { Seo } from "@/components/Seo";
import { PageHero } from "@/components/layout/PageHero";
import { company } from "@/content/site";

type Kind = "privacy" | "terms" | "cookies";

const content: Record<Kind, { title: string; description: string; sections: { heading: string; body: string[] }[] }> = {
  privacy: {
    title: "Privacy Policy",
    description: "How we collect, use and protect your personal data under the GDPR.",
    sections: [
      {
        heading: "Who we are",
        body: [
          company.legalName +
            ", " +
            company.address.street +
            ", " +
            company.address.city +
            ", " +
            company.address.country +
            ", is the data controller for the personal data described in this policy. You can reach our data protection contact at " +
            company.email +
            ".",
        ],
      },
      {
        heading: "What we collect",
        body: [
          "Identity and contact data: name, date of birth, nationality, passport number and expiry, email, phone and address.",
          "Application data: education and employment history, language certificates, destination preferences and previous visa history.",
          "Documents you upload: passport scans, CVs, diplomas, experience letters, police clearance certificates, medical certificates and photographs.",
          "Technical data: IP address, browser type and pages visited, collected only where you have accepted analytics cookies.",
        ],
      },
      {
        heading: "Why we process it and on what basis",
        body: [
          "To prepare and submit your visa or work permit application — performance of a contract with you.",
          "To meet the documentary requirements of consulates, employers and immigration authorities — legal obligation and legitimate interest.",
          "Passport numbers, medical certificates and criminal record data are handled only on the basis of your explicit consent, which you give before uploading any document and can withdraw at any time.",
        ],
      },
      {
        heading: "Who sees your data",
        body: [
          "Inside our organisation, only the consultant assigned to your file and the staff reviewing your documents. Access is enforced at database level with row-level security, not just in the interface.",
          "Outside our organisation: the relevant embassy, consulate, visa centre (such as VFS) or immigration authority, the sponsoring employer or university where applicable, and our email delivery provider.",
          "We never sell your data and never share it for advertising.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "Application files and their supporting documents are retained for five years after the case closes, which is the period during which immigration authorities may ask us to evidence a submission. After that they are deleted.",
          "You can ask us to delete your documents sooner. Where no legal obligation requires us to keep them, we will.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to access, correct, delete, restrict and port your data, and to object to processing. You can export everything we hold about you from your dashboard, or by emailing us.",
          "You also have the right to lodge a complaint with the Romanian supervisory authority (ANSPDCP) or the authority in your country of residence.",
        ],
      },
      {
        heading: "Security",
        body: [
          "Documents are stored in a private, access-controlled store and served only through short-lived signed links. Transport is encrypted end to end. Access is logged.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    description: "The terms governing our immigration and recruitment services.",
    sections: [
      {
        heading: "Scope of our services",
        body: [
          "We prepare, review and submit immigration applications and connect candidates with employers and educational institutions. We are not a law firm and do not provide legal representation in court proceedings.",
        ],
      },
      {
        heading: "No guarantee of outcome",
        body: [
          "Visa and permit decisions are made solely by the competent embassy, consulate or immigration authority. We do not and cannot guarantee approval. What we undertake is to prepare your file correctly, completely and on time.",
        ],
      },
      {
        heading: "Fees",
        body: [
          "Our service fee is quoted in writing before any work begins and is separate from government, embassy and visa-centre fees, which are charged at cost and evidenced by receipt.",
          "Candidates are never charged a placement fee for accepting a job through us; recruitment fees are paid by the employer.",
          "Service fees cover work performed. Where an application is refused, our fee is not automatically refundable, but we will state clearly in your engagement letter what is and is not refundable at each stage.",
        ],
      },
      {
        heading: "Your responsibilities",
        body: [
          "You must provide accurate, complete and genuine information and documents. Submitting falsified documents is a criminal offence in every jurisdiction we operate in, will end our engagement immediately, and will be reported where the law requires it.",
          "You must tell us promptly about changes to your circumstances, including address, marital status, employment and any refusal by another authority.",
        ],
      },
      {
        heading: "Liability",
        body: [
          "Our liability is limited to the service fees you have paid us. We are not liable for delays caused by authorities, for changes in immigration law, or for consequences arising from information you supplied that was inaccurate or incomplete.",
        ],
      },
      {
        heading: "Governing law",
        body: ["These terms are governed by Romanian law, and disputes fall to the competent courts of Bucharest, Romania."],
      },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    description: "What we store on your device and how to control it.",
    sections: [
      {
        heading: "Strictly necessary cookies",
        body: [
          "These keep you signed in, protect forms against cross-site request forgery, and balance load across our servers. They cannot be switched off, and we do not need your consent for them.",
        ],
      },
      {
        heading: "Analytics cookies",
        body: [
          "These tell us which pages are used and where people get stuck, in aggregate. They are off by default and are only set if you turn them on in the cookie banner.",
        ],
      },
      {
        heading: "Marketing cookies",
        body: [
          "These measure whether a campaign led to an enquiry. They are off by default and only set with your consent.",
        ],
      },
      {
        heading: "Changing your mind",
        body: [
          "You can change or withdraw your choices at any time by clearing this site's data in your browser, which makes the consent banner reappear on your next visit.",
        ],
      },
    ],
  },
};

export default function Legal({ kind }: { kind: Kind }) {
  const page = content[kind];

  return (
    <>
      <Seo title={page.title} description={page.description} path={"/" + kind} />
      <PageHero eyebrow="Legal" title={page.title} description={page.description} />

      <section className="section">
        <div className="container max-w-3xl">
          <p className="text-sm text-muted-foreground">Last updated: 1 September 2026</p>
          {page.sections.map((section) => (
            <div key={section.heading} className="mt-10">
              <h2 className="text-xl">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-3 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
