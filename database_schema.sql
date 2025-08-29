-- Mexican Pickleball Federation Database Schema
-- Comprehensive database structure for the national sports federation platform

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- User roles enum for type safety
CREATE TYPE user_role AS ENUM ('player', 'coach', 'club', 'partner', 'state', 'federation');
CREATE TYPE affiliation_status AS ENUM ('active', 'inactive', 'pending', 'expired');
CREATE TYPE plan_type AS ENUM ('basic', 'premium');
CREATE TYPE notification_type AS ENUM ('email', 'sms', 'both');
CREATE TYPE tournament_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- ============================================================================
-- USERS AND AUTHENTICATION
-- ============================================================================

-- Base users table for authentication
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- States table (32 Mexican states)
CREATE TABLE states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- USER PROFILES
-- ============================================================================

-- Player profiles
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    state_id INTEGER REFERENCES states(id),
    curp VARCHAR(18) UNIQUE, -- Mexican CURP identifier
    nrtp_level VARCHAR(10),
    mobile_phone VARCHAR(20),
    profile_photo_url VARCHAR(500),
    id_document_url VARCHAR(500), -- INE or passport
    nationality VARCHAR(50) DEFAULT 'Mexican',
    can_be_found BOOLEAN DEFAULT true, -- Privacy setting for player finder
    is_premium BOOLEAN DEFAULT false,
    ranking_position INTEGER,
    federation_id_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coach profiles
CREATE TABLE coaches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    state_id INTEGER REFERENCES states(id),
    curp VARCHAR(18) UNIQUE,
    nrtp_level VARCHAR(10),
    mobile_phone VARCHAR(20),
    profile_photo_url VARCHAR(500),
    id_document_url VARCHAR(500),
    nationality VARCHAR(50) DEFAULT 'Mexican',
    license_type VARCHAR(100),
    ranking_position INTEGER,
    federation_id_number VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Club profiles
CREATE TABLE clubs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    rfc VARCHAR(20), -- Mexican tax ID
    manager_name VARCHAR(255) NOT NULL,
    manager_role VARCHAR(100),
    contact_email VARCHAR(255),
    phone VARCHAR(20),
    state_id INTEGER REFERENCES states(id),
    club_type VARCHAR(100),
    website VARCHAR(255),
    social_media JSONB, -- Store multiple social media links
    logo_url VARCHAR(500),
    has_courts BOOLEAN DEFAULT false,
    plan_type plan_type DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partner profiles (businesses, hotels, sponsors)
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    rfc VARCHAR(20),
    contact_person_name VARCHAR(255) NOT NULL,
    contact_person_title VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    partner_type VARCHAR(100) NOT NULL,
    website VARCHAR(255),
    social_media JSONB,
    logo_url VARCHAR(500),
    plan_type plan_type DEFAULT 'premium', -- Partners only have premium
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- State committee profiles
CREATE TABLE state_committees (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    rfc VARCHAR(20),
    president_name VARCHAR(255) NOT NULL,
    president_title VARCHAR(100),
    institutional_email VARCHAR(255),
    phone VARCHAR(20),
    state_id INTEGER REFERENCES states(id),
    affiliate_type VARCHAR(100),
    website VARCHAR(255),
    social_media JSONB,
    logo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MEMBERSHIP AND AFFILIATION
-- ============================================================================

-- Membership fees and plans
CREATE TABLE membership_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    plan_type plan_type NOT NULL,
    annual_fee DECIMAL(10,2) NOT NULL,
    description TEXT,
    features JSONB, -- Store plan features as JSON
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User memberships and affiliations
CREATE TABLE memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES membership_plans(id),
    status affiliation_status DEFAULT 'pending',
    start_date DATE,
    end_date DATE,
    payment_id INTEGER, -- Reference to payment
    auto_renew BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Club memberships (players affiliated with clubs)
CREATE TABLE club_memberships (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    club_id INTEGER REFERENCES clubs(id) ON DELETE CASCADE,
    joined_date DATE DEFAULT CURRENT_DATE,
    status affiliation_status DEFAULT 'active',
    role VARCHAR(50) DEFAULT 'member', -- member, coordinator, admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(player_id, club_id)
);

-- ============================================================================
-- COURTS AND FACILITIES
-- ============================================================================

-- Courts table
CREATE TABLE courts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    surface_type VARCHAR(50), -- indoor, outdoor, concrete, etc.
    owner_type VARCHAR(20) NOT NULL, -- club or partner
    owner_id INTEGER NOT NULL, -- References clubs.id or partners.id
    state_id INTEGER REFERENCES states(id),
    address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    amenities JSONB, -- Store amenities as JSON array
    hourly_rate DECIMAL(8,2),
    images JSONB, -- Store multiple image URLs
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Court availability schedule
CREATE TABLE court_schedules (
    id SERIAL PRIMARY KEY,
    court_id INTEGER REFERENCES courts(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Court reservations
CREATE TABLE court_reservations (
    id SERIAL PRIMARY KEY,
    court_id INTEGER REFERENCES courts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reservation_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    total_cost DECIMAL(8,2),
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    payment_id INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TOURNAMENTS AND EVENTS
-- ============================================================================

-- Tournaments
CREATE TABLE tournaments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    organizer_type VARCHAR(20) NOT NULL, -- federation, state, club, partner
    organizer_id INTEGER NOT NULL,
    tournament_type VARCHAR(50), -- national, state, local
    state_id INTEGER REFERENCES states(id),
    venue_name VARCHAR(255),
    venue_address TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    entry_fee DECIMAL(8,2),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    status tournament_status DEFAULT 'draft',
    rules_document_url VARCHAR(500),
    prize_pool DECIMAL(10,2),
    images JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournament categories (age groups, skill levels, etc.)
CREATE TABLE tournament_categories (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    min_age INTEGER,
    max_age INTEGER,
    skill_level VARCHAR(20),
    gender_requirement VARCHAR(20), -- open, men, women, mixed
    entry_fee DECIMAL(8,2),
    max_participants INTEGER,
    current_participants INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournament registrations
CREATE TABLE tournament_registrations (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES tournament_categories(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_id INTEGER,
    status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled
    partner_player_id INTEGER REFERENCES players(id), -- For doubles
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tournament matches
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    tournament_id INTEGER REFERENCES tournaments(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES tournament_categories(id),
    round VARCHAR(50), -- qualifying, round1, quarterfinal, semifinal, final
    match_number INTEGER,
    court_id INTEGER REFERENCES courts(id),
    scheduled_date DATE,
    scheduled_time TIME,
    player1_id INTEGER REFERENCES players(id),
    player2_id INTEGER REFERENCES players(id),
    player1_partner_id INTEGER REFERENCES players(id), -- For doubles
    player2_partner_id INTEGER REFERENCES players(id), -- For doubles
    score JSONB, -- Store match score as JSON
    winner_id INTEGER REFERENCES players(id),
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    referee_id INTEGER REFERENCES coaches(id), -- Coach acting as referee
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- RANKING SYSTEM
-- ============================================================================

-- Player rankings
CREATE TABLE rankings (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    ranking_type VARCHAR(50) NOT NULL, -- national, state, age_group
    category VARCHAR(50), -- overall, men, women, age groups
    state_id INTEGER REFERENCES states(id), -- For state rankings
    position INTEGER NOT NULL,
    points DECIMAL(8,2) DEFAULT 0,
    previous_position INTEGER,
    rank_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ranking history for tracking changes
CREATE TABLE ranking_history (
    id SERIAL PRIMARY KEY,
    player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    ranking_type VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    state_id INTEGER REFERENCES states(id),
    old_position INTEGER,
    new_position INTEGER,
    old_points DECIMAL(8,2),
    new_points DECIMAL(8,2),
    change_reason VARCHAR(255),
    change_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PLAYER FINDER SYSTEM
-- ============================================================================

-- Player finder requests
CREATE TABLE player_finder_requests (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    location_address TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    search_radius INTEGER DEFAULT 50, -- km
    skill_level VARCHAR(20),
    preferred_times JSONB, -- Store available times as JSON
    message TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player finder matches
CREATE TABLE player_finder_matches (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES player_finder_requests(id) ON DELETE CASCADE,
    matched_player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
    distance DECIMAL(6,2), -- km
    compatibility_score INTEGER, -- 1-100
    notification_sent BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, expired
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MESSAGING AND NOTIFICATIONS
-- ============================================================================

-- Messages/announcements
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    sender_type VARCHAR(20), -- user, system, federation
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'announcement', -- announcement, notification, alert
    recipient_type VARCHAR(20), -- specific, role, state, all
    target_roles user_role[], -- Array of roles
    target_state_id INTEGER REFERENCES states(id),
    attachments JSONB, -- File URLs and metadata
    is_urgent BOOLEAN DEFAULT false,
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Message recipients
CREATE TABLE message_recipients (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id) ON DELETE CASCADE,
    recipient_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(message_id, recipient_id)
);

-- Notification preferences
CREATE TABLE notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    push_notifications BOOLEAN DEFAULT true,
    tournament_notifications BOOLEAN DEFAULT true,
    payment_notifications BOOLEAN DEFAULT true,
    marketing_notifications BOOLEAN DEFAULT false,
    player_finder_notifications BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- ============================================================================
-- PAYMENTS AND BILLING
-- ============================================================================

-- Payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'MXN',
    payment_type VARCHAR(50) NOT NULL, -- membership, tournament, court_rental, premium
    payment_method VARCHAR(50), -- stripe, card, transfer
    stripe_payment_intent_id VARCHAR(255),
    status payment_status DEFAULT 'pending',
    description TEXT,
    reference_type VARCHAR(50), -- membership, tournament_registration, court_reservation
    reference_id INTEGER, -- ID of the related record
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invoices
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id),
    user_id INTEGER REFERENCES users(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(8,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    pdf_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- MICROSITES
-- ============================================================================

-- Microsites for clubs, partners, and state committees
CREATE TABLE microsites (
    id SERIAL PRIMARY KEY,
    owner_type VARCHAR(20) NOT NULL, -- club, partner, state
    owner_id INTEGER NOT NULL,
    subdomain VARCHAR(50) UNIQUE, -- e.g., club-name.pickleballfed.mx
    title VARCHAR(255),
    description TEXT,
    logo_url VARCHAR(500),
    banner_images JSONB,
    theme_colors JSONB, -- Store color scheme
    contact_info JSONB,
    social_links JSONB,
    content_blocks JSONB, -- Flexible content structure
    is_active BOOLEAN DEFAULT true,
    seo_meta JSONB, -- SEO metadata
    custom_css TEXT,
    analytics_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Microsite pages (for additional content)
CREATE TABLE microsite_pages (
    id SERIAL PRIMARY KEY,
    microsite_id INTEGER REFERENCES microsites(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    content TEXT,
    is_published BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    seo_meta JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(microsite_id, slug)
);

-- ============================================================================
-- CERTIFICATIONS AND COACHING
-- ============================================================================

-- Coaching certifications
CREATE TABLE certifications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    issuing_organization VARCHAR(255),
    level VARCHAR(50), -- beginner, intermediate, advanced
    requirements TEXT,
    fee DECIMAL(8,2),
    validity_months INTEGER, -- How long certification is valid
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coach certifications (earned certifications)
CREATE TABLE coach_certifications (
    id SERIAL PRIMARY KEY,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE CASCADE,
    certification_id INTEGER REFERENCES certifications(id),
    earned_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    certificate_url VARCHAR(500), -- PDF certificate
    status VARCHAR(20) DEFAULT 'active', -- active, expired, revoked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training sessions
CREATE TABLE training_sessions (
    id SERIAL PRIMARY KEY,
    coach_id INTEGER REFERENCES coaches(id) ON DELETE CASCADE,
    player_id INTEGER REFERENCES players(id),
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    court_id INTEGER REFERENCES courts(id),
    session_type VARCHAR(50), -- individual, group, clinic
    fee DECIMAL(8,2),
    status VARCHAR(20) DEFAULT 'scheduled', -- scheduled, completed, cancelled
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- SYSTEM ADMINISTRATION
-- ============================================================================

-- Admin activity logs
CREATE TABLE admin_logs (
    id SERIAL PRIMARY KEY,
    admin_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50), -- user, tournament, court, etc.
    target_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System settings
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    data_type VARCHAR(20) DEFAULT 'string', -- string, number, boolean, json
    is_public BOOLEAN DEFAULT false, -- Can be accessed by frontend
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- File uploads tracking
CREATE TABLE file_uploads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    original_filename VARCHAR(255),
    stored_filename VARCHAR(255),
    file_path VARCHAR(500),
    cloudinary_public_id VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    upload_type VARCHAR(50), -- profile_photo, id_document, tournament_image, etc.
    reference_type VARCHAR(50),
    reference_id INTEGER,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Profile table indexes
CREATE INDEX idx_players_user_id ON players(user_id);
CREATE INDEX idx_players_state_id ON players(state_id);
CREATE INDEX idx_players_can_be_found ON players(can_be_found);
CREATE INDEX idx_coaches_user_id ON coaches(user_id);
CREATE INDEX idx_clubs_user_id ON clubs(user_id);
CREATE INDEX idx_partners_user_id ON partners(user_id);
CREATE INDEX idx_state_committees_user_id ON state_committees(user_id);

-- Tournament indexes
CREATE INDEX idx_tournaments_organizer ON tournaments(organizer_type, organizer_id);
CREATE INDEX idx_tournaments_dates ON tournaments(start_date, end_date);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournament_registrations_player ON tournament_registrations(player_id);
CREATE INDEX idx_tournament_registrations_tournament ON tournament_registrations(tournament_id);

-- Court indexes
CREATE INDEX idx_courts_owner ON courts(owner_type, owner_id);
CREATE INDEX idx_courts_location ON courts(latitude, longitude);
CREATE INDEX idx_court_reservations_court_date ON court_reservations(court_id, reservation_date);
CREATE INDEX idx_court_reservations_user ON court_reservations(user_id);

-- Ranking indexes
CREATE INDEX idx_rankings_player ON rankings(player_id);
CREATE INDEX idx_rankings_type_category ON rankings(ranking_type, category);
CREATE INDEX idx_rankings_position ON rankings(position);

-- Message indexes
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_message_recipients_recipient ON message_recipients(recipient_id);
CREATE INDEX idx_message_recipients_unread ON message_recipients(recipient_id, is_read);

-- Payment indexes
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_type ON payments(payment_type);

-- Player finder indexes
CREATE INDEX idx_player_finder_location ON player_finder_requests(latitude, longitude);
CREATE INDEX idx_player_finder_active ON player_finder_requests(is_active);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_state_committees_updated_at BEFORE UPDATE ON state_committees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON courts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_court_reservations_updated_at BEFORE UPDATE ON court_reservations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tournaments_updated_at BEFORE UPDATE ON tournaments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_microsites_updated_at BEFORE UPDATE ON microsites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_training_sessions_updated_at BEFORE UPDATE ON training_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notification_preferences_updated_at BEFORE UPDATE ON notification_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique federation ID numbers
CREATE OR REPLACE FUNCTION generate_federation_id(role_prefix VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    new_id VARCHAR;
    counter INTEGER;
BEGIN
    counter := 1;
    LOOP
        new_id := role_prefix || '-' || LPAD(counter::text, 6, '0');
        
        -- Check if ID exists in any profile table
        IF NOT EXISTS (
            SELECT 1 FROM players WHERE federation_id_number = new_id
            UNION
            SELECT 1 FROM coaches WHERE federation_id_number = new_id
        ) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
    END LOOP;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert Mexican states
INSERT INTO states (name, code) VALUES
('Aguascalientes', 'AGU'),
('Baja California', 'BCN'),
('Baja California Sur', 'BCS'),
('Campeche', 'CAM'),
('Chiapas', 'CHP'),
('Chihuahua', 'CHH'),
('Ciudad de México', 'CMX'),
('Coahuila', 'COA'),
('Colima', 'COL'),
('Durango', 'DUR'),
('Guanajuato', 'GTO'),
('Guerrero', 'GRO'),
('Hidalgo', 'HID'),
('Jalisco', 'JAL'),
('México', 'MEX'),
('Michoacán', 'MIC'),
('Morelos', 'MOR'),
('Nayarit', 'NAY'),
('Nuevo León', 'NLE'),
('Oaxaca', 'OAX'),
('Puebla', 'PUE'),
('Querétaro', 'QRO'),
('Quintana Roo', 'ROO'),
('San Luis Potosí', 'SLP'),
('Sinaloa', 'SIN'),
('Sonora', 'SON'),
('Tabasco', 'TAB'),
('Tamaulipas', 'TAM'),
('Tlaxcala', 'TLA'),
('Veracruz', 'VER'),
('Yucatán', 'YUC'),
('Zacatecas', 'ZAC');

-- Insert default membership plans
INSERT INTO membership_plans (name, role, plan_type, annual_fee, description, features) VALUES
('Player Basic', 'player', 'basic', 500.00, 'Basic player membership with federation registration', '["federation_registration", "digital_credential", "tournament_participation"]'),
('Player Premium', 'player', 'premium', 1200.00, 'Premium player membership with player finder', '["federation_registration", "digital_credential", "tournament_participation", "player_finder", "priority_support"]'),
('Coach Basic', 'coach', 'basic', 800.00, 'Basic coach membership', '["federation_registration", "digital_credential", "coaching_tools"]'),
('Coach Premium', 'coach', 'premium', 1500.00, 'Premium coach membership with certifications', '["federation_registration", "digital_credential", "coaching_tools", "certification_access", "player_finder"]'),
('Club Basic', 'club', 'basic', 2000.00, 'Basic club affiliation', '["federation_affiliation", "member_management", "microsite_basic"]'),
('Club Premium', 'club', 'premium', 5000.00, 'Premium club with court and tournament management', '["federation_affiliation", "member_management", "microsite_premium", "court_management", "tournament_creation"]'),
('Partner Premium', 'partner', 'premium', 8000.00, 'Premium partner membership', '["court_management", "tournament_creation", "microsite_premium", "revenue_tools"]'),
('State Committee', 'state', 'basic', 15000.00, 'State committee membership', '["state_administration", "tournament_management", "microsite", "member_oversight"]');

-- Insert system settings
INSERT INTO system_settings (key, value, description, data_type, is_public) VALUES
('federation_name', 'Federación Mexicana de Pickleball', 'Official federation name', 'string', true),
('federation_email', 'info@pickleballfed.mx', 'Official federation email', 'string', true),
('federation_phone', '+52-555-123-4567', 'Official federation phone', 'string', true),
('player_finder_radius_default', '50', 'Default search radius for player finder in km', 'number', false),
('tournament_registration_days_advance', '7', 'Days in advance players can register for tournaments', 'number', false),
('court_booking_days_advance', '30', 'Days in advance courts can be booked', 'number', false),
('ranking_update_frequency', 'monthly', 'How often rankings are updated', 'string', false),
('stripe_publishable_key', '', 'Stripe publishable key for payments', 'string', true),
('sendgrid_api_key', '', 'SendGrid API key for emails', 'string', false);

-- Comments for documentation
COMMENT ON TABLE users IS 'Base authentication table for all user types';
COMMENT ON TABLE players IS 'Player profile information and settings';
COMMENT ON TABLE coaches IS 'Coach profile information and certifications';
COMMENT ON TABLE clubs IS 'Club/team information and management';
COMMENT ON TABLE partners IS 'Business partner information (hotels, sponsors, etc.)';
COMMENT ON TABLE state_committees IS 'State-level federation representatives';
COMMENT ON TABLE tournaments IS 'Tournament information and management';
COMMENT ON TABLE courts IS 'Court facilities available for booking';
COMMENT ON TABLE player_finder_requests IS 'Player finder system for connecting players';
COMMENT ON TABLE rankings IS 'Player ranking system with multiple categories';
COMMENT ON TABLE messages IS 'Internal messaging and announcement system';
COMMENT ON TABLE payments IS 'Payment processing and billing';
COMMENT ON TABLE microsites IS 'Custom microsites for clubs, partners, and states';

-- End of schema