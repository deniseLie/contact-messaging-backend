

CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL UNIQUE
    created_at timestamp NOT NULL DEFAULT NOW()
    updated_at timestamp NOT NULL DEFAULT NOW()
)

CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    contact_id_1 INTEGER REFERENCES contacts(id)
    contact_id_2 INTEGER REFERENCES contacts(id)
    created_at timestamp NOT NULL DEFAULT NOW()
)

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    content TEXT NOT NULL,
    created_at timestamp NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_contact_id_timestamp ON messages (contact_id, timestamp DESC);