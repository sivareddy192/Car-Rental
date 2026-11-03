import React, { useEffect, useState } from 'react';
import LegalLayout from '../../components/legal/LegalLayout';
import Axios from '../../utils/Axios';
import SummaryApi from '../../common/SummaryApi';

const DEFAULT_COOKIE = {
    title: "Cookie Policy – DriveRent",
    slug: "cookie-policy",
    policyType: "cookie",
    version: "1.2.0",
    lastUpdated: "1 November 2026",
    summary: "This Cookie Policy explains what cookies are, how DriveRent uses essential and optional cookies, and how you can manage your cookie consent preferences at any time.",
    sections: [
        {
            id: "cookie-intro",
            title: "1. Introduction",
            content: "This Cookie Policy explains how DriveRent ('we', 'us', 'our') uses cookies, browser storage tokens, and related technologies on our website and web applications. We respect your privacy choices and provide transparent controls over optional tracking."
        },
        {
            id: "what-are-cookies",
            title: "2. What Are Cookies?",
            content: "Cookies are small text files placed on your device (computer, tablet, or smartphone) when you visit a website. They allow the website to recognize your device, maintain security sessions, and remember preferences."
        },
        {
            id: "why-we-use",
            title: "3. Why We Use Cookies",
            content: "We use cookies primarily to keep you securely signed in, protect our servers from cross-site attacks, remember your preferred theme (Dark/Light mode), and understand platform performance to enhance user experience."
        },
        {
            id: "essential-cookies",
            title: "4. Essential Cookies (Strictly Necessary)",
            content: "Essential cookies are strictly required for the website to function. They enable core functions such as secure authentication, account access, load balancing, CSRF protection, and fraud defense. Because the website cannot function without them, essential cookies cannot be disabled."
        },
        {
            id: "auth-cookies",
            title: "5. Authentication Cookies",
            content: "When you sign in, we issue an encrypted HTTP-only JWT access token cookie ('accessToken') and refresh token. These cookies have Secure and SameSite flags enabled to protect against cross-site scripting (XSS) and unauthorized token sniffing."
        },
        {
            id: "preference-cookies",
            title: "6. Preference Cookies",
            content: "Preference cookies remember choices you make, such as your selected UI theme (White Theme vs. Dark Theme via 'luxe_theme' local storage) and UI display density. These optional cookies remain disabled by default until you grant consent."
        },
        {
            id: "analytics-cookies",
            title: "7. Analytics Cookies",
            content: "Analytics cookies help us measure visitor traffic, identify popular vehicle categories, monitor page load speeds, and spot navigation bottlenecks. These cookies are optional, anonymized, and disabled by default until you choose to accept them."
        },
        {
            id: "functional-cookies",
            title: "8. Functional Cookies",
            content: "Functional cookies support enhanced conveniences, such as saving your vehicle comparison filters, remembering search dates, and preserving local wishlist vehicle bookmarks across browser restarts."
        },
        {
            id: "third-party-cookies",
            title: "9. Third-Party Cookies",
            content: "Certain integrated external services (such as Leaflet/OpenStreetMap map tiles and Cloudinary CDN vehicle photo delivery) may set functional network cache cookies to optimize content delivery."
        },
        {
            id: "cookie-duration",
            title: "10. Cookie Duration",
            content: "Session cookies expire automatically when you close your browser. Persistent cookies remain on your device for a defined expiration period (e.g., 30 days for authentication refresh tokens, or 1 year for consent preferences) unless manually cleared."
        },
        {
            id: "managing-preferences",
            title: "11. Managing Cookie Preferences",
            content: "You can manage or change your cookie choices at any time by clicking the permanent 'Cookie Settings' link in the website footer or inside your Customer Account settings."
        },
        {
            id: "withdrawing-consent",
            title: "12. Withdrawing Consent",
            content: "You have the right to withdraw optional cookie consent at any time. When you click 'Reject Optional' or withdraw consent in Cookie Settings, optional cookies are deactivated and future tracking ceases immediately."
        },
        {
            id: "disabling-browser",
            title: "13. Disabling Cookies via Browser",
            content: "You can also configure your web browser (Chrome, Firefox, Safari, Edge) to block or delete cookies. Note that blocking all cookies may prevent you from signing in or placing booking requests on DriveRent."
        },
        {
            id: "policy-updates",
            title: "14. Policy Updates",
            content: "We may update this Cookie Policy when we introduce new features or when data protection regulations evolve. Material updates will trigger a renewed consent notice on your next visit."
        },
        {
            id: "cookie-contact",
            title: "15. Contact Information",
            content: "If you have questions about our use of cookies or privacy practices, reach our data protection desk at privacy@driverent.in or write to DriveRent Technologies, Outer Ring Road, Bangalore 560103, India."
        }
    ]
};

const CookiePolicy = () => {
    const [policy, setPolicy] = useState(DEFAULT_COOKIE);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const res = await Axios({ ...SummaryApi.legal.getPolicy("cookie-policy") });
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
            policyType="Cookie"
            lastUpdated={policy.lastUpdated ? new Date(policy.lastUpdated).toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' }) : "1 November 2026"}
            summary={policy.summary}
            sections={policy.sections}
            activeSlug="cookie-policy"
        />
    );
};

export default CookiePolicy;

