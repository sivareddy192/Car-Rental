import React, { useEffect, useState } from 'react';
import LegalLayout from '../../components/legal/LegalLayout';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

const DEFAULT_CANCELLATION = {
    title: "Cancellation & Refund Policy – DriveRent",
    slug: "cancellation-refund-policy",
    policyType: "cancellation",
    version: "1.2.0",
    lastUpdated: "1 November 2026",
    summary: "This Cancellation & Refund Policy outlines the terms governing booking cancellations, advance payments, vehicle unavailability, and refundable security deposits on the DriveRent multi-vendor marketplace.",
    sections: [
        {
            id: "cancellation-intro",
            title: "1. Introduction",
            content: "This Cancellation & Refund Policy explains how booking cancellations, refunds, and security deposits are handled on DriveRent. Because DriveRent operates as a discovery and booking marketplace connecting customers with independent vehicle owners and rental shops, payments and refunds are settled directly with the respective rental shop in accordance with these principles."
        },
        {
            id: "booking-request-cancel",
            title: "2. Booking Request Cancellation",
            content: "Customers may initiate a cancellation request for any active booking by navigating to the 'My Bookings' tab within their Customer Dashboard and clicking 'Cancel Booking'. The cancellation will be logged in the system with an automated notification sent to the assigned Dealer."
        },
        {
            id: "pending-cancel",
            title: "3. Pending Booking Cancellation",
            content: "If your booking request is in 'Pending' status (awaiting review by the rental shop), you may cancel immediately with zero penalty. As no rental payment or deposit has been collected, no monetary refund is necessary."
        },
        {
            id: "confirmed-cancel",
            title: "4. Confirmed Booking Cancellation",
            content: "Once a booking is marked 'Confirmed' by the Dealer, cancellation requests are governed by the specific rental shop's disclosed cancellation schedule. Individual shops disclose their free cancellation window (e.g., 24 hours prior to pickup) on the vehicle listing and booking summary."
        },
        {
            id: "dealer-cancel",
            title: "5. Dealer-Initiated Cancellation",
            content: "If a Dealer must cancel a confirmed reservation due to unforeseen vehicle mechanical problems, safety recalls, or emergency operational constraints, the customer will receive an immediate cancellation alert. The customer is entitled to a 100% full refund of any deposit or advance paid directly to the shop."
        },
        {
            id: "vehicle-unavailability",
            title: "6. Vehicle Unavailability",
            content: "If a booked vehicle is unavailable at the physical rental shop at the scheduled pickup time, the Dealer must either:\n• Provide an equivalent or higher-category vehicle model at no additional cost; OR\n• Issue an immediate full refund of any token or advance payment received."
        },
        {
            id: "advance-payment",
            title: "7. Advance Payment",
            content: "Any advance commitment token or booking token requested by an individual rental shop must be accompanied by an official written receipt or digital acknowledgement. DriveRent does not intermediate physical cash or offline UPI transactions."
        },
        {
            id: "refund-eligibility",
            title: "8. Refund Eligibility",
            content: "Customers are eligible for refunds under the following circumstances:\n• The Dealer cancels a confirmed booking.\n• The vehicle fails a physical roadworthiness inspection upon customer arrival at the shop.\n• The customer cancels within the rental shop's free cancellation timeframe.\n• The shop fails to provide the booked vehicle at the scheduled pickup hour."
        },
        {
            id: "refund-processing",
            title: "9. Refund Processing",
            content: "Because rental payments are transacted directly with individual rental shops (via Cash, UPI, or card terminal), refunds are issued directly by the receiving rental shop. Refunds via UPI or bank transfer typically reflect within 1 to 5 business days."
        },
        {
            id: "security-deposit-refund",
            title: "10. Security Deposit Refund",
            content: "Security deposits collected by the Dealer during vehicle handover are fully refundable. Upon return of the vehicle to the rental shop in an undamaged condition with the agreed fuel level, the Dealer must process the security deposit refund immediately or within 24 hours of return inspection."
        },
        {
            id: "late-return-charges",
            title: "11. Late Return Charges",
            content: "Returning a vehicle past the agreed return window without prior written extension may incur late return charges as disclosed on the shop's rental agreement sheet. Grace periods (typically 30 to 60 minutes) may be granted at the Dealer's sole discretion."
        },
        {
            id: "damage-charges",
            title: "12. Vehicle Damage Charges",
            content: "If vehicle damage, tire punctures, body scratches, or interior stains occur during the rental period, deductions from the security deposit must be supported by an itemized repair estimate from an authorized service centre. Pre-existing damages recorded on the handover sheet are strictly exempt."
        },
        {
            id: "additional-charges",
            title: "13. Additional Rental Charges",
            content: "Toll charges (FASTag deductions), state boundary entry taxes, traffic challans, and fuel deficits are the customer's legal responsibility and are not subject to refund."
        },
        {
            id: "booking-disputes",
            title: "14. Booking Disputes",
            content: "In the event of an unresolved dispute regarding a deposit deduction or cancellation charge, customers and Dealers can request platform mediation by sending booking documentation and receipts to disputes@driverent.in."
        },
        {
            id: "customer-support",
            title: "15. Customer Support",
            content: "For questions, cancellation support, or dispute escalations, our Support Desk is available 24/7:\nEmail: support@driverent.in\nPhone: +91 98765 43210\nWebsite: www.driverent.in/contact-us"
        }
    ]
};

const CancellationRefundPolicy = () => {
    const [policy, setPolicy] = useState(DEFAULT_CANCELLATION);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const res = await Axios({ ...SummaryApi.legal.getPolicy("cancellation-refund-policy") });
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
            policyType="Cancellation"
            lastUpdated={policy.lastUpdated ? new Date(policy.lastUpdated).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' }) : "1 November 2026"}
            summary={policy.summary}
            sections={policy.sections}
            activeSlug="cancellation-refund-policy"
        />
    );
};

export default CancellationRefundPolicy;

