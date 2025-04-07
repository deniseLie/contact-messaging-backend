const express = require('express');
const conversationsRouter = require('./routes/conversations');

require('dotenv').config()

const app = express();

app.use('/conversations', conversationsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));