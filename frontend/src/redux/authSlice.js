import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        loading:false,
        user:null,
        savedJobs:[]
    },
    reducers:{
        // actions
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setUser:(state, action) => {
            state.user = action.payload;
            state.savedJobs = action.payload?.profile?.savedJobs || [];
        },
        setSavedJobs:(state, action) => {
            state.savedJobs = action.payload;
        },
        toggleSavedJob:(state, action) => {
            const jobId = action.payload;
            if (state.savedJobs.includes(jobId)) {
                state.savedJobs = state.savedJobs.filter(id => id !== jobId);
            } else {
                state.savedJobs.push(jobId);
            }
        }
    }
});
export const {setLoading, setUser, setSavedJobs, toggleSavedJob} = authSlice.actions;
export default authSlice.reducer;