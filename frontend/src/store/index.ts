import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './authSlice';
import apiSlice from './apiSlice';
import registrationSlice from './registrationSlice';
import dataSlice from './dataSlice';
import dashboardSlice from './dashboardSlice';
import messageSlice from './messageSlice';
import paymentSlice from './slices/paymentSlice';
import courtSlice from './slices/courtSlice';
import reservationSlice from './slices/reservationSlice';
import tournamentSlice from './slices/tournamentSlice';
import rankingSlice from './slices/rankingSlice';
import credentialSlice from './slices/credentialSlice';
import micrositeSlice from './slices/micrositeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    api: apiSlice,
    registration: registrationSlice,
    data: dataSlice,
    dashboard: dashboardSlice,
    messages: messageSlice,
    payment: paymentSlice,
    courts: courtSlice,
    reservations: reservationSlice,
    tournaments: tournamentSlice,
    rankings: rankingSlice,
    credentials: credentialSlice,
    microsites: micrositeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;