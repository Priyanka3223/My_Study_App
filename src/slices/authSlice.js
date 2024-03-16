import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

// Split the token into its three parts: header, payload, and signature
const [header, payload, signature] = token.split('.');

// Decode the base64url encoded payload
const decodedPayload = atob(payload);

// Parse the decoded payload as JSON to extract the information
const parsedPayload = JSON.parse(decodedPayload);

const initialState ={
    token: null, // change this with token: localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")):null,
}

const authSlice =createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        setSignupData(state, value) {
            state.signupData = value.payload;
          },
        setToken(state,value){
            state.token=value.payload
        },
        setLoading(state, value) {
            state.loading = value.payload;
        },
    }
});

export const {setToken,setLoading,setSignupData}=authSlice.actions;
export default authSlice.reducer;