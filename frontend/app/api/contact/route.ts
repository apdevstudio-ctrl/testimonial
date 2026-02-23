import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// POST /api/contact - Send contact form email
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, mobile, question } = body;

    // Validate required fields
    if (!name || !email || !mobile || !question) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Prepare email content
    const emailSubject = `Contact Form Submission from ${name}`;
    const emailBody = `
New Contact Form Submission

Name: ${name}
Email: ${email}
Mobile: ${mobile}

Question/Message:
${question}

---
This message was sent from the TestiFlow contact form.
Reply to: ${email}
    `.trim();

    // Gmail SMTP configuration
    const gmailUser = process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPassword) {
      console.error('Gmail credentials not configured');
      // Log the submission even if email fails
      console.log('📧 Contact Form Submission (Email not sent):', {
        to: 'apdevstudion@gmail.com',
        from: email,
        subject: emailSubject,
        body: emailBody,
      });
      
      return NextResponse.json({
        message: 'Message received. We will get back to you soon!',
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPassword, // Use App Password, not regular password
      },
    });

    // Send email
    const mailOptions = {
      from: `TestiFlow Contact <${gmailUser}>`,
      to: 'apdevstudion@gmail.com',
      replyTo: email,
      subject: emailSubject,
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4f46e5;">New Contact Form Submission</h2>
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Mobile:</strong> ${mobile}</p>
          </div>
          <div style="background: #ffffff; padding: 20px; border-left: 4px solid #4f46e5; margin: 20px 0;">
            <h3 style="margin-top: 0;">Question/Message:</h3>
            <p style="white-space: pre-wrap;">${question}</p>
          </div>
          <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">
            This message was sent from the TestiFlow contact form.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      message: 'Message sent successfully. We will get back to you soon!',
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    
    // Log the submission even if email fails
    console.log('📧 Contact Form Submission (Email failed):', {
      to: 'apdevstudion@gmail.com',
      error: error.message,
    });

    return NextResponse.json(
      { message: 'Message received. We will get back to you soon!' },
      { status: 200 } // Return 200 so user sees success message
    );
  }
}
