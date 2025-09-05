# 01. Authentication Flow Fix - Critical Implementation Guide

## Problem Analysis
The current project has a major authentication flow issue where users get stuck on the login screen even after successful login. This is preventing access to the dashboard and other functionality.

## Root Causes Identified
1. **Missing Authentication State Management**: Redux auth slice may not properly handle authentication state transitions
2. **Route Protection Issues**: Protected routes may not correctly detect authenticated users
3. **Token Storage & Retrieval**: JWT token handling inconsistencies
4. **Dashboard Routing**: Missing proper redirection after successful login
5. **Session Persistence**: Users lose authentication state on page refresh

## Step-by-Step Implementation Plan

### Phase 1: Fix Authentication State Management

#### 1.1 Update Auth Slice (`frontend/src/store/authSlice.ts`)
```typescript
// Add these missing states and actions:
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginTime: string | null;
}

// Add missing actions:
- setCredentials: (token, user) => void
- logout: () => void  
- clearError: () => void
- refreshToken: () => void
- checkAuthStatus: () => void
```

#### 1.2 Implement Token Persistence
```typescript
// In authSlice.ts extraReducers:
- Save token to localStorage on login success
- Clear localStorage on logout
- Initialize state from localStorage on app startup
- Handle token expiration gracefully
```

### Phase 2: Fix Protected Routes

#### 2.1 Update ProtectedRoute Component (`frontend/src/components/common/ProtectedRoute.tsx`)
```typescript
const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectAuthLoading);

  // Show loading spinner while checking auth
  if (isLoading) return <LoadingSpinner />;
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check role permissions
  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};
```

#### 2.2 Update App.tsx Routing
```typescript
// Add proper route structure:
<Routes>
  {/* Public routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegistrationPage />} />
  
  {/* Protected routes */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } />
  
  {/* Role-specific routes */}
  <Route path="/admin/*" element={
    <ProtectedRoute roles={['admin']}>
      <AdminRoutes />
    </ProtectedRoute>
  } />
</Routes>
```

### Phase 3: Fix Login Form and API Integration

#### 3.1 Update LoginForm Component (`frontend/src/components/auth/LoginForm.tsx`)
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Clear previous errors
    dispatch(clearError());
    
    // Attempt login
    const result = await dispatch(loginUser({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    })).unwrap();
    
    // Success: redirect to intended destination
    const redirectTo = location.state?.from?.pathname || '/dashboard';
    navigate(redirectTo, { replace: true });
    
  } catch (error) {
    // Error handling is done by Redux
    console.error('Login failed:', error);
  }
};
```

#### 3.2 Add Auto-Login Check on App Load
```typescript
// In main.tsx or App.tsx:
useEffect(() => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    dispatch(checkAuthStatus());
  }
}, []);
```

### Phase 4: Backend Authentication Fixes

#### 4.1 Update Auth Controller (`backend/src/controllers/authController.ts`)
```typescript
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    const result = await authService.login({ email, password });
    
    if (!result) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Set HTTP-only refresh token cookie
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.json({
      success: true,
      user: result.user,
      token: result.token,
      expiresIn: '1h'
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
```

#### 4.2 Fix Auth Service (`backend/src/services/authService.ts`)
```typescript
const login = async (loginData: LoginRequest) => {
  const user = await User.findOne({
    where: { 
      email: loginData.email.toLowerCase(),
      isActive: true 
    },
    include: [/* include profile associations based on user role */]
  });

  if (!user || !await bcrypt.compare(loginData.password, user.passwordHash)) {
    return null;
  }

  // Update last login
  await user.update({ lastLogin: new Date() });

  // Generate tokens
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      profile: user.playerProfile || user.clubProfile || user.coachProfile || null
    },
    token,
    refreshToken
  };
};
```

### Phase 5: Dashboard Role-Based Rendering

#### 5.1 Update DashboardPage (`frontend/src/pages/DashboardPage.tsx`)
```typescript
const DashboardPage: React.FC = () => {
  const user = useAppSelector(selectCurrentUser);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const getDashboardComponent = () => {
    switch (user.role) {
      case 'player':
        return <PlayerDashboard />;
      case 'coach':
        return <CoachDashboard />;
      case 'club':
        return <ClubDashboard />;
      case 'partner':
        return <PartnerDashboard />;
      case 'state_committee':
        return <StateDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Invalid user role</div>;
    }
  };

  return (
    <DashboardLayout>
      {getDashboardComponent()}
    </DashboardLayout>
  );
};
```

### Phase 6: Testing Checklist

#### Frontend Tests
- [ ] Login with valid credentials redirects to dashboard
- [ ] Login with invalid credentials shows error
- [ ] Refresh page while authenticated maintains session
- [ ] Logout clears authentication state
- [ ] Protected routes redirect to login when not authenticated
- [ ] Role-based access works correctly

#### Backend Tests
- [ ] Login endpoint returns proper response structure
- [ ] JWT tokens are valid and contain correct payload
- [ ] Refresh token mechanism works
- [ ] Password comparison works with updated hashing
- [ ] User associations are properly included in response

### Phase 7: Database Seeding for Testing

#### Update Seeder to Create Test Users
```typescript
// Ensure seeder creates users with proper hash and different roles:
const users = [
  {
    email: 'admin@federacionpickleball.mx',
    password_hash: await bcrypt.hash('a', 10),
    role: 'admin',
    // ... other fields
  },
  {
    email: 'player@test.com', 
    password_hash: await bcrypt.hash('a', 10),
    role: 'player',
    // ... other fields
  },
  // Add users for each role type
];
```

## Implementation Priority
1. **CRITICAL**: Fix authentication state management (Phase 1)
2. **CRITICAL**: Fix login form and redirection (Phase 3.1) 
3. **HIGH**: Fix protected routes (Phase 2)
4. **HIGH**: Update backend authentication (Phase 4)
5. **MEDIUM**: Dashboard role-based rendering (Phase 5)
6. **LOW**: Comprehensive testing (Phase 6)

## Expected Results
After implementing these fixes:
- Users can successfully log in and access their dashboard
- Authentication state persists on page refresh  
- Role-based access control works properly
- Users are redirected appropriately after login/logout
- The login screen no longer traps users in an infinite loop

## Files to Modify
- `frontend/src/store/authSlice.ts`
- `frontend/src/components/auth/LoginForm.tsx`
- `frontend/src/components/common/ProtectedRoute.tsx` 
- `frontend/src/pages/DashboardPage.tsx`
- `frontend/src/App.tsx`
- `backend/src/controllers/authController.ts`
- `backend/src/services/authService.ts`
- `backend/src/seeders/20240301000002-seed-users.ts`