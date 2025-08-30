import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from './authSlice';
import apiSlice from './apiSlice';
import registrationSlice from './registrationSlice';
import dataSlice from './dataSlice';
import dashboardSlice from './dashboardSlice';
import messageSlice from './messageSlice';
import paymentSlice from './paymentSlice';
import courtSlice from './courtSlice';
import reservationSlice from './reservationSlice';
import tournamentSlice from './tournamentSlice';
import rankingSlice from './rankingSlice';
import credentialSlice from './credentialSlice';
import micrositeSlice from './micrositeSlice';
import notificationSlice from './notificationSlice';

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
    notifications: notificationSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;