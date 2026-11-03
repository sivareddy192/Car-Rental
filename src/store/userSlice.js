import { createSlice } from "@reduxjs/toolkit";

const getCachedUser = () => {
    try {
        const token = localStorage.getItem('accessToken');
        if (!token) return null;
        const cached = localStorage.getItem('cached_user');
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
};

const defaultInitialValue = {
    _id : "",
    name : "",
    email : "",
    avatar : "",
    mobile : "",
    verify_email : "",
    last_login_date : "",
    status : "",
    role : "",
    onboardingStatus : ""
};

const cachedUser = getCachedUser();
const initialValue = cachedUser ? { ...defaultInitialValue, ...cachedUser } : defaultInitialValue;

const userSlice = createSlice({
    name : 'user',
    initialState : initialValue,
    reducers : {
        setUserDetails : (state,action) =>{
            if (action.payload) {
                state._id = action.payload._id || "";
                state.name  = action.payload.name || "";
                state.email = action.payload.email || "";
                state.avatar = action.payload.avatar || "";
                state.mobile = action.payload.mobile || action.payload.phone || "";
                state.verify_email = action.payload.verify_email;
                state.last_login_date = action.payload.last_login_date || "";
                state.status = action.payload.status || action.payload.accountStatus || "";
                state.role = action.payload.role || "";
                state.onboardingStatus = action.payload.onboardingStatus || "";

                try {
                    localStorage.setItem('cached_user', JSON.stringify({
                        _id: state._id,
                        name: state.name,
                        email: state.email,
                        avatar: state.avatar,
                        mobile: state.mobile,
                        role: state.role,
                        status: state.status,
                        onboardingStatus: state.onboardingStatus
                    }));
                } catch (e) {
                    console.error("Cache user failed:", e);
                }
            }
        },
        updatedAvatar : (state,action)=>{
            state.avatar = action.payload;
            try {
                const cached = getCachedUser();
                if (cached) {
                    cached.avatar = action.payload;
                    localStorage.setItem('cached_user', JSON.stringify(cached));
                }
            } catch (e) {
                console.error("Cache avatar failed:", e);
            }
        },
        logout : (state)=>{
            state._id = "";
            state.name  = "";
            state.email = "";
            state.avatar = "";
            state.mobile = "";
            state.verify_email = "";
            state.last_login_date = "";
            state.status = "";
            state.role = "";
            state.onboardingStatus = "";
            try {
                localStorage.removeItem('cached_user');
            } catch (e) {
                console.error("Clear cached user failed:", e);
            }
        },
    }
});

export const { setUserDetails, logout, updatedAvatar } = userSlice.actions;

export default userSlice.reducer;
