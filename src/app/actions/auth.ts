"use server";

import { prisma } from "../../lib/db";
import nodemailer from "nodemailer";

export async function sendOtpAction(email: string) {
  const trimmedEmail = email.toLowerCase().trim();

  // 1. Generate secure 6-digit numeric OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 2. Set expiration date to exactly 5 minutes from now
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  try {
    // Prevent old tokens from being valid by wiping previous entries for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: trimmedEmail },
    });

    // Save token in Postgres
    await prisma.verificationToken.create({
      data: {
        identifier: trimmedEmail,
        token: otp,
        expires,
      },
    });

    // 3. Configure SMTP transporter using Gmail App Password
    const transporter = nodemailer.createTransport({
      host: process.env.AUTH_SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.AUTH_SMTP_PORT || "465"),
      secure: true, // port 465 requires SSL
      auth: {
        user: process.env.AUTH_SMTP_USER,
        pass: process.env.AUTH_SMTP_PASSWORD,
      },
    });

    // 4. Send the verification email
    await transporter.sendMail({
      from: process.env.AUTH_SMTP_FROM || process.env.AUTH_SMTP_USER,
      to: trimmedEmail,
      subject: "fixIT Portal Access Code",
      text: `Your fixIT verification code is: ${otp}. This code is valid for 5 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 4px;">
          <h2 style="color: #0070F3; margin-bottom: 10px;">fixIT Access Verification</h2>
          <p style="color: #475569; font-size: 14px;">Use the verification code below to access your portal. This code is valid for <strong>5 minutes</strong>.</p>
          <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; font-family: monospace; letter-spacing: 4px; border-radius: 4px; margin: 20px 0; color: #0f172a;">
            ${otp}
          </div>
          <p style="color: #94a3b8; font-size: 11px;">If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error: any) {
    console.error("Nodemailer SMTP OTP Send Failure:", error);
    return { success: false, error: error.message || "Failed to transmit access code." };
  }
}