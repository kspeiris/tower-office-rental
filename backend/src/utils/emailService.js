const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendInquiryNotification(inquiry, floor) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@towerspace.com',
      to: process.env.ADMIN_EMAIL || 'admin@towerspace.com',
      subject: `New Inquiry: Floor ${floor.floorNumber} - ${floor.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Inquiry Received</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b;">Inquiry Details</h3>
            <p><strong>Name:</strong> ${inquiry.name}</p>
            <p><strong>Email:</strong> ${inquiry.email}</p>
            <p><strong>Phone:</strong> ${inquiry.phone}</p>
            ${inquiry.company ? `<p><strong>Company:</strong> ${inquiry.company}</p>` : ''}
            <p><strong>Preferred Contact:</strong> ${inquiry.preferredContact}</p>
            ${inquiry.budget ? `<p><strong>Budget:</strong> $${inquiry.budget.toLocaleString()}</p>` : ''}
            ${inquiry.moveInDate ? `<p><strong>Move-in Date:</strong> ${new Date(inquiry.moveInDate).toLocaleDateString()}</p>` : ''}
          </div>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1;">Floor Information</h3>
            <p><strong>Floor:</strong> ${floor.floorNumber}</p>
            <p><strong>Name:</strong> ${floor.name}</p>
            <p><strong>Area:</strong> ${floor.area.toLocaleString()} sq ft</p>
            <p><strong>Price:</strong> $${floor.totalPrice.toLocaleString()}/year</p>
          </div>

          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #7f1d1d;">Message</h3>
            <p>${inquiry.message}</p>
            ${inquiry.additionalNotes ? `
              <h4 style="color: #7f1d1d;">Additional Notes:</h4>
              <p>${inquiry.additionalNotes}</p>
            ` : ''}
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
            <p>Submitted: ${new Date(inquiry.createdAt).toLocaleString()}</p>
            <p>IP Address: ${inquiry.ipAddress || 'N/A'}</p>
            <a href="${process.env.ADMIN_URL}/admin/inquiries/${inquiry._id}" 
               style="display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
              View in Dashboard
            </a>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Inquiry notification email sent');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendInquiryConfirmation(inquiry, floor) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@towerspace.com',
      to: inquiry.email,
      subject: `Thank you for your inquiry - Floor ${floor.floorNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Your Inquiry</h2>
          
          <p>Dear ${inquiry.name},</p>
          
          <p>Thank you for your interest in Floor ${floor.floorNumber} at TowerSpace. We have received your inquiry and will contact you within 24 hours.</p>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1;">Inquiry Summary</h3>
            <p><strong>Reference ID:</strong> ${inquiry._id.toString().slice(-8)}</p>
            <p><strong>Floor:</strong> ${floor.floorNumber} - ${floor.name}</p>
            <p><strong>Submitted:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> Received</p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b;">What happens next?</h3>
            <ol>
              <li>Our leasing team will review your inquiry</li>
              <li>We'll contact you to schedule a personal tour</li>
              <li>Discuss leasing options and pricing</li>
              <li>Provide any additional information you need</li>
            </ol>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
            <p><strong>Contact Information:</strong></p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Email: leasing@towerspace.com</p>
            <p>Hours: Monday-Friday, 9:00 AM - 6:00 PM</p>
          </div>

          <p style="margin-top: 30px; color: #64748b; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Inquiry confirmation email sent');
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  }

  async sendStatusUpdate(inquiry, floor, oldStatus, newStatus) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@towerspace.com',
      to: inquiry.email,
      subject: `Update on your inquiry for Floor ${floor.floorNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Inquiry Status Update</h2>
          
          <p>Dear ${inquiry.name},</p>
          
          <p>The status of your inquiry for Floor ${floor.floorNumber} has been updated.</p>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0369a1;">Status Change</h3>
            <p><strong>From:</strong> ${oldStatus}</p>
            <p><strong>To:</strong> ${newStatus}</p>
            <p><strong>Updated:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b;">Floor Details</h3>
            <p><strong>Floor:</strong> ${floor.floorNumber}</p>
            <p><strong>Name:</strong> ${floor.name}</p>
            <p><strong>Area:</strong> ${floor.area.toLocaleString()} sq ft</p>
            <p><strong>Price:</strong> $${floor.totalPrice.toLocaleString()}/year</p>
          </div>

          ${inquiry.responseNotes ? `
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #7f1d1d;">Notes from our team:</h3>
              <p>${inquiry.responseNotes}</p>
            </div>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e2e8f0;">
            <p>If you have any questions, please contact our leasing team:</p>
            <p>Phone: +1 (555) 123-4567 | Email: leasing@towerspace.com</p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Status update email sent');
    } catch (error) {
      console.error('Error sending status update email:', error);
    }
  }
}

module.exports = new EmailService();