/**
 * Email service - gửi thông tin đăng nhập cho user.
 * Cấu hình SMTP qua env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
 * Nếu không cấu hình thì chỉ log ra console (development).
 */

let transporter = null;

async function getTransporter() {
    if (transporter) return transporter;
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) {
        return null;
    }
    try {
        const nodemailer = await import('nodemailer');
        transporter = nodemailer.default.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
        return transporter;
    } catch (e) {
        console.warn('Nodemailer not installed or SMTP not configured. Run: npm install nodemailer');
        return null;
    }
}

export async function sendCredentialsEmail(toEmail, fullName, email, password) {
    const from = process.env.MAIL_FROM || process.env.SMTP_USER || 'noreply@course.local';
    const subject = 'Thông tin đăng nhập - Hệ thống quản lý trung tâm';
    const text = `Xin chào ${fullName},\n\nTài khoản của bạn đã được tạo.\nEmail: ${email}\nMật khẩu: ${password}\n\nVui lòng đăng nhập và đổi mật khẩu nếu cần.`;
    const html = `<p>Xin chào <b>${fullName}</b>,</p><p>Tài khoản của bạn đã được tạo.</p><p><b>Email:</b> ${email}<br/><b>Mật khẩu:</b> ${password}</p><p>Vui lòng đăng nhập và đổi mật khẩu nếu cần.</p>`;
    const transport = await getTransporter();
    if (transport) {
        await transport.sendMail({ from, to: toEmail, subject, text, html });
        return true;
    }
    console.log('[Email stub] Send credentials to', toEmail, ':', { email, password: '***' });
    return false;
}
