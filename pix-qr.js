const qrcode = require('qrcode-generator');

function cleanAscii(value, maxLength) {
    const cleaned = String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-Z0-9 ]/g, ' ')
        .trim()
        .replace(/\s+/g, ' ');

    if (cleaned.length <= maxLength) return cleaned;

    const words = cleaned.split(' ');
    let result = '';
    for (const word of words) {
        const candidate = result ? result + ' ' + word : word;
        if (candidate.length > maxLength) break;
        result = candidate;
    }
    return result || cleaned.slice(0, maxLength);
}

function tlv(id, value) {
    const text = String(value);
    if (text.length > 99) throw new Error('Campo Pix excede o limite do formato.');
    return String(id).padStart(2, '0') + String(text.length).padStart(2, '0') + text;
}

function crc16Ccitt(value) {
    let crc = 0xFFFF;
    for (let i = 0; i < value.length; i++) {
        crc ^= value.charCodeAt(i) << 8;
        for (let bit = 0; bit < 8; bit++) {
            crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
            crc &= 0xFFFF;
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

function buildPixPayload({ key, amount, merchantName, merchantCity, txid }) {
    const pixKey = String(key ?? '').trim();
    const amountNumber = Number(amount);
    if (!pixKey) throw new Error('A chave Pix não foi configurada.');
    if (!Number.isFinite(amountNumber) || amountNumber <= 0) throw new Error('O valor do Pix é inválido.');
    if (!/^[A-Za-z0-9@.+\-_]+$/.test(String(txid ?? '')) || String(txid).length > 25) {
        throw new Error('A referência do Pix é inválida.');
    }

    const merchant = cleanAscii(merchantName, 25);
    const city = cleanAscii(merchantCity, 15);
    if (!merchant || !city) throw new Error('Os dados do recebedor do Pix estão incompletos.');

    const merchantAccount = tlv('00', 'BR.GOV.BCB.PIX') + tlv('01', pixKey);
    const additionalData = tlv('05', String(txid));
    const amountText = amountNumber.toFixed(2);

    const payloadWithoutCrc =
        tlv('00', '01') +
        tlv('01', '11') +
        tlv('26', merchantAccount) +
        tlv('52', '0000') +
        tlv('53', '986') +
        tlv('54', amountText) +
        tlv('58', 'BR') +
        tlv('59', merchant) +
        tlv('60', city) +
        tlv('62', additionalData) +
        '6304';

    return payloadWithoutCrc + crc16Ccitt(payloadWithoutCrc);
}

function qrDataUrl(value, cellSize = 6, margin = 4) {
    const qr = qrcode(0, 'M');
    qr.addData(String(value), 'Byte');
    qr.make();
    return qr.createDataURL(cellSize, margin);
}

const api = { buildPixPayload, qrDataUrl, crc16Ccitt, cleanAscii };
if (typeof window !== 'undefined') window.SanjaPixQR = api;
if (typeof module !== 'undefined' && module.exports) module.exports = api;
