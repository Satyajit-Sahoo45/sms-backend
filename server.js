const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS package
const twilio = require('twilio');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes


const client = new twilio(process.env.TWILLIO_ACCOUNT_ID, process.env.TWILLIO_AUTH_TOKEN);

// Nodemailer credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_EMAIL_PASS_KEY
    }
});

app.post('/book-now', (req, res) => {
    const { phoneNumber, email, bookingDetails } = req.body;

    // Send SMS
    client.messages.create({
        body: `Your booking is confirmed! Details: ${bookingDetails}`,
        to: phoneNumber,
        from: '+12084273175'
    })
        .then((message) => {
            console.log(`SMS sent! SID: ${message.sid}`);
        })
        .catch((err) => {
            console.error('Failed to send SMS:', err.message);
            return res.status(500).json({ message: 'Failed to send SMS' });
        });

    // Send Email
    const mailOptions = {
        from: 'vamsikrishnanandhyala2559@gmail.com',
        to: email,
        subject: 'Booking Confirmation',
        text: `Your booking is confirmed! Details: ${bookingDetails}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Failed to send email:', error.message);
            return res.status(500).json({ message: 'Failed to send email' });
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Booking confirmed! SMS and email sent.' });
        }
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
