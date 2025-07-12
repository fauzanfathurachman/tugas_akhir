const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Send registration confirmation email
  async sendRegistrationConfirmation(student) {
    const { personalData, registrationNumber } = student;
    
    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to: personalData.email,
      subject: `Konfirmasi Pendaftaran - ${registrationNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>MTs Ulul Albab</h1>
            <h2>Konfirmasi Pendaftaran Online</h2>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Assalamu'alaikum Warrahmatullahi Wabarakatuh,</p>
            
            <p>Terima kasih telah mendaftar di MTs Ulul Albab. Berikut adalah detail pendaftaran Anda:</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="color: #333; margin-top: 0;">Informasi Pendaftaran</h3>
              <p><strong>Nomor Pendaftaran:</strong> ${registrationNumber}</p>
              <p><strong>Nama Lengkap:</strong> ${personalData.fullName}</p>
              <p><strong>Email:</strong> ${personalData.email}</p>
              <p><strong>Status:</strong> <span style="color: #28a745;">Draft</span></p>
            </div>
            
            <p><strong>Langkah selanjutnya:</strong></p>
            <ol>
              <li>Lengkapi semua data yang diperlukan</li>
              <li>Upload dokumen persyaratan</li>
              <li>Submit pendaftaran</li>
              <li>Pantau status pendaftaran melalui nomor pendaftaran</li>
            </ol>
            
            <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h4 style="margin-top: 0; color: #1976d2;">Dokumen yang Diperlukan:</h4>
              <ul>
                <li>Akta Kelahiran</li>
                <li>Kartu Keluarga</li>
                <li>Ijazah/SKL SD/MI</li>
                <li>Foto 3x4</li>
                <li>Surat Keterangan Sehat</li>
              </ul>
            </div>
            
            <p>Untuk melacak status pendaftaran, silakan kunjungi:</p>
            <p style="text-align: center;">
              <a href="${process.env.APP_URL}/tracking/${registrationNumber}" 
                 style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Lacak Status Pendaftaran
              </a>
            </p>
            
            <p>Jika Anda memiliki pertanyaan, silakan hubungi kami di:</p>
            <p>📧 Email: info@mtsululalbab.sch.id<br>
               📞 Telepon: (021) 1234-5678</p>
            
            <p>Wassalamu'alaikum Warrahmatullahi Wabarakatuh</p>
            
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              Email ini dikirim otomatis. Mohon tidak membalas email ini.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Email konfirmasi berhasil dikirim' };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, message: 'Gagal mengirim email konfirmasi' };
    }
  }

  // Send status update notification
  async sendStatusUpdate(student, newStatus, notes = '') {
    const { personalData, registrationNumber } = student;
    
    const statusMessages = {
      'Submitted': 'Pendaftaran telah berhasil disubmit dan sedang dalam proses review',
      'Under Review': 'Pendaftaran sedang dalam proses review oleh tim admin',
      'Approved': 'Selamat! Pendaftaran Anda telah disetujui',
      'Rejected': 'Mohon maaf, pendaftaran Anda tidak dapat disetujui',
      'Waitlisted': 'Pendaftaran Anda telah masuk dalam daftar tunggu'
    };

    const statusColors = {
      'Submitted': '#17a2b8',
      'Under Review': '#ffc107',
      'Approved': '#28a745',
      'Rejected': '#dc3545',
      'Waitlisted': '#6c757d'
    };

    const mailOptions = {
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to: personalData.email,
      subject: `Update Status Pendaftaran - ${registrationNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1>MTs Ulul Albab</h1>
            <h2>Update Status Pendaftaran</h2>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <p>Assalamu'alaikum Warrahmatullahi Wabarakatuh,</p>
            
            <p>Status pendaftaran Anda telah diperbarui:</p>
            
            <div style="background: white; padding: 15px; border-radius: 5px; margin: 15px 0;">
              <h3 style="color: #333; margin-top: 0;">Detail Status</h3>
              <p><strong>Nomor Pendaftaran:</strong> ${registrationNumber}</p>
              <p><strong>Nama:</strong> ${personalData.fullName}</p>
              <p><strong>Status Baru:</strong> 
                <span style="color: ${statusColors[newStatus]}; font-weight: bold;">${newStatus}</span>
              </p>
              <p><strong>Pesan:</strong> ${statusMessages[newStatus]}</p>
              ${notes ? `<p><strong>Catatan:</strong> ${notes}</p>` : ''}
            </div>
            
            <p style="text-align: center;">
              <a href="${process.env.APP_URL}/tracking/${registrationNumber}" 
                 style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Lihat Detail Lengkap
              </a>
            </p>
            
            <p>Wassalamu'alaikum Warrahmatullahi Wabarakatuh</p>
            
            <hr style="margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              Email ini dikirim otomatis. Mohon tidak membalas email ini.
            </p>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Email update status berhasil dikirim' };
    } catch (error) {
      console.error('Email sending error:', error);
      return { success: false, message: 'Gagal mengirim email update status' };
    }
  }
}

module.exports = new EmailService(); 