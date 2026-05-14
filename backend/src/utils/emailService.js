import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';
// Create the transporter instance
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // Use true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendContactEmail = async (contactData) => {
  try {
    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      console.error('Missing required contact form fields');
      return { success: false, message: 'All fields are required' };
    }

    // Log email configuration for debugging
    console.log('Email Configuration:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER ? 'Present' : 'Missing',
      recipientEmail: process.env.CONTACT_RECIPIENT_EMAIL
    });

    const mailOptions = {
      from: `"${contactData.name}" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECIPIENT_EMAIL,
      replyTo: contactData.email,
      subject: 'New Contact Form Submission',
      html: `
    <h3>New Contact Message</h3>
    <p><strong>Name:</strong> ${contactData.name}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Message:</strong> ${contactData.message}</p>
    <p>Received at: ${new Date().toLocaleString()}</p>
  `
    };

    // Send email with detailed error handling
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info);

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    };
  } catch (error) {
    console.error('Detailed Email Sending Error:', {
      name: error.name,
      message: error.message,
      code: error.code,
      response: error.response,
      stack: error.stack
    });
    return {
      success: false,
      message: 'Failed to send email',
      errorDetails: {
        name: error.name,
        message: error.message
      }
    };
  }
};
