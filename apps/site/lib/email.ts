/**
 * Email Service - SendGrid/Postmark/Resend integration
 * Sends transactional emails with Aspire branding
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: EmailOptions) {
  // If no email service configured, log and return
  if (!process.env.SENDGRID_API_KEY && !process.env.POSTMARK_API_TOKEN) {
    console.log('📧 Email would be sent:', {
      to: options.to,
      subject: options.subject,
    })
    return { success: true, mode: 'development' }
  }

  // SendGrid implementation
  if (process.env.SENDGRID_API_KEY) {
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: options.to }] }],
        from: {
          email: process.env.EMAIL_FROM || 'noreply@aspire.com',
          name: 'Aspire Academy',
        },
        subject: options.subject,
        content: [
          { type: 'text/html', value: options.html },
          ...(options.text ? [{ type: 'text/plain', value: options.text }] : []),
        ],
      }),
    })

    return { success: response.ok }
  }

  return { success: false }
}

// Email Templates

export function getWelcomeEmail(name: string) {
  return {
    subject: '🎓 Welcome to Aspire Academy - Your AI Mastery Journey Begins',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Inter, sans-serif; background: #0A0A0A; color: #CFCFCF; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #0A0A0A; padding: 20px; border-radius: 16px; }
          h1 { color: #D4AF37; font-size: 32px; margin: 20px 0; }
          .btn { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #0A0A0A; padding: 16px 32px; text-decoration: none; border-radius: 16px; display: inline-block; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">
              <h1>ASPIRE ACADEMY</h1>
            </div>
          </div>
          
          <h2 style="color: #fff;">Welcome, ${name}!</h2>
          
          <p>You've just taken the first step toward AI mastery. We're thrilled to have you in the Aspire community.</p>
          
          <p><strong>What's next:</strong></p>
          <ul>
            <li>Browse our comprehensive course catalog</li>
            <li>Start with AI Foundations if you're new</li>
            <li>Join our Discord community</li>
            <li>Set your learning goals in your dashboard</li>
          </ul>
          
          <center>
            <a href="${process.env.NEXTAUTH_URL}/courses" class="btn">Start Learning Now</a>
          </center>
          
          <p>Questions? Reply to this email or reach us at support@aspire.com</p>
          
          <div class="footer">
            <p>Aspire Academy - AI Mastery from Zero to God-Mode</p>
            <p>${process.env.NEXTAUTH_URL}</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Aspire Academy, ${name}! Start your AI mastery journey at ${process.env.NEXTAUTH_URL}/courses`,
  }
}

export function getCertificateEmail(name: string, courseName: string, certificateUrl: string) {
  return {
    subject: `🎉 Congratulations! You've earned your ${courseName} Certificate`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Inter, sans-serif; background: #0A0A0A; color: #CFCFCF; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); padding: 40px; border-radius: 16px; }
          h1 { color: #0A0A0A; font-size: 36px; margin: 0; }
          .btn { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #0A0A0A; padding: 16px 32px; text-decoration: none; border-radius: 16px; display: inline-block; font-weight: bold; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏆 CERTIFICATE EARNED!</h1>
          </div>
          
          <h2 style="color: #fff;">Congratulations, ${name}!</h2>
          
          <p>You've successfully completed <strong style="color: #D4AF37;">${courseName}</strong> at Aspire Academy.</p>
          
          <p>This is a major accomplishment. You've mastered skills that will transform your career and open new opportunities.</p>
          
          <center>
            <a href="${certificateUrl}" class="btn">Download Your Certificate</a>
          </center>
          
          <p><strong>Share your achievement:</strong></p>
          <ul>
            <li>Add it to your LinkedIn profile</li>
            <li>Share on social media with #AspireGrad</li>
            <li>Show it to employers</li>
          </ul>
          
          <p>Keep learning. Keep growing. The future is yours.</p>
          
          <p style="color: #D4AF37; font-weight: bold;">- The Overseer</p>
        </div>
      </body>
      </html>
    `,
    text: `Congratulations ${name}! You've earned your ${courseName} certificate. Download it at ${certificateUrl}`,
  }
}

export function getEnrollmentEmail(name: string, courseName: string) {
  return {
    subject: `✅ Enrolled in ${courseName} - Let's Begin!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Inter, sans-serif; background: #0A0A0A; color: #CFCFCF; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          h1 { color: #D4AF37; }
          .btn { background: linear-gradient(135deg, #D4AF37 0%, #B8860B 100%); color: #0A0A0A; padding: 16px 32px; text-decoration: none; border-radius: 16px; display: inline-block; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>You're In! 🎉</h1>
          <p>Hey ${name},</p>
          <p>You're now enrolled in <strong>${courseName}</strong>. Time to level up.</p>
          <center>
            <a href="${process.env.NEXTAUTH_URL}/courses" class="btn">Start First Lesson</a>
          </center>
        </div>
      </body>
      </html>
    `,
  }
}



