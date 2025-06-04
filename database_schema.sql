-- Users Table: Stores user information for different roles
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Store hashed passwords
    role_id INT NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- Roles Table: Defines different user roles within the system
CREATE TABLE Roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'Operations Manager', 'Call Specialist', 'Driver', 'Senior Center Staff'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clients Table: Stores information about the seniors receiving services
CREATE TABLE Clients (
    client_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(50) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    phone_number VARCHAR(50),
    email VARCHAR(255),
    preferred_language VARCHAR(50) DEFAULT 'English', -- e.g., 'English', 'Mandarin', 'Cantonese'
    date_of_birth DATE,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(50),
    special_instructions TEXT, -- Preferences, allergies, etc.
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Client_Notes Table: For multi-language notes and document uploads related to clients
CREATE TABLE Client_Notes (
    note_id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    user_id INT NOT NULL, -- User who added the note
    note_type VARCHAR(50) DEFAULT 'General', -- e.g., 'General', 'Call Log', 'Service Feedback'
    language VARCHAR(50) DEFAULT 'English',
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Client_Documents Table: For storing paths or references to uploaded documents (PDF receipts, signatures)
CREATE TABLE Client_Documents (
    document_id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    uploader_user_id INT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(1024) NOT NULL, -- Could be a URL if stored in cloud storage
    file_type VARCHAR(50), -- e.g., 'PDF', 'JPEG', 'PNG'
    description TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (uploader_user_id) REFERENCES Users(user_id)
);

-- ServiceEvents Table: Core table tracking all types of service events
CREATE TABLE ServiceEvents (
    event_id SERIAL PRIMARY KEY,
    client_id INT NOT NULL,
    event_type VARCHAR(100) NOT NULL, -- e.g., 'Phone Call Task', 'Grocery Delivery', 'Heavy Chore'
    status VARCHAR(50) NOT NULL,
    -- For 'Phone Call Task': 'Scheduled', 'Pending Contact', 'Confirmed', 'Rescheduled', 'Skipped', 'Completed'
    -- For 'Grocery Delivery': 'Scheduled', 'Driver Assigned', 'Out for Delivery', 'Delivered', 'Cancelled'
    -- For 'Heavy Chore': 'Scheduled', 'Team Assigned', 'In Progress', 'Completed', 'Cancelled'
    scheduled_date DATE,
    scheduled_time TIME,
    actual_start_time TIMESTAMP WITH TIME ZONE,
    actual_end_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_by_user_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES Clients(client_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by_user_id) REFERENCES Users(user_id)
);

-- PhoneCallTasks Table: Specific details for phone call tasks
CREATE TABLE PhoneCallTasks (
    phone_call_task_id SERIAL PRIMARY KEY,
    event_id INT UNIQUE NOT NULL,
    call_specialist_user_id INT, -- Assigned call specialist
    call_outcome VARCHAR(255), -- e.g., 'Confirmed Delivery', 'No Answer', 'Requested Reschedule'
    follow_up_date DATE, -- For 'No Answer' -> next day reminder
    attempts INT DEFAULT 0,
    FOREIGN KEY (event_id) REFERENCES ServiceEvents(event_id) ON DELETE CASCADE,
    FOREIGN KEY (call_specialist_user_id) REFERENCES Users(user_id)
);

-- Deliveries Table: Details for grocery delivery tasks
CREATE TABLE Deliveries (
    delivery_id SERIAL PRIMARY KEY,
    event_id INT UNIQUE NOT NULL,
    driver_user_id INT,
    route_sequence INT,
    estimated_delivery_time TIMESTAMP WITH TIME ZONE,
    delivery_instructions TEXT,
    proof_of_delivery_type VARCHAR(50), -- e.g., 'Photo', 'Signature'
    proof_document_url VARCHAR(1024), -- URL to the photo or signature image
    signature_data TEXT, -- For electronic signature
    departure_time TIMESTAMP WITH TIME ZONE,
    arrival_time TIMESTAMP WITH TIME ZONE,
    completion_time TIMESTAMP WITH TIME ZONE,
    FOREIGN KEY (event_id) REFERENCES ServiceEvents(event_id) ON DELETE CASCADE,
    FOREIGN KEY (driver_user_id) REFERENCES Users(user_id)
);

-- HeavyChores Table: Details for heavy chore tasks
CREATE TABLE HeavyChores (
    chore_id SERIAL PRIMARY KEY,
    event_id INT UNIQUE NOT NULL,
    estimated_duration_hours DECIMAL(5, 2), -- e.g., 2.5 hours
    actual_duration_hours DECIMAL(5, 2),
    equipment_needed TEXT,
    FOREIGN KEY (event_id) REFERENCES ServiceEvents(event_id) ON DELETE CASCADE
);

-- HeavyChore_Team_Assignments Table: Assigns multiple users (team) to a heavy chore
CREATE TABLE HeavyChore_Team_Assignments (
    assignment_id SERIAL PRIMARY KEY,
    chore_id INT NOT NULL,
    user_id INT NOT NULL, -- Member of the team
    role_in_chore VARCHAR(100), -- e.g., 'Lead', 'Assistant'
    FOREIGN KEY (chore_id) REFERENCES HeavyChores(chore_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    UNIQUE (chore_id, user_id) -- Ensures a user is not assigned twice to the same chore
);

-- BillingRuns Table: Tracks monthly billing generation and submission
CREATE TABLE BillingRuns (
    run_id SERIAL PRIMARY KEY,
    billing_month DATE NOT NULL, -- e.g., '2025-07-01' for July 2025
    status VARCHAR(50) NOT NULL, -- e.g., 'Pending Generation', 'Generated', 'Submitted', 'Error', 'Reconciled'
    generated_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,
    submission_method VARCHAR(50), -- e.g., 'Provider Direct API', 'SFTP'
    upload_log TEXT, -- Log details from the upload process
    report_file_path VARCHAR(1024), -- Path to the generated report (e.g., Consumer Monthly Service Report PDF)
    created_by_user_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by_user_id) REFERENCES Users(user_id)
);

-- BillingRun_Events Table: Links service events to a specific billing run
CREATE TABLE BillingRun_Events (
    billing_run_event_id SERIAL PRIMARY KEY,
    run_id INT NOT NULL,
    event_id INT NOT NULL,
    service_units DECIMAL(10, 2), -- As per Senior Center requirements
    billed_amount DECIMAL(10, 2),
    notes TEXT,
    FOREIGN KEY (run_id) REFERENCES BillingRuns(run_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES ServiceEvents(event_id),
    UNIQUE (run_id, event_id) -- Ensures an event is not billed twice in the same run
);

-- Notifications Table: For system notifications
CREATE TABLE Notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL, -- Recipient user
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO', -- e.g., 'INFO', 'WARNING', 'ERROR', 'TASK_ASSIGNMENT'
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_type VARCHAR(100), -- e.g., 'ServiceEvent', 'Client', 'BillingRun'
    related_entity_id INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- AuditLog Table: For tracking important changes and actions
CREATE TABLE AuditLog (
    log_id SERIAL PRIMARY KEY,
    user_id INT, -- User who performed the action, can be NULL for system actions
    action VARCHAR(255) NOT NULL, -- e.g., 'CLIENT_CREATED', 'EVENT_STATUS_UPDATED'
    entity_type VARCHAR(100), -- e.g., 'Client', 'ServiceEvent'
    entity_id INT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details JSONB, -- Store old and new values or other relevant details
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Initial Roles Data
INSERT INTO Roles (role_name, description) VALUES
('Operations Manager', 'Monitors overall process, ensures billing compliance.'),
('Call Specialist', 'Contacts clients to confirm orders and schedule deliveries.'),
('Driver', 'Views daily routes and uploads proof of completion.'),
('Senior Center Staff', 'Audits service reports and billing (external or specific system role).'),
('System Administrator', 'Manages users and system settings.');

-- You might want to add indexes for frequently queried columns, for example:
-- CREATE INDEX idx_clients_name ON Clients (last_name, first_name);
-- CREATE INDEX idx_serviceevents_client_status ON ServiceEvents (client_id, status);
-- CREATE INDEX idx_serviceevents_scheduled_date ON ServiceEvents (scheduled_date);
-- CREATE INDEX idx_deliveries_driver_date ON Deliveries (driver_user_id, estimated_delivery_time);