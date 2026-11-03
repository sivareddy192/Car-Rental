import React, { createContext, useContext, useState, useCallback } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';

const CookieConsentContext = createContext(null);

const STORAGE_KEY = 'driverent_cookie_consent';
const ANON_ID_KEY = 'driverent_anonymous_id';
const CURRENT_CONSENT_VERSION = '1.2.0';

export const CookieConsentProvider = ({ children }) => {
    // Persistent Anonymous Identifier
    const [anonymousId] = useState(() => {
        try {
            if (typeof window === 'undefined') return '';
            let id = localStorage.getItem(ANON_ID_KEY);
            if (!id) {
                id = 'anon_' + (crypto?.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36));
                localStorage.setItem(ANON_ID_KEY, id);
            }
            return id;
        } catch {
            return 'anon_' + Date.now();
        }
    });

    const [consent, setConsent] = useState(() => {
        try {
            if (typeof window === 'undefined') return null;
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                // If version changed, re-evaluate consent
                if (parsed.version === CURRENT_CONSENT_VERSION) {
                    return parsed;
                }
            }
            return null;
        } catch {
            return null;
        }
    });

    const [isBannerOpen, setIsBannerOpen] = useState(() => {
        try {
            if (typeof window === 'undefined') return false;
            const saved = localStorage.getItem(STORAGE_KEY);
            if (!saved) return true;
            const parsed = JSON.parse(saved);
            return parsed.version !== CURRENT_CONSENT_VERSION;
        } catch {
            return true;
        }
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Save and sync with backend
    const syncConsentWithBackend = useCallback(async (consentData) => {
        try {
            await Axios({
                ...SummaryApi.cookieConsent.record,
                data: {
                    consentId: consentData.consentId,
                    anonymousId,
                    essential: true,
                    preferences: consentData.preferences,
                    analytics: consentData.analytics,
                    functional: consentData.functional,
                    action: consentData.action,
                    consentVersion: CURRENT_CONSENT_VERSION
                }
            });
        } catch (err) {
            // Non-blocking fail-safe: local preference still holds
            console.warn("Cookie consent backend sync:", err?.message || err);
        }
    }, [anonymousId]);

    const saveConsentLocally = useCallback((newConsent) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newConsent));
            setConsent(newConsent);
            setIsBannerOpen(false);
            window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: newConsent }));
            syncConsentWithBackend(newConsent);
        } catch (e) {
            console.error("Failed to save cookie consent locally:", e);
        }
    }, [syncConsentWithBackend]);

    // Action 1: Accept All
    const acceptAll = useCallback(() => {
        const consentId = consent?.consentId || ('cid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8));
        const newConsent = {
            consentId,
            essential: true,
            preferences: true,
            analytics: true,
            functional: true,
            action: 'accept_all',
            version: CURRENT_CONSENT_VERSION,
            timestamp: new Date().toISOString()
        };
        saveConsentLocally(newConsent);
        setIsModalOpen(false);
    }, [consent, saveConsentLocally]);

    // Action 2: Reject Optional (only Essential cookies remain active)
    const rejectOptional = useCallback(() => {
        const consentId = consent?.consentId || ('cid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8));
        const newConsent = {
            consentId,
            essential: true,
            preferences: false,
            analytics: false,
            functional: false,
            action: 'reject_optional',
            version: CURRENT_CONSENT_VERSION,
            timestamp: new Date().toISOString()
        };
        saveConsentLocally(newConsent);
        setIsModalOpen(false);
    }, [consent, saveConsentLocally]);

    // Action 3: Save Custom Preferences
    const saveCustomPreferences = useCallback((customCategories) => {
        const consentId = consent?.consentId || ('cid_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8));
        const newConsent = {
            consentId,
            essential: true,
            preferences: Boolean(customCategories.preferences),
            analytics: Boolean(customCategories.analytics),
            functional: Boolean(customCategories.functional),
            action: 'customized',
            version: CURRENT_CONSENT_VERSION,
            timestamp: new Date().toISOString()
        };
        saveConsentLocally(newConsent);
        setIsModalOpen(false);
    }, [consent, saveConsentLocally]);

    // Action 4: Withdraw Optional Consent
    const withdrawConsent = useCallback(async () => {
        const consentId = consent?.consentId || ('cid_' + Date.now().toString(36));
        const newConsent = {
            consentId,
            essential: true,
            preferences: false,
            analytics: false,
            functional: false,
            action: 'withdrawn',
            version: CURRENT_CONSENT_VERSION,
            withdrawnAt: new Date().toISOString(),
            timestamp: new Date().toISOString()
        };
        saveConsentLocally(newConsent);
        try {
            await Axios({
                ...SummaryApi.cookieConsent.withdraw,
                data: { consentId }
            });
        } catch (e) {
            console.warn("Withdraw consent API warning:", e?.message || e);
        }
        setIsModalOpen(false);
    }, [consent, saveConsentLocally]);

    const openPreferences = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const closePreferences = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <CookieConsentContext.Provider value={{
            consent,
            hasConsented: Boolean(consent),
            isBannerOpen,
            isModalOpen,
            acceptAll,
            rejectOptional,
            saveCustomPreferences,
            withdrawConsent,
            openPreferences,
            closePreferences
        }}>
            {children}
        </CookieConsentContext.Provider>
    );
};

export const useCookieConsent = () => {
    const context = useContext(CookieConsentContext);
    if (!context) {
        throw new Error("useCookieConsent must be used within a CookieConsentProvider");
    }
    return context;
};

export default CookieConsentContext;
