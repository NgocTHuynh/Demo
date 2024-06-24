const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const port = 3001;

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'asa.html'));
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Hardcoded email address to send OTP
const email = 'hongngochuynh2001@gmail.com';

// Store OTP in memory (for demo purposes, use a database in production)
let otp;

// Send OTP via email
app.post('/send-otp', (req, res) => {
    otp = generateOTP();

    // Gmail SMTP configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'besuesan@gmail.com',
            pass: 'cuaxlxyselfqgnzd'
        }
    });

    // Email options
    const mailOptions = {
        from: 'besuesan@gmail.com',
        to: email,
        subject: 'Your OTP',
        text: `Your OTP is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ success: false, message: 'Failed to send OTP' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ success: true, message: 'OTP sent to your email. Check your inbox!' });
        }
    });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const { userOTP } = req.body;

    if (userOTP === otp) {
        res.json({ success: true, message: 'OTP verified successfully' });
    } else {
        res.json({ success: false, message: 'Incorrect OTP. Please try again' });
    }
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
