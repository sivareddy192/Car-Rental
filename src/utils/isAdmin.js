const isAdmin = (s) => {
    if (!s) return false;
    return String(s).trim().toLowerCase() === 'admin';
};

export default isAdmin;