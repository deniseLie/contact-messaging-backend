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

-- Creating an index for last message per contact
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver_created_at
    ON messages (sender_id, receiver_id, created_at DESC);