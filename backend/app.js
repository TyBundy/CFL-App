process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
    origin: "https://main--magnificent-biscotti-63396d.netlify.app",
    optionsSuccessStatus: 200
}));


// Database connection
mongoose.connect(process.env.MONGODB_URI, { //process.env relates to variables declared in the .env file
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

mongoose.connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Routes
app.use('/api', require('./routes'));

// Start server
app.listen(process.env.DB_PORT, () => {
    console.log(`Server is running on port ${process.env.DB_PORT}`);
})