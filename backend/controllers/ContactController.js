const contactModel = require('../models/contact');

module.exports.submitContactForm = async (req, res) => {
    try {        
        const { name, email, subject, message } = req.body;

        const newContact = new contactModel({ name, email, subject, message });
        await newContact.save();

        res.status(201).json({ success: true, message: "we will contact you soon thanks for contact us" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: "An error occurred while submitting the contact form." });
    }
}