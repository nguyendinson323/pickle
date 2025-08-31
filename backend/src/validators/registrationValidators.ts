import { body, ValidationChain } from 'express-validator';

// DEVELOPMENT MODE - ALL VALIDATION DISABLED AS REQUESTED
const isDevelopment = process.env.NODE_ENV === 'development';

export const playerRegistrationValidators: ValidationChain[] = isDevelopment ? [] : [];
export const coachRegistrationValidators: ValidationChain[] = isDevelopment ? [] : [];
export const clubRegistrationValidators: ValidationChain[] = isDevelopment ? [] : [];
export const partnerRegistrationValidators: ValidationChain[] = isDevelopment ? [] : [];
export const stateCommitteeRegistrationValidators: ValidationChain[] = isDevelopment ? [] : [];
export const loginValidators: ValidationChain[] = isDevelopment ? [] : [];
export const changePasswordValidators: ValidationChain[] = isDevelopment ? [] : [];