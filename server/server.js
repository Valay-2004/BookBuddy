const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
