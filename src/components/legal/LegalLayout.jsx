import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    ShieldCheck, 
    ArrowLeft, 
    ArrowUp, 
    FileText, 
    Lock, 
    RefreshCcw, 
    Cookie, 
    Phone, 
    Mail, 
    Globe, 
    MapPin, 
    CheckCircle2, 
    ChevronRight,
    SlidersHorizontal
} from 'lucide-react';
import { useCookieConsent } from '../../context/CookieConsentContext';

const RELATED_POLICIES = [
    { slug: "terms-and-conditions", label: "Terms & Conditions", icon: FileText },
    { slug: "privacy-policy", label: "Privacy Policy", icon: Lock },
    { slug: "cancellation-refund-policy", label: "Cancellation & Refund Policy", icon: RefreshCcw },
    { slug: "cookie-policy", label: "Cookie Policy", icon: Cookie }
];

const LegalLayout = ({
    title,
    policyType = "Policy",
    lastUpdated = "1 November 2026",
    summary,
    sections = [],
    activeSlug,
    children
}) => {
    const [activeSectionId, setActiveSectionId] = useState(sections[0]?.id || "");
    const [showBackToTop, setShowBackToTop] = useState(false);
    const { openPreferences } = useCookieConsent();

    // Scroll listener for back-to-top and active section
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }

            // Find current active section
            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i].id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 180) {
                        setActiveSectionId(sections[i].id);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [sections]);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -90; // Header offset
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
            setActiveSectionId(id);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Back to Home & Breadcrumb */}
                <div className="flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>

                    {/* Quick Cookie Settings Shortcut */}
                    <button
                        type="button"
                        onClick={openPreferences}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Cookie Settings</span>
                    </button>
                </div>

                {/* Hero Policy Banner */}
                <header className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{policyType} &bull; DriveRent</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                        {title}
                    </h1>

                    <p className="mt-2 text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-500">
                        Last Updated: {lastUpdated}
                    </p>

                    {summary && (
                        <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {summary}
                        </div>
                    )}
                </header>

                {/* Main 2-Column Content: Sticky Table of Contents on Left + Detailed Content on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Sticky Table of Contents (Desktop) */}
                    <aside className="lg:col-span-4 sticky top-24 hidden lg:block space-y-4">
                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 max-h-[75vh] overflow-y-auto scrollbarCustom">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                                Table of Contents
                            </h2>
                            <nav className="space-y-1">
                                {sections.map((section) => {
                                    const isActive = activeSectionId === section.id;
                                    return (
                                        <button
                                            key={section.id}
                                            type="button"
                                            onClick={() => scrollToSection(section.id)}
                                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                                                isActive
                                                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border-l-2 border-blue-600'
                                                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                                            }`}
                                        >
                                            <span className="truncate pr-2">{section.title}</span>
                                            {isActive && <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Quick Legal Switcher Widget */}
                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                                Related Legal Policies
                            </h3>
                            {RELATED_POLICIES.filter(p => p.slug !== activeSlug).map((policy) => {
                                const Icon = policy.icon;
                                return (
                                    <Link
                                        key={policy.slug}
                                        to={`/${policy.slug}`}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    >
                                        <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                        <span className="truncate">{policy.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </aside>

                    {/* Right Main Policy Content Body */}
                    <main className="lg:col-span-8 space-y-8">
                        
                        {/* Mobile Table of Contents Accordion */}
                        <div className="lg:hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
                            <details className="group">
                                <summary className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white cursor-pointer select-none">
                                    <span>Jump to Section ({sections.length} Sections)</span>
                                    <span className="transition group-open:rotate-180">&#9662;</span>
                                </summary>
                                <nav className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 max-h-60 overflow-y-auto">
                                    {sections.map((section) => (
                                        <button
                                            key={section.id}
                                            type="button"
                                            onClick={() => scrollToSection(section.id)}
                                            className="w-full text-left px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600"
                                        >
                                            {section.title}
                                        </button>
                                    ))}
                                </nav>
                            </details>
                        </div>

                        {/* Structured Sections Container */}
                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 space-y-10 divide-y divide-slate-100 dark:divide-slate-800/80">
                            {sections.map((section, index) => (
                                <section
                                    key={section.id}
                                    id={section.id}
                                    className="space-y-3 pt-8 first:pt-0 scroll-mt-28"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-black text-xs flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/60">
                                            {index + 1}
                                        </span>
                                        <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                                            {section.title}
                                        </h2>
                                    </div>
                                    <div className="text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line pl-1 sm:pl-11">
                                        {section.content}
                                    </div>
                                </section>
                            ))}
                        </div>

                        {children && (
                            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10">
                                {children}
                            </div>
                        )}

                        {/* Grievance & Compliance Card (Section 21/25 under DPDP Act & IT Act) */}
                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-4">
                            <div className="flex items-center gap-2.5">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                                <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                                    Legal Grievance &amp; Compliance Office
                                </h3>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                In accordance with the Digital Personal Data Protection Act, 2023, Information Technology Act, 2000, and Consumer Protection Act, 2019, you may contact our designated Legal &amp; Grievance Redressal desk:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Legal Inquiries</span>
                                        <a href="mailto:legal@driverent.in" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                            legal@driverent.in
                                        </a>
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3">
                                    <Phone className="w-4 h-4 text-blue-600 shrink-0" />
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Helpdesk Helpline</span>
                                        <a href="tel:+919876543210" className="text-xs font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600">
                                            +91 98765 43210
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Related Policies Grid (Mobile & Desktop) */}
                        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                Explore Other Policies
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {RELATED_POLICIES.filter(p => p.slug !== activeSlug).map((policy) => {
                                    const Icon = policy.icon;
                                    return (
                                        <Link
                                            key={policy.slug}
                                            to={`/${policy.slug}`}
                                            className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3 hover:border-blue-500 transition group"
                                        >
                                            <Icon className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                                                {policy.label}
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                    </main>

                </div>

            </div>

            {/* Back to Top Floating Button */}
            {showBackToTop && (
                <button
                    type="button"
                    onClick={scrollToTop}
                    aria-label="Scroll back to top"
                    className="fixed bottom-24 lg:bottom-8 right-6 z-30 w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition active:scale-90 cursor-pointer animate-in fade-in zoom-in-75 duration-200"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}

        </div>
    );
};

export default LegalLayout;
