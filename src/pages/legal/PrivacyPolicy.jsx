import React, { useEffect, useState } from 'react';
import LegalLayout from '../../components/legal/LegalLayout';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

const DEFAULT_PRIVACY = {
    title: "Privacy Policy – DriveRent",
    slug: "privacy-policy",
    policyType: "privacy",
    version: "1.2.0",
    lastUpdated: "1 November 2026",
    summary: "This Privacy Policy explains how DriveRent collects, processes, stores, and protects personal information in accordance with the Digital Personal Data Protection (DPDP) Act, 2023 and the Information Technology Act, 2000.",
    sections: [
        {
            id: "privacy-intro",
            title: "1. Introduction",
            content: "DriveRent ('we', 'us', 'our') values the trust you place in us when sharing your personal data. This Privacy Policy details our policies regarding the collection, processing, storage, disclosure, and protection of user information collected across our website, mobile interfaces, and digital services."
        },
        {
            id: "info-we-collect",
            title: "2. Information We Collect",
            content: "We collect only information that is strictly necessary to deliver vehicle discovery, facilitate booking reservations with independent rental shops, provide customer support, verify dealer credentials, and comply with statutory obligations under Indian law."
        },
        {
            id: "personal-info",
            title: "3. Personal Information",
            content: "During registration and verification, we may collect your full legal name, primary email address, mobile phone number, residential or business city, and government-issued driving licence number for identity authentication."
        },
        {
            id: "account-info",
            title: "4. Account Information",
            content: "We securely store your account credentials, including encrypted salted bcrypt password hashes, profile avatars, assigned permissions (Customer, Dealer, Agent, Administrator), and session login timestamps."
        },
        {
            id: "booking-info",
            title: "5. Booking Information",
            content: "We record vehicle selections, desired pickup and return dates/times, rental shop assignments, booking reference numbers, and status transitions (Pending, Approved, Rejected, Handed Over, Returned, or Cancelled)."
        },
        {
            id: "dealer-info",
            title: "6. Dealer Information",
            content: "For verified fleet dealers, we collect business establishment names, commercial registration proofs, shop physical addresses, GSTIN numbers, contact person details, and fleet ownership certificates."
        },
        {
            id: "agent-info",
            title: "7. Agent Information",
            content: "Field agents submit employment verification proofs, operational territory allocations, contact phone numbers, and activity logs documenting vehicle inspection checks."
        },
        {
            id: "vehicle-info",
            title: "8. Vehicle Information",
            content: "We maintain public vehicle specifications including vehicle registration numbers (RC), make, model, manufacturing year, fuel type, transmission, seating capacity, price per day, and vehicle photos."
        },
        {
            id: "location-info",
            title: "9. Location Information",
            content: "With your explicit browser permission, we process approximate geolocation coordinates to display nearby rental shops and vehicles on interactive maps. We do not engage in continuous background location tracking."
        },
        {
            id: "how-we-use",
            title: "10. How We Use Information",
            content: "We use collected information to:\n• Authenticate and manage user accounts.\n• Process vehicle booking requests with authorized rental shops.\n• Dispatch real-time in-app and email booking status alerts.\n• Verify dealer and fleet compliance.\n• Provide 24/7 customer support and resolve disputes.\n• Detect and prevent fraudulent inquiries or vehicle theft.\n• Comply with statutory tax and law enforcement mandates."
        },
        {
            id: "how-we-share",
            title: "11. How We Share Information",
            content: "We do not sell, rent, or trade personal data to marketing third parties. We share data only with the specific rental shop where you book, verified field agents handling your vehicle handover, and trusted cloud infrastructure providers bound by strict confidentiality agreements."
        },
        {
            id: "third-parties",
            title: "12. Third-Party Services",
            content: "Our platform integrates with reputable infrastructure providers: MongoDB Atlas (encrypted database storage), Cloudinary (secure vehicle image CDN), Resend (transactional email notifications), and OpenStreetMap / Leaflet (map tiles)."
        },
        {
            id: "data-security",
            title: "13. Data Security",
            content: "We implement multi-layered security measures including TLS 1.3 transport encryption, AES-256 database storage encryption, bcrypt password hashing (10 salt rounds), secure HTTP-only JWT cookies, and strict role-based access control (RBAC)."
        },
        {
            id: "data-storage",
            title: "14. Data Storage & Sovereignty",
            content: "In adherence to Indian data sovereignty requirements, user data is securely stored in cloud data centres located within the territory of India with daily automated encrypted backups."
        },
        {
            id: "data-retention",
            title: "15. Data Retention",
            content: "Active user profile data is retained for the lifetime of your account. Booking history, invoices, and audit logs are archived for 7 years to satisfy statutory tax, accounting, and motor vehicle regulation requirements."
        },
        {
            id: "user-rights",
            title: "16. User Rights (DPDP Act, 2023)",
            content: "Under the Digital Personal Data Protection Act, 2023, you have the right to:\n• Access a summary of personal data processed by us.\n• Request correction of incomplete or outdated data.\n• Request deletion of personal data where legal retention permits.\n• Nominate an authorized representative in the event of death or incapacity.\n• File grievances with our designated Grievance Officer."
        },
        {
            id: "account-deletion",
            title: "17. Account Deletion",
            content: "You may request account deletion at any time via your Account Privacy dashboard or by emailing privacy@driverent.in. Upon identity verification, active profile credentials are permanently deleted or anonymized within 30 days, subject to legal and accounting retention rules."
        },
        {
            id: "data-correction",
            title: "18. Data Correction Requests",
            content: "You can update your personal contact information directly through the Account Profile page. For amendments to verified commercial or driving documents, submit updated documentation to support@driverent.in."
        },
        {
            id: "children-privacy",
            title: "19. Children's Privacy",
            content: "DriveRent is intended solely for adults aged 18 years and older who hold a valid driver's licence. We do not knowingly collect personal data from minors. Any account identified as belonging to a minor will be terminated immediately."
        },
        {
            id: "policy-changes",
            title: "20. Policy Changes",
            content: "We review and update this Privacy Policy periodically. Significant changes will be announced via website notice banners or direct email communications. The 'Last Updated' date at the top reflects the latest revision."
        },
        {
            id: "grievance-officer",
            title: "21. Contact Information & Grievance Officer",
            content: "In compliance with Section 5(9) of the Digital Personal Data Protection Act, 2023 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, our Grievance Officer details are:\n\nName: Rajesh K. Nair\nDesignation: Data Protection & Grievance Officer\nCompany: DriveRent Technologies Private Limited\nEmail: grievance@driverent.in\nPhone: +91 98765 43210\nAddress: Tech Hub, Outer Ring Road, Bangalore 560103, Karnataka, India."
        }
    ]
};

const PrivacyPolicy = () => {
    const [policy, setPolicy] = useState(DEFAULT_PRIVACY);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const res = await Axios({ ...SummaryApi.legal.getPolicy("privacy-policy") });
                if (res.data?.success && res.data.data) {
                    setPolicy(prev => ({
                        ...prev,
                        ...res.data.data,
                        sections: res.data.data.sections?.length ? res.data.data.sections : prev.sections
                    }));
                }
            } catch {
                // local fallback maintained
            }
        };

        fetchPolicy();
    }, []);

    return (
        <LegalLayout
            title={policy.title}
            policyType="Privacy"
            lastUpdated={policy.lastUpdated ? new Date(policy.lastUpdated).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' }) : "1 November 2026"}
            summary={policy.summary}
            sections={policy.sections}
            activeSlug="privacy-policy"
        />
    );
};

export default PrivacyPolicy;

