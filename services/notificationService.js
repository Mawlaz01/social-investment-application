const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const Kontribusi = require('../models/Kontribusi');
const User = require('../models/User');

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('QR Code received, scan please!');
});

client.on('ready', () => {
    console.log('WhatsApp Web Client is ready!');
});

client.initialize();

class WhatsAppService {
    static async sendWhatsAppMessage(userId, message) {
        try {
            console.log('Mencari user dengan ID:', userId);
            const user = await User.getById(userId);
            if (!user) throw new Error('User tidak ditemukan.');
            const phoneNumber = user.no_wa;
            if (!phoneNumber) throw new Error('Nomor WhatsApp tidak ditemukan.');

            const formattedPhoneNumber = `62${phoneNumber.slice(1)}@c.us`;

            console.log('Mengirim pesan ke:', formattedPhoneNumber);
            await client.sendMessage(formattedPhoneNumber, message);
            console.log(`Pesan terkirim ke ${formattedPhoneNumber}`);
        } catch (error) {
            console.error('Gagal mengirim pesan WhatsApp:', error.message);
        }
    }

    static async sendValidationReminder() {
        const kontribusiList = await Kontribusi.getUnvalidated();
        const currentDate = new Date();

        for (const kontribusi of kontribusiList) {
            const differenceInDays = Math.floor((currentDate - new Date(kontribusi.tanggal_sumbangan)) / (1000 * 60 * 60 * 24));
            console.log(`Memeriksa kontribusi ID: ${kontribusi.id_kontribusi}, ${differenceInDays} hari sejak sumbangan.`);
            if (differenceInDays < 7) { 
                await this.sendWhatsAppMessage(kontribusi.id_penyumbang, 'Pengingat: Silakan validasi kontribusi Anda.');
            }
        }
    }
}

module.exports = WhatsAppService;
