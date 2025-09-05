import React from 'react';

// Pages
import HomePage from './pages/HomePage';
import LearnMorePage from './pages/LearnMorePage';
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import RegistrationSuccessPage from './pages/RegistrationSuccessPage';
import DashboardPage from './pages/DashboardPage';
import { MembershipPage } from './pages/MembershipPage';
import MicrositesPage from './pages/microsites/MicrositesPage';
import MicrositeEditorPage from './pages/microsites/MicrositeEditorPage';
import MicrositeBuilderPage from './pages/MicrositeBuilderPage';
import MicrositeCreatePage from './pages/MicrositeCreatePage';
import MicrositeEditPage from './pages/MicrositeEditPage';
import PlayerConnectionPage from './pages/player/PlayerConnectionPage';
import TournamentsPage from './pages/tournaments/TournamentsPage';
import TournamentManagePage from './pages/tournaments/TournamentManagePage';
import TournamentAnalyticsPage from './pages/tournaments/TournamentAnalyticsPage';
import SearchPage from './pages/SearchPage';
import ExportPage from './pages/ExportPage';
import AdminPage from './pages/AdminPage';
import AdminDashboard from './pages/AdminDashboard';
import PaymentPage from './pages/PaymentPage';
import NotificationsPage from './pages/NotificationsPage';
import MessagingPage from './pages/MessagingPage';
import CreateTournamentForm from './components/tournaments/CreateTournamentForm';
import TournamentBracketPage from './pages/tournaments/TournamentBracketPage';
import LiveScoringPage from './pages/tournaments/LiveScoringPage';
import ProfilePage from './pages/ProfilePage';

// Types
export interface RouteConfig {
  path: string;
  key: string;
  public: boolean;
  element: React.ReactElement;
  requiredRoles?: string[];
  exact?: boolean;
}


const routes: RouteConfig[] = [
    // ==================== PUBLIC ROUTES ====================
    {
        path: "/",
        key: "home",
        public: true,
        element: <HomePage/>,
        exact: true
    },
    {
        path: "/about",
        key: "about",
        public: true,
        element: <LearnMorePage/>
    },
    {
        path: "/learn-more",
        key: "learn-more-alt",
        public: true,
        element: <LearnMorePage/>
    },
    {
        path: "/login",
        key: "login",
        public: true,
        element: <LoginPage/>
    },
    {
        path: "/register",
        key: "register",
        public: true,
        element: <RegistrationPage/>
    },
    {
        path: "/registration/success",
        key: "registration-success",
        public: true,
        element: <RegistrationSuccessPage/>
    },
    
    // ==================== USER DASHBOARD & PROFILE ====================
    {
        path: "/dashboard",
        key: "dashboard",
        public: false,
        element: <DashboardPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    {
        path: "/profile",
        key: "profile",
        public: false,
        element: <ProfilePage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    
    // ==================== MEMBERSHIP & PAYMENTS ====================
    {
        path: "/membership",
        key: "membership",
        public: false,
        element: <MembershipPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    {
        path: "/payment",
        key: "payment",
        public: false,
        element: <PaymentPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    
    // ==================== COMMUNICATION ====================
    {
        path: "/notifications",
        key: "notifications",
        public: false,
        element: <NotificationsPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    {
        path: "/messaging",
        key: "messaging",
        public: false,
        element: <MessagingPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    
    // ==================== PLAYER FEATURES ====================
    {
        path: "/player-connections",
        key: "player-connections",
        public: false,
        element: <PlayerConnectionPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    {
        path: "/search",
        key: "search",
        public: false,
        element: <SearchPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    
    // ==================== MICROSITE MANAGEMENT ====================
    {
        path: "/microsites",
        key: "microsites",
        public: false,
        element: <MicrositesPage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    {
        path: "/microsites/create",
        key: "microsite-create",
        public: false,
        element: <MicrositeCreatePage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    {
        path: "/microsites/edit/:id",
        key: "microsite-edit",
        public: false,
        element: <MicrositeEditPage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    {
        path: "/microsites/editor/:id",
        key: "microsite-editor",
        public: false,
        element: <MicrositeEditorPage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    {
        path: "/microsites/builder",
        key: "microsite-builder",
        public: false,
        element: <MicrositeBuilderPage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    
    // ==================== TOURNAMENT MANAGEMENT ====================
    {
        path: "/tournaments",
        key: "tournaments",
        public: false,
        element: <TournamentsPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    {
        path: "/tournaments/create",
        key: "tournament-create",
        public: false,
        element: <CreateTournamentForm/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    {
        path: "/tournaments/:id",
        key: "tournament-detail",
        public: false,
        element: <TournamentsPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    {
        path: "/tournaments/:id/manage",
        key: "tournament-manage",
        public: false,
        element: <TournamentManagePage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    {
        path: "/tournaments/:id/analytics",
        key: "tournament-analytics",
        public: false,
        element: <TournamentAnalyticsPage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    {
        path: "/tournaments/analytics",
        key: "tournaments-analytics-general",
        public: false,
        element: <TournamentAnalyticsPage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    {
        path: "/tournaments/:id/bracket",
        key: "tournament-bracket",
        public: false,
        element: <TournamentBracketPage/>,
        requiredRoles: ['player', 'coach', 'admin', 'state', 'club', 'partner']
    },
    {
        path: "/tournaments/:id/matches/:matchId/scoring",
        key: "tournament-scoring",
        public: false,
        element: <LiveScoringPage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    {
        path: "/tournaments/:id/scoring",
        key: "tournament-scoring-legacy",
        public: false,
        element: <LiveScoringPage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    
    // ==================== DATA & EXPORT ====================
    {
        path: "/export",
        key: "export",
        public: false,
        element: <ExportPage/>,
        requiredRoles: ['admin', 'state', 'club', 'partner']
    },
    
    // ==================== ADMIN ROUTES ====================
    {
        path: "/admin",
        key: "admin",
        public: false,
        element: <AdminPage/>,
        requiredRoles: ['admin']
    },
    {
        path: "/admin/dashboard",
        key: "admin-dashboard",
        public: false,
        element: <AdminDashboard/>,
        requiredRoles: ['admin']
    },
]

export default routes;