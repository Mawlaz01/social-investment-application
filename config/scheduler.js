const cron = require('node-cron');
const WhatsAppService = require('../services/whatsappService');

cron.schedule('0 9 * * *', async () => {
    console.log('Menjalankan pengingat harian untuk validasi kontribusi...');
    try {
        await WhatsAppService.sendValidationReminder();
        console.log('Pengingat harian terkirim.');
    } catch (error) {
        console.error('Gagal mengirim pengingat harian:', error.message);
    }
});

console.log('Cron job untuk pengingat harian dijadwalkan.');
