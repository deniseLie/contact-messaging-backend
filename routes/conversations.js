const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get /conversations?page=1
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 50;
    const offset = (page - 1) * limit;

    const query = `
        SELECT *
        FROM messages m
    `

    try {
        const result = await pool.query(query, [offset, limit]);
        res.json(result.rows);
    } catch (e) {
        console.error(e);
        res.status(500).send('Query failed');
    }
});

module.exports = router;