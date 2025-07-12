const twilio = require('twilio');

class SMSService {
  constructor() {
    this.client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  // Send registration confirmation SMS
  async sendRegistrationConfirmation(student) {
    const { personalData, registrationNumber } = student;
    
    const message = `Assalamu'alaikum. Terima kasih telah mendaftar di MTs Ulul Albab.

📋 Nomor Pendaftaran: ${registrationNumber}
👤 Nama: ${personalData.fullName}
📧 Email: ${personalData.email}

Langkah selanjutnya:
1. Lengkapi data pendaftaran
2. Upload dokumen persyaratan
3. Submit pendaftaran
4. Pantau status di: ${process.env.APP_URL}/tracking/${registrationNumber}

Untuk bantuan: (021) 1234-5678

Wassalamu'alaikum`;

    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: personalData.phoneNumber
      });
      
      return { success: true, message: 'SMS konfirmasi berhasil dikirim' };
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, message: 'Gagal mengirim SMS konfirmasi' };
    }
  }

  // Send status update SMS
  async sendStatusUpdate(student, newStatus, notes = '') {
    const { personalData, registrationNumber } = student;
    
    const statusMessages = {
      'Submitted': 'Pendaftaran berhasil disubmit dan sedang dalam review',
      'Under Review': 'Pendaftaran sedang dalam proses review',
      'Approved': 'Selamat! Pendaftaran Anda telah disetujui',
      'Rejected': 'Mohon maaf, pendaftaran tidak dapat disetujui',
      'Waitlisted': 'Pendaftaran masuk dalam daftar tunggu'
    };

    let message = `Assalamu'alaikum. Update status pendaftaran MTs Ulul Albab.

📋 Nomor: ${registrationNumber}
👤 Nama: ${personalData.fullName}
📊 Status: ${newStatus}
💬 Pesan: ${statusMessages[newStatus]}`;

    if (notes) {
      message += `\n📝 Catatan: ${notes}`;
    }

    message += `\n\nDetail lengkap: ${process.env.APP_URL}/tracking/${registrationNumber}

Wassalamu'alaikum`;

    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: personalData.phoneNumber
      });
      
      return { success: true, message: 'SMS update status berhasil dikirim' };
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, message: 'Gagal mengirim SMS update status' };
    }
  }

  // Send reminder SMS for incomplete registration
  async sendReminder(student) {
    const { personalData, registrationNumber } = student;
    
    const message = `Assalamu'alaikum. Pengingat pendaftaran MTs Ulul Albab.

📋 Nomor: ${registrationNumber}
👤 Nama: ${personalData.fullName}

Pendaftaran Anda belum lengkap. Silakan:
1. Lengkapi data yang masih kosong
2. Upload dokumen persyaratan
3. Submit pendaftaran

Lanjutkan di: ${process.env.APP_URL}/registration/${registrationNumber}

Batas waktu: 7 hari dari sekarang

Wassalamu'alaikum`;

    try {
      await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: personalData.phoneNumber
      });
      
      return { success: true, message: 'SMS pengingat berhasil dikirim' };
    } catch (error) {
      console.error('SMS sending error:', error);
      return { success: false, message: 'Gagal mengirim SMS pengingat' };
    }
  }
}

module.exports = new SMSService(); 