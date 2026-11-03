// Utilities for managing User Wishlist (Cars & Bikes) via localStorage

const WISHLIST_KEY = 'driverent_wishlist';

export const getWishlist = () => {
    try {
        if (typeof window === 'undefined') return [];
        const raw = localStorage.getItem(WISHLIST_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const isWishlisted = (id) => {
    if (!id) return false;
    const list = getWishlist();
    return list.includes(String(id));
};

export const toggleWishlist = (id) => {
    if (!id) return false;
    const strId = String(id);
    const list = getWishlist();
    let updated;
    let added = false;

    if (list.includes(strId)) {
        updated = list.filter(item => item !== strId);
        added = false;
    } else {
        updated = [...list, strId];
        added = true;
    }

    try {
        localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { id: strId, added, list: updated } }));
    } catch (e) {
        console.error("Failed to save wishlist:", e);
    }

    return added;
};

export const clearWishlist = () => {
    try {
        localStorage.removeItem(WISHLIST_KEY);
        window.dispatchEvent(new CustomEvent('wishlist-updated', { detail: { list: [] } }));
    } catch (e) {
        console.error("Failed to clear wishlist:", e);
    }
};

