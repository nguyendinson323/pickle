# Test-2: User Profile Management Integration Testing

## Purpose
Test complete user profile management system integration using only seeded database data. Verify all profile features work seamlessly between frontend and backend.

## Critical Testing Requirements
1. **Only seeded database data** - No mockups, simulations, or random data
2. **Data type verification** - All API requests/responses must match TypeScript interfaces
3. **Immediate error resolution** - Analyze code structure, fix immediately, and retest
4. **UI element accessibility** - All elements (header, sidebar, buttons, forms) must be visually present and functional
5. **Complete integration flow** - Frontend → Button → API → Backend → Controller → Response → Frontend → Redux → UI Update

## Setup
```bash
# Start servers and ensure seeded data
cd backend && npm run seed && npm run dev &
cd frontend && npm run dev &
```

## Test Credentials (All password: `a`)
- Player: `player1@federacionpickleball.mx`
- Coach: `coach1@federacionpickleball.mx`
- Club: `club1@federacionpickleball.mx`
- Admin: `admin@federacionpickleball.mx`

---

## 1. Profile View Integration Tests

### Test 1.1: View Complete Profile Data
**Frontend Page**: `/profile`

**Steps**:
1. Login as `player1@federacionpickleball.mx` / `a`
2. Navigate to profile page via header navigation
3. Verify all profile sections display seeded data

**Expected Flow**:
- **Frontend Function**: ProfilePage component mount
- **API Request**: GET `/api/profile/me` with Authorization header
- **Backend Route**: `router.get('/me', authenticate, profileController.getProfile)` (profile.ts:14)
- **Controller**: `profileController.getProfile` queries User + Player models from seeded data
- **Response**: `{ user: UserData, playerProfile: PlayerData, completion: number }`
- **Frontend Receive**: Profile component receives seeded data
- **Data Type Verification**: Response matches `ProfileResponse` interface
- **Update Redux**: `profileSlice.setProfile` updates state with seeded data
- **UI Update**: Profile sections populate with actual seeded information

**Success Criteria**:
- All seeded profile data displays correctly (name, email, CURP, NRTP level, etc.)
- Profile photo displays from seeded data or default avatar
- Profile completion percentage calculated from actual data
- **UI Elements Present**: Profile page has visible sections for personal info, contact details, documents
- **Header Navigation**: "Profile" link visible and highlighted in header
- **Sidebar Menu**: Profile-related menu items appear (View Profile, Edit Profile, etc.)

**Error Resolution Process**:
1. If profile data missing, check seeded user data in database
2. Verify profile relationships in User model
3. Check profileController.getProfile implementation
4. Fix immediately and retest

### Test 1.2: Profile Completion Status
**Frontend Page**: `/profile`

**Steps**:
1. View profile completion percentage
2. Verify completion calculation accuracy

**Expected Flow**:
- **Frontend Function**: ProfileCompletion component within ProfilePage
- **API Request**: GET `/api/profile/completion` with Authorization header  
- **Backend Route**: `router.get('/completion', authenticate, profileController.getProfileCompletion)` (profile.ts:37)
- **Controller**: `profileController.getProfileCompletion` calculates completion from seeded data
- **Response**: `{ completion: number, missingFields: string[], totalFields: number }`
- **Frontend Receive**: Completion component receives calculation
- **Data Type Verification**: Response matches `CompletionResponse` interface
- **Update Redux**: Profile completion state updated
- **UI Update**: Progress bar and missing fields list display

**Success Criteria**:
- Completion percentage reflects actual seeded data completeness
- Missing fields list shows accurate unfilled fields
- Progress bar visually represents completion level
- **UI Elements Present**: Completion progress bar and percentage visible

---

## 2. Profile Photo Management Tests

### Test 2.1: Upload Profile Photo
**Frontend Page**: `/profile/edit`

**Steps**:
1. Navigate to profile edit page
2. Click on profile photo upload area
3. Select test image file
4. Use cropping interface
5. Save cropped photo

**Expected Flow**:
- **Button Function**: `handlePhotoUpload` in PhotoUpload component
- **API Request**: POST `/api/profile/upload-photo` with FormData (image file)
- **Backend Route**: `router.post('/upload-photo', uploadProfilePhoto, handleMulterError, profileController.uploadProfilePhoto)` (profile.ts:18-22)
- **Controller**: `profileController.uploadProfilePhoto` uploads to Cloudinary, updates User model
- **Response**: `{ success: true, url: string, publicId: string }`
- **Frontend Receive**: Photo upload component receives Cloudinary URL
- **Data Type Verification**: Response matches `PhotoUploadResponse` interface
- **Update Redux**: User profile photo URL updated in auth and profile slices
- **UI Update**: New photo displays immediately in profile view

**Success Criteria**:
- Photo uploads successfully to Cloudinary
- Database updated with new photo URL
- Redux state reflects new photo URL
- UI shows new photo immediately
- **UI Elements Present**: Photo upload area with camera icon button visible
- **Cropping Interface**: Modal with cropping tool appears and functions
- **Upload Progress**: Loading indicator shows during upload

**Error Resolution Process**:
1. If upload fails, check Cloudinary configuration
2. Verify multer middleware setup
3. Check file size and type restrictions
4. Ensure profile photo URL field exists in User model
5. Fix immediately and retest

### Test 2.2: Delete Profile Photo
**Frontend Page**: `/profile/edit`

**Steps**:
1. Navigate to profile edit page with existing photo
2. Click delete photo button
3. Confirm deletion

**Expected Flow**:
- **Button Function**: `handlePhotoDelete` in PhotoUpload component
- **API Request**: DELETE `/api/profile/photo` with Authorization header
- **Backend Route**: `router.delete('/photo', authenticate, profileController.deleteProfilePhoto)` (profile.ts:40)
- **Controller**: `profileController.deleteProfilePhoto` removes from Cloudinary, updates User model
- **Response**: `{ success: true, message: string }`
- **Frontend Receive**: Delete confirmation
- **Data Type Verification**: Response matches standard success response
- **Update Redux**: Profile photo URL set to null
- **UI Update**: Default avatar displays

**Success Criteria**:
- Photo removed from Cloudinary
- Database profile photo URL cleared
- UI reverts to default avatar
- **UI Elements Present**: Delete photo button visible when photo exists

---

## 3. Document Upload Integration Tests

### Test 3.1: Upload ID Document
**Frontend Page**: `/profile/documents`

**Steps**:
1. Navigate to document upload section
2. Upload test ID document (PDF/Image)
3. Verify document upload success

**Expected Flow**:
- **Button Function**: `handleDocumentUpload` in DocumentUpload component
- **API Request**: POST `/api/profile/upload-document` with FormData (document file)
- **Backend Route**: `router.post('/upload-document', uploadIdDocument, handleMulterError, profileController.uploadIdDocument)` (profile.ts:24-28)
- **Controller**: `profileController.uploadIdDocument` uploads to Cloudinary (private), updates User model
- **Response**: `{ success: true, url: string, documentType: string }`
- **Frontend Receive**: Document upload confirmation
- **Data Type Verification**: Response matches `DocumentUploadResponse` interface  
- **Update Redux**: User ID document URL updated
- **UI Update**: Document status shows as uploaded with view link

**Success Criteria**:
- Document uploads to Cloudinary with private access
- Database updated with document URL
- Document accessible only by authenticated user
- **UI Elements Present**: Document upload area with drag-and-drop functionality
- **File Validation**: Proper file type and size validation
- **Upload Progress**: Progress indicator during upload

**Error Resolution Process**:
1. If upload fails, check Cloudinary private folder configuration
2. Verify document upload middleware
3. Check file type restrictions (PDF, JPG, PNG)
4. Ensure ID document URL field exists in User model
5. Fix immediately and retest

---

## 4. Profile Editing Integration Tests

### Test 4.1: Update Profile Information
**Frontend Page**: `/profile/edit`

**Steps**:
1. Navigate to profile edit form
2. Modify profile fields (phone, address, etc.)
3. Click "Save Changes" button

**Expected Flow**:
- **Button Function**: `handleProfileUpdate` in ProfileEditForm
- **API Request**: PUT `/api/profile/me` with `{ field: value, ... }` and Authorization header
- **Backend Route**: `router.put('/me', authenticate, profileController.updateProfile)` (profile.ts:15)
- **Controller**: `profileController.updateProfile` validates and updates User + role-specific profile models
- **Response**: `{ success: true, user: UpdatedUserData, profile: UpdatedProfileData }`
- **Frontend Receive**: Form receives updated profile data
- **Data Type Verification**: Response matches `ProfileUpdateResponse` interface
- **Update Redux**: Profile state updated with new data
- **Page Redirect**: Back to profile view with success notification

**Success Criteria**:
- Database records actually updated with new values
- Redux state reflects all changes
- UI shows updated information immediately
- Success notification displayed
- **UI Elements Present**: Editable form fields with current seeded values
- **Form Validation**: Client-side and server-side validation working
- **Save Button**: Clearly visible and functional

### Test 4.2: Update Privacy Settings (Players Only)
**Frontend Page**: `/profile/privacy`

**Steps**:
1. Login as player
2. Navigate to privacy settings
3. Toggle "Can Be Found" setting
4. Save changes

**Expected Flow**:
- **Button Function**: `handlePrivacyToggle` in PrivacySettings component  
- **API Request**: PUT `/api/profile/me` with `{ canBeFound: boolean }`
- **Backend Route**: Same as above, but updates Player model specifically
- **Controller**: `profileController.updateProfile` updates Player.canBeFound field
- **Response**: Updated profile data with privacy settings
- **Frontend Receive**: Privacy toggle confirmation
- **Data Type Verification**: Response includes updated canBeFound value
- **Update Redux**: Player privacy settings updated
- **UI Update**: Toggle switch reflects new state

**Success Criteria**:
- Player.canBeFound field updated in database
- Privacy setting affects player search visibility
- UI toggle reflects current state accurately
- **UI Elements Present**: Toggle switch with clear labels and explanation
- **Visual Feedback**: Clear indication of current privacy state

---

## 5. Digital Credential Generation Tests

### Test 5.1: Generate Player Credential
**Frontend Page**: `/profile/credential`

**Steps**:
1. Login as player with complete profile
2. Navigate to digital credential tab
3. Verify credential displays correctly
4. Test QR code functionality

**Expected Flow**:
- **Frontend Function**: DigitalCredential component mount
- **API Request**: GET `/api/credentials/me` with Authorization header
- **Backend Route**: `router.get('/me', authenticate, credentialController.getCredential)` (credentials route)
- **Controller**: `credentialController.getCredential` generates credential data from seeded profile
- **Response**: `{ credential: CredentialData, qrCodeUrl: string }`
- **Frontend Receive**: Credential component receives data
- **Data Type Verification**: Response matches `CredentialResponse` interface
- **Update Redux**: Credential data cached
- **UI Update**: Credential card displays with QR code

**Success Criteria**:
- Credential displays all correct information from seeded data
- QR code generates and links to public credential view
- Federation logos and styling display correctly
- **UI Elements Present**: Complete credential card with all required fields
- **QR Code**: Functional QR code that can be scanned
- **Download Function**: Credential can be downloaded as image

### Test 5.2: Public Credential View (QR Code Link)
**Frontend Page**: `/credential/{userId}` (public route)

**Steps**:
1. Scan or access QR code link from credential
2. Verify public credential view displays
3. Confirm sensitive information is hidden

**Expected Flow**:
- **Frontend Function**: PublicCredential component mount
- **API Request**: GET `/api/credentials/{userId}` (no auth required)
- **Backend Route**: `router.get('/:userId', credentialController.getPublicCredential)`
- **Controller**: `credentialController.getPublicCredential` returns public-safe credential data
- **Response**: `{ credential: PublicCredentialData }` (no sensitive info)
- **Frontend Receive**: Public credential displays
- **Data Type Verification**: Response excludes sensitive fields
- **UI Update**: Read-only credential view

**Success Criteria**:
- Public credential shows only appropriate information
- No sensitive data (contact info, documents) exposed
- QR code links work correctly
- **UI Elements Present**: Public credential view with admin branding

---

## 6. Profile Completion Wizard Tests

### Test 6.1: Multi-Step Profile Setup
**Frontend Page**: `/profile/setup`

**Steps**:
1. Login as new user with incomplete profile
2. Navigate to profile setup wizard
3. Complete each step sequentially
4. Verify progress tracking

**Expected Flow**:
- **Frontend Function**: ProfileWizard component manages multi-step flow
- **API Requests**: Multiple PUT requests to `/api/profile/me` for each step
- **Backend Route**: Same profile update endpoint handles step-by-step updates
- **Controller**: `profileController.updateProfile` processes partial updates
- **Response**: Updated profile with current completion status
- **Frontend Receive**: Wizard advances to next step
- **Data Type Verification**: Each step response validated
- **Update Redux**: Profile completion percentage updated after each step
- **UI Update**: Progress indicator advances, completed steps marked

**Success Criteria**:
- Multi-step wizard guides through profile completion
- Progress accurately tracked and displayed
- Each step saves data immediately
- **UI Elements Present**: Step indicators, progress bar, navigation buttons
- **Step Validation**: Cannot advance without completing required fields
- **Data Persistence**: Wizard can be resumed if user leaves and returns

---

## 7. Role-Specific Profile Features Tests

### Test 7.1: Club Profile Management
**Frontend Page**: `/profile` (as club user)

**Steps**:
1. Login as `club1@federacionpickleball.mx`
2. Navigate to club profile
3. Verify club-specific fields display
4. Test logo upload functionality

**Expected Flow**:
- **Frontend Function**: ClubProfile component with club-specific sections
- **API Request**: GET `/api/profile/me` returns User + Club profile data
- **Backend Route**: Same profile endpoint, includes Club model
- **Controller**: `profileController.getProfile` joins Club table for club users
- **Response**: `{ user: UserData, clubProfile: ClubData }`
- **Frontend Receive**: Club-specific profile data
- **Data Type Verification**: Response includes ClubProfile interface
- **Update Redux**: Club profile data stored
- **UI Update**: Club fields (manager, RFC, type) display

**Success Criteria**:
- Club-specific fields display correctly from seeded data
- Logo upload works similar to profile photo
- Club type and manager info editable
- **UI Elements Present**: Club-specific form sections and fields

### Test 7.2: Coach Profile with Certifications
**Frontend Page**: `/profile` (as coach user)

**Steps**:
1. Login as coach
2. View coach profile sections
3. Verify certification display
4. Test credential generation

**Expected Flow**:
- Similar to club profile but with Coach model and certifications
- Coach credential generation includes license type and certifications

**Success Criteria**:
- Coach-specific sections display
- Certification information accessible
- Coach credential differs from player credential

---

## Error Testing Scenarios

### 1. File Upload Errors
**Test Cases**:
- Upload oversized file (>5MB for photos, >10MB for documents)
- Upload invalid file type
- Network interruption during upload
- Cloudinary service unavailable

**Expected Behavior**:
- Clear error messages displayed
- Upload process gracefully handles failures
- User can retry after error resolution

### 2. Profile Update Conflicts
**Test Cases**:
- Two simultaneous profile updates
- Invalid data submission
- Database connection issues

**Expected Behavior**:
- Optimistic updates with rollback on failure
- Validation errors clearly displayed
- Data integrity maintained

### 3. Privacy Setting Edge Cases
**Test Cases**:
- Toggle privacy while appearing in active search results
- Privacy changes affecting existing connection requests

**Expected Behavior**:
- Privacy changes take effect immediately
- Existing connections/searches handle changes gracefully

---

## Performance Testing

### 1. Photo Upload Performance
**Test Cases**:
- Large image files (near 5MB limit)
- Multiple concurrent uploads
- Image processing time

**Success Criteria**:
- Photo upload completes within 30 seconds
- Progress feedback provided throughout
- UI remains responsive during upload

### 2. Profile Load Performance  
**Test Cases**:
- Profile with complete data
- Profile with many uploaded documents
- Multiple profile views in quick succession

**Success Criteria**:
- Profile page loads within 2 seconds
- Images load progressively
- Cached data used when appropriate

---

## Integration Verification Checklist

For each profile management test:
- [ ] Correct HTTP status codes returned
- [ ] Response data matches TypeScript interfaces exactly
- [ ] All data comes from seeded database (verify specific values)
- [ ] Authentication/authorization working correctly
- [ ] Database changes persist and are visible in subsequent requests
- [ ] Redux state updates correctly reflect backend changes
- [ ] UI elements are present and functional as described
- [ ] Error handling provides meaningful user feedback
- [ ] File uploads work with Cloudinary integration
- [ ] Role-specific features only appear for appropriate user types
- [ ] Privacy settings affect application behavior as expected

**Key Requirements Verification**:
1. **Only seeded data used** - Verify by checking specific values from seeded users
2. **Data type matching** - All API responses must match defined TypeScript interfaces
3. **UI element accessibility** - All mentioned buttons, forms, navigation items must be clickable
4. **Complete integration flow** - Each user action must successfully complete entire frontend→backend→frontend cycle
5. **Immediate error resolution** - Any discovered errors must be analyzed, fixed, and retested before proceeding

This test document focuses exclusively on verifying that the complete user profile management system works with seeded database data and provides seamless integration between frontend and backend components.