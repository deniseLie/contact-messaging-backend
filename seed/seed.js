const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { faker } = require('@faker-js/faker');

require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Read and execute setup.sql script to create tables
async function runSetupScript(client) {
    try {
        const sql = fs.readFileSync(path.join(__dirname, '../db/setup.sql'), 'utf8');
        
        await client.query(sql);
        console.log('Database setup complete!');
    } catch (error) {
        console.error('Error running setup script:', error);
        throw error;
    }
}

// Load message content from CSV
function loadMessagesFromCSV(filePath) {
    return new Promise((resolve, reject) => {
        const messages = [];

        fs.createReadStream(filePath)
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                if (messages.length > 85171) {
                    console.log(row);
                }
                const message = row['0'] // Take first column value
                if (message) messages.push(message);
            })
            .on('end', () => {
                console.log(`Loaded ${messages.length} messages from CSV`);
                resolve(messages);
            })
            .on('error', reject);
    });
}

async function seed() {
    const client = await pool.connect();
    const messageCSVPath = 'message_content.csv';
    const totalMessages = 5_000_000;

    try {
        const messageSamples = await loadMessagesFromCSV(messageCSVPath);
        if (messageSamples.length === 0) throw new Error('No messages loaded from CSV.');

        await client.query('BEGIN');

        // Setup Sql (create tables)
        await runSetupScript(client);

        // Insert contacts
        console.log('Inserting contacts');
        for (let i = 0; i < 100000; i++) {
            await client.query(
                'INSERT INTO contacts (name, phone_number) VALUES ($1, $2)',
                [faker.person.fullName(), faker.phone.number().slice(0, 20)]
            );
            if (i % 10000 === 0) console.log(`${i} contacts inserted`);
        }

        // Inserting messages
        for (let i = 0; i < totalMessages; i++) {
            const senderId = Math.floor(Math.random() * 100000) + 1;
            let receiverId = Math.floor(Math.random() * 100000) + 1;
            while (receiverId === senderId) {
                receiverId = receiverId + 1;
            }

            const randomMessage = messageSamples[Math.floor(Math.random() * messageSamples.length)];
            const timestamp = faker.date.recent(30); // Last 30 days

            await client.query(
                'INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES ($1, $2, $3, $4)',
                [senderId, receiverId, randomMessage, timestamp]
            );
            if (i % 10000 === 0) console.log(`${i} messages inserted`);
        }

        await client.query('COMMIT');
        console.log('Seeding completed!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error(e);
    } finally {
        client.release();
    }
}

seed();