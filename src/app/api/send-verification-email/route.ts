import nodemailer from "nodemailer";
export async function POST(request: Request) {
    const { email, verifyCode, username } = await request.json();
    const transporter = nodemailer.createTransport({
        host:'smtp.gmail.com',
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `Blog Creator<${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Verify Your Email",
        html: `<div style="font-family: sans-serif; color: #4a5568;">
    <h1 style="font-size: 1.5rem; font-weight: bold; color: #38a169;">Welcome, ${username}!</h1>
    <p style="font-size: 1.125rem; margin-top: 1rem;">
      Thank you for signing up. Please use the following verification code to complete your registration:
    </p>
    <p style="font-size: 1.25rem; font-weight: 600; color: #dd6b20; margin-top: 0.5rem;">${verifyCode}</p>
    <p style="font-size: 0.875rem; color: #718096; margin-top: 1.5rem;">
      If you did not request this, please ignore this email.
    </p>
    <p style="margin-top: 2rem;">
      Best regards,<br />
      The BlogCreator Team
    </p>
  </div>`,
    };
    try {
        await transporter.sendMail(mailOptions);
        return Response.json(
            {
                message: "Email sent Success",
                success: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending email:', error);
    return Response.json(
        {
            message: "Email sent Error",
            success: false,
        },
        { status: 500 }
    );
    }
}
