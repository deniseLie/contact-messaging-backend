const express = require('express');
const router = express.Router();
const pool = require('../db');


// Get all conversations
router.get('/', async (req, res) => {
    const query = `
        SELECT * 
        FROM messages
        LIMIT 10
    `
    try {
        const result = await pool.query(query, [contact_id, offset, limit]);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).send('Query failed');
    }
})

// Get /conversations?page=1
router.get('/recent/', async (req, res) => {
    const contact_id = req.query.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    // Query retrieve 50 most recent conversations
    const query = `
        WITH latest_messages AS (
            SELECT DISTINCT ON (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
                id,
                sender_id,
                receiver_id,
                content,
                created_at
            FROM messages
            WHERE sender_id = $1 OR receiver_id = $1
            ORDER BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), created_at DESC
        )
        SELECT *
        FROM latest_messages
        ORDER BY created_at DESC
        OFFSET $2 LIMIT $3
    `;

    try {
        const result = await pool.query(query, [contact_id, offset, limit]);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).send('Query failed');
    }
});

router.get('/search', async (req, res) => {
    const searchValue = req.query.searchValue || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const query = `
        SELECT 
            m.*,
            c.name AS contact_name,
            c.phone_number AS contact_phone_number
        FROM messages m
        JOIN contacts c ON (c.id = m.sender_id OR c.id = m.receiver_id)
        WHERE (
            to_tsvector('english', m.content) @@ to_tsquery('english', $1) OR 
            to_tsvector('english', c.name) @@ to_tsquery('english', $1) OR
            c.phone_number = $2 --exact search
        )
        ORDER BY m.created_at DESC
        OFFSET $3 LIMIT $4
    `;

    try {
        const result = await pool.query(query, [`%${searchValue}%`, searchValue, offset, limit]);
        res.json(result.rows);
        console.log(result.rows)
    } catch (e) {
        console.error(e);
        res.status(500).send('Query failed');
    }
})

module.exports = router;