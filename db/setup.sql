-- Drop existing tables (messages first because it references contacts)
-- DROP TABLE IF EXISTS messages;
-- DROP TABLE IF EXISTS contacts;

-- Creating contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    created_at timestamp NOT NULL DEFAULT NOW(),
    updated_at timestamp NOT NULL DEFAULT NOW()
);

-- Creating messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES contacts(id),
    receiver_id INTEGER REFERENCES contacts(id),
    content TEXT NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW()
);

-- Index for recent messages per contact
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver_created_at
    ON messages (sender_id, receiver_id, created_at DESC);

-- Full-text search index for messages content
CREATE INDEX idx_messages_content_fts ON messages
    USING GIN(to_tsvector('english', content));

-- Full-text search index on contacts' name
CREATE INDEX idx_contacts_name_fts ON contacts
    USING GIN(to_tsvector('english', name));

-- Full-text search index on contacts' phone number
CREATE INDEX idx_contacts_phone_fts ON contacts (phone_number);

