function strTo32bit(dataString) {
    // Mengonversi string menjadi Uint8Array dengan format serialisasi yang dijelaskan pada teks sebelumnya
    const encoder = new TextEncoder();
    const bytes = encoder.encode(dataString);
    const length = bytes.length;
    const paddingLength = (length % 4 === 0) ? 0 : (4 - length % 4);
    const totalLength = length + paddingLength;
    const paddedBytes = new Uint8Array(totalLength);
    paddedBytes.set(bytes);
    console.log(paddedBytes);

    // Mengonversi Uint8Array menjadi urutan bilangan bulat 32-bit dengan urutan byte yang kecil di ujung
    const integers = [];
    for (let i = 0; i < totalLength; i += 4) {
        const byteView = new DataView(paddedBytes.buffer, i, 4);
        integers.push(byteView.getInt32(0, true));
    }

    return integers;
}

module.exports = strTo32bit