import React, { useEffect, useState } from 'react';
import LegalLayout from '../../components/legal/LegalLayout';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

const DEFAULT_TERMS = {
    title: "Terms & Conditions – DriveRent",
    slug: "terms-and-conditions",
    policyType: "terms",
    version: "1.2.0",
    lastUpdated: "1 November 2026",
    summary: "Welcome to DriveRent. These Terms & Conditions govern your access to and use of the DriveRent website and car & bike rental booking services. By registering, accessing, or using our platform, you agree to comply with these terms.",
    sections: [
        {
            id: "intro",
            title: "1. Introduction",
            content: "Welcome to DriveRent. These Terms & Conditions govern your access to and use of the DriveRent website and services. By registering, accessing, or using our platform, you agree to comply with these Terms & Conditions. Please read them carefully before using our services."
        },
        {
            id: "about",
            title: "2. About DriveRent",
            content: "DriveRent is an online car and bike rental marketplace that connects customers with independent car rental shops and vehicle owners.\n\nOur platform allows customers to:\n• Explore available rental vehicles.\n• Compare rental prices and vehicle specifications.\n• Discover registered rental shops.\n• Submit vehicle booking requests.\n• Receive booking confirmations.\n• View rental shop addresses and contact information.\n\nDriveRent acts as a booking and discovery platform. Vehicle rental services are provided by the respective vehicle owners or authorized rental businesses."
        },
        {
            id: "registration",
            title: "3. User Registration",
            content: "Users must provide accurate and complete registration information. Users must be at least 18 years of age (or legal driving age for the vehicle category) to register and book a vehicle. Each account must be used by its registered owner. Users must not create accounts using false identities or misleading information."
        },
        {
            id: "account-responsibilities",
            title: "4. Account Responsibilities",
            content: "Users are responsible for maintaining the confidentiality of their login credentials. DriveRent reserves the right to suspend accounts involved in fraudulent or suspicious activities. Users must notify us immediately at support@driverent.in if they suspect unauthorized access to their accounts."
        },
        {
            id: "customer-responsibilities",
            title: "5. Customer Responsibilities",
            content: "Customers using DriveRent agree to:\n• Provide accurate personal and contact information.\n• Select valid pickup and return dates.\n• Review vehicle specifications and rental policies before booking.\n• Provide valid identification and driving licence documents when required.\n• Follow the rental shop's applicable rules and rental agreement.\n• Collect and return vehicles at the selected rental shop.\n• Pay the applicable rental charges and security deposit.\n• Return vehicles in accordance with the agreed rental conditions."
        },
        {
            id: "booking-policy",
            title: "6. Booking Policy",
            content: "Submitting a booking request reserves an inquiry on the platform. Submitting a booking request does not guarantee vehicle availability. All booking requests are subject to approval by the authorized vehicle owner or Dealer. A booking becomes confirmed only after the authorized party approves it."
        },
        {
            id: "booking-confirmation",
            title: "7. Booking Confirmation",
            content: "Customers will receive booking confirmation through available notification channels (in-app notifications and email). Customers must verify their booking details before visiting the rental shop. DriveRent is not responsible for bookings rejected due to vehicle unavailability or inaccurate listing information."
        },
        {
            id: "pickup-policy",
            title: "8. Vehicle Pickup Policy",
            content: "Physical shop pickup is mandatory.\n• Customers must visit the selected rental shop to collect their booked vehicle.\n• Home delivery and driver pickup are not included.\n• Customers must present their booking confirmation and required documents.\n• The Dealer will verify customer identity and driving licence information.\n• Vehicle condition, fuel level, and odometer readings may be recorded before handover."
        },
        {
            id: "return-policy",
            title: "9. Vehicle Return Policy",
            content: "Physical shop return is mandatory.\n• Customers must return the vehicle to the same rental shop unless another arrangement is agreed upon with the Dealer.\n• Vehicle condition will be inspected during return in the customer's presence.\n• Additional charges may apply for damage, late returns, excess usage, or other agreed rental conditions."
        },
        {
            id: "pricing",
            title: "10. Rental Pricing",
            content: "Rental prices are displayed transparently by individual rental shops or vehicle owners. Prices may vary depending on vehicle type, rental duration, and shop policies. Security deposits and additional charges must be disclosed before booking confirmation."
        },
        {
            id: "payment-conditions",
            title: "11. Payment Conditions",
            content: "Payments are initially handled directly at the rental shop upon vehicle handover. Supported payment methods may include Cash, UPI, or other methods accepted by the Dealer. DriveRent does not automatically collect rental payments through the platform. Customers should obtain payment confirmation or a receipt from the rental shop."
        },
        {
            id: "cancellation-rules",
            title: "12. Cancellation Rules",
            content: "Customers may request booking cancellation through their dashboard, subject to booking status. Cancellation requests for confirmed bookings may be subject to the rental shop's cancellation policy. Dealers may reject booking requests if vehicles become unavailable or other valid circumstances arise."
        },
        {
            id: "dealer-responsibilities",
            title: "13. Dealer Responsibilities",
            content: "Dealers using DriveRent must:\n• Provide accurate business information.\n• Upload genuine vehicle photographs.\n• Provide correct vehicle specifications.\n• Display accurate rental prices and policies.\n• Maintain valid vehicle and business documentation.\n• Keep vehicle availability updated.\n• Respond to booking requests promptly.\n• Verify customer documents before vehicle handover.\n• Record vehicle pickup and return details.\n• Maintain vehicles in safe and legally compliant condition.\n• Respect customer privacy."
        },
        {
            id: "agent-responsibilities",
            title: "14. Agent Responsibilities",
            content: "Agents must:\n• Operate only within their assigned permissions.\n• Provide accurate information to customers and Dealers.\n• Protect confidential business and customer information.\n• Follow platform policies.\n• Avoid unauthorized booking approvals or business changes.\n\nAgents cannot independently modify vehicle ownership or access unauthorized business records."
        },
        {
            id: "admin-rights",
            title: "15. Admin Rights",
            content: "DriveRent administrators reserve the right to:\n• Review Dealer and Agent applications.\n• Verify submitted business documents.\n• Approve or reject rental shop listings.\n• Approve or reject vehicle listings.\n• Suspend accounts violating platform policies.\n• Remove misleading or fraudulent listings.\n• Investigate reported suspicious activities.\n• Restrict access when necessary to protect platform security."
        },
        {
            id: "damage-liability",
            title: "16. Vehicle Damage and Liability",
            content: "Customers must inspect vehicles before accepting handover. Existing damage should be recorded before pickup. Any new damage must be reported immediately. Responsibility for damage, theft, accidents, and insurance claims will be determined according to applicable law and the rental agreement. DriveRent is not the vehicle owner and does not directly operate the rental vehicles."
        },
        {
            id: "insurance-documentation",
            title: "17. Insurance and Documentation",
            content: "Dealers must maintain appropriate vehicle documentation and legally required third-party insurance. Customers must carry valid original driver's licences and comply with vehicle operation guidelines as required by the Indian Motor Vehicles Act."
        },
        {
            id: "reviews-feedback",
            title: "18. Reviews and Feedback",
            content: "Customers may submit genuine reviews about their rental experience. Reviews must not contain abusive, fraudulent, defamatory, or misleading content. DriveRent reserves the right to remove content that violates platform policies. Users must not manipulate ratings or post fake reviews."
        },
        {
            id: "privacy-protection",
            title: "19. Privacy and Data Protection",
            content: "DriveRent collects and processes personal information in accordance with the Digital Personal Data Protection Act, 2023. We do not request unnecessary personal information. Sensitive documents are handled securely and accessed only by authorized personnel. Please refer to our Privacy Policy for full details."
        },
        {
            id: "prohibited-activities",
            title: "20. Prohibited Activities",
            content: "Users must not:\n• Create fake accounts or submit fraudulent documents.\n• Publish misleading vehicle listings.\n• Attempt unauthorized access to the platform.\n• Use rented vehicles for illegal racing, towing, or illicit transportation.\n• Operate vehicles while under the influence of alcohol or prohibited substances."
        },
        {
            id: "account-suspension",
            title: "21. Account Suspension",
            content: "DriveRent reserves the right to suspend or permanently terminate accounts involved in vehicle misuse, non-payment, documentation fraud, or harassment of staff or other community members."
        },
        {
            id: "platform-availability",
            title: "22. Platform Availability",
            content: "DriveRent aims to maintain reliable platform availability. Temporary interruptions may occur due to maintenance, technical issues, or external service failures. We reserve the right to update or modify platform features. We do not guarantee uninterrupted access to the platform."
        },
        {
            id: "limitation-liability",
            title: "23. Limitation of Liability",
            content: "DriveRent acts as an intermediary marketplace connecting customers with independent rental businesses. To the extent permitted by applicable law:\n• DriveRent is not the direct owner or operator of listed vehicles.\n• DriveRent does not guarantee the conduct or performance of independent rental shops.\n• DriveRent is not responsible for disputes arising directly from rental agreements between customers and Dealers.\n• Nothing in these Terms excludes liability that cannot legally be excluded."
        },
        {
            id: "governing-law",
            title: "24. Governing Law and Disputes",
            content: "These Terms & Conditions are governed by the applicable laws of India. Any disputes relating to the platform will be handled in accordance with applicable Indian laws and the jurisdiction of the competent courts in Bangalore, Karnataka."
        },
        {
            id: "contact",
            title: "25. Contact Information",
            content: "For questions, complaints, or assistance regarding these Terms & Conditions, contact us:\nPlatform: DriveRent Technologies\nWebsite: www.driverent.in\nEmail: legal@driverent.in\nPhone: +91 98765 43210"
        }
    ]
};

const TermsConditions = () => {
    const [policy, setPolicy] = useState(DEFAULT_TERMS);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const res = await Axios({ ...SummaryApi.legal.getPolicy("terms-and-conditions") });
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
            policyType="Terms"
            lastUpdated={policy.lastUpdated ? new Date(policy.lastUpdated).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' }) : "1 November 2026"}
            summary={policy.summary}
            sections={policy.sections}
            activeSlug="terms-and-conditions"
        />
    );
};

export default TermsConditions;

