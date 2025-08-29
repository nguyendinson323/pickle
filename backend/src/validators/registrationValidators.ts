import { body, ValidationChain } from 'express-validator';

// CURP validation pattern (Mexican ID)
const CURP_PATTERN = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/;

// RFC validation pattern (Mexican Tax ID)
const RFC_PATTERN_PERSON = /^[A-Z]{4}\d{6}[A-Z\d]{3}$/;
const RFC_PATTERN_COMPANY = /^[A-Z]{3}\d{6}[A-Z\d]{3}$/;

// Phone validation pattern (Mexican format)
const PHONE_PATTERN = /^(\+52)?[1-9]\d{9}$/;

// Password validation pattern
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Common validators
const usernameValidator = body('username')
  .trim()
  .isLength({ min: 3, max: 50 })
  .withMessage('Username must be between 3 and 50 characters')
  .matches(/^[a-zA-Z0-9_]+$/)
  .withMessage('Username can only contain letters, numbers, and underscores');

const emailValidator = body('email')
  .trim()
  .isEmail()
  .withMessage('Invalid email format')
  .normalizeEmail();

const passwordValidator = body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(PASSWORD_PATTERN)
  .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');

const confirmPasswordValidator = body('confirmPassword')
  .custom((value, { req }) => value === req.body.password)
  .withMessage('Passwords do not match');

const privacyPolicyValidator = body('privacyPolicyAccepted')
  .isBoolean()
  .equals('true')
  .withMessage('You must accept the privacy policy');

// Player/Coach validators
export const playerRegistrationValidators: ValidationChain[] = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Full name must be between 3 and 255 characters'),
  
  body('dateOfBirth')
    .isISO8601()
    .withMessage('Invalid date format')
    .custom((value) => {
      const date = new Date(value);
      const now = new Date();
      const age = now.getFullYear() - date.getFullYear();
      return age >= 13 && age <= 100;
    })
    .withMessage('Age must be between 13 and 100 years'),
  
  body('gender')
    .isIn(['male', 'female', 'other'])
    .withMessage('Invalid gender selection'),
  
  body('stateId')
    .isInt({ min: 1 })
    .withMessage('Please select a state'),
  
  body('curp')
    .trim()
    .matches(CURP_PATTERN)
    .withMessage('Invalid CURP format'),
  
  body('nrtpLevel')
    .optional()
    .isIn(['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0'])
    .withMessage('Invalid NRTP level'),
  
  body('mobilePhone')
    .trim()
    .matches(PHONE_PATTERN)
    .withMessage('Invalid Mexican phone number format'),
  
  usernameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  privacyPolicyValidator
];

export const coachRegistrationValidators = playerRegistrationValidators;

// Club validators
export const clubRegistrationValidators: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Club name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Club name must be between 3 and 255 characters'),
  
  body('rfc')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      return RFC_PATTERN_COMPANY.test(value) || RFC_PATTERN_PERSON.test(value);
    })
    .withMessage('Invalid RFC format'),
  
  body('managerName')
    .trim()
    .notEmpty()
    .withMessage('Club manager name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Manager name must be between 3 and 255 characters'),
  
  body('managerRole')
    .trim()
    .notEmpty()
    .withMessage('Manager role is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Manager role must be between 3 and 100 characters'),
  
  body('contactEmail')
    .trim()
    .isEmail()
    .withMessage('Invalid contact email format')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .matches(PHONE_PATTERN)
    .withMessage('Invalid Mexican phone number format'),
  
  body('stateId')
    .isInt({ min: 1 })
    .withMessage('Please select a state'),
  
  body('clubType')
    .isIn(['competitive', 'recreational', 'mixed'])
    .withMessage('Invalid club type'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid website URL'),
  
  usernameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  privacyPolicyValidator
];

// Partner validators
export const partnerRegistrationValidators: ValidationChain[] = [
  body('businessName')
    .trim()
    .notEmpty()
    .withMessage('Business name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Business name must be between 3 and 255 characters'),
  
  body('rfc')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      return RFC_PATTERN_COMPANY.test(value);
    })
    .withMessage('Invalid business RFC format'),
  
  body('contactPersonName')
    .trim()
    .notEmpty()
    .withMessage('Contact person name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Contact person name must be between 3 and 255 characters'),
  
  body('contactPersonTitle')
    .trim()
    .notEmpty()
    .withMessage('Contact person title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Contact person title must be between 3 and 100 characters'),
  
  body('partnerType')
    .isIn(['hotel', 'resort', 'camp', 'company', 'court_owner'])
    .withMessage('Invalid partner type'),
  
  body('phone')
    .trim()
    .matches(PHONE_PATTERN)
    .withMessage('Invalid Mexican phone number format'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid website URL'),
  
  usernameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  privacyPolicyValidator
];

// State Committee validators
export const stateCommitteeRegistrationValidators: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Association/Committee name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters'),
  
  body('rfc')
    .optional()
    .trim()
    .custom((value) => {
      if (!value) return true;
      return RFC_PATTERN_COMPANY.test(value);
    })
    .withMessage('Invalid RFC format'),
  
  body('presidentName')
    .trim()
    .notEmpty()
    .withMessage('President/Representative name is required')
    .isLength({ min: 3, max: 255 })
    .withMessage('President name must be between 3 and 255 characters'),
  
  body('presidentTitle')
    .trim()
    .notEmpty()
    .withMessage('President title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('President title must be between 3 and 100 characters'),
  
  body('institutionalEmail')
    .trim()
    .isEmail()
    .withMessage('Invalid institutional email format')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .matches(PHONE_PATTERN)
    .withMessage('Invalid Mexican phone number format'),
  
  body('stateId')
    .isInt({ min: 1 })
    .withMessage('Please select a state'),
  
  body('affiliateType')
    .trim()
    .notEmpty()
    .withMessage('Affiliate type is required'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Invalid website URL'),
  
  usernameValidator,
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  privacyPolicyValidator
];

// Profile update validators
export const profileUpdateValidators = {
  player: [
    body('fullName').optional().trim().isLength({ min: 3, max: 255 }),
    body('gender').optional().isIn(['male', 'female', 'other']),
    body('stateId').optional().isInt({ min: 1 }),
    body('nrtpLevel').optional().isIn(['1.0', '1.5', '2.0', '2.5', '3.0', '3.5', '4.0', '4.5', '5.0', '5.5', '6.0', '6.5', '7.0']),
    body('mobilePhone').optional().trim().matches(PHONE_PATTERN),
    body('canBeFound').optional().isBoolean()
  ],
  
  club: [
    body('name').optional().trim().isLength({ min: 3, max: 255 }),
    body('rfc').optional().trim(),
    body('managerName').optional().trim().isLength({ min: 3, max: 255 }),
    body('managerRole').optional().trim().isLength({ min: 3, max: 100 }),
    body('contactEmail').optional().trim().isEmail(),
    body('phone').optional().trim().matches(PHONE_PATTERN),
    body('clubType').optional().isIn(['competitive', 'recreational', 'mixed']),
    body('website').optional().trim().isURL()
  ]
};