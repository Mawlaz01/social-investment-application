const jumlahUangInput = document.getElementById('jumlahUang');

jumlahUangInput.addEventListener('keyup', function(e) {
    jumlahUangInput.value = formatRupiah(this.value, 'Rp. ');
});

function formatRupiah(angka, prefix) {
    const numberString = angka.replace(/[^,\d]/g, '').toString();
    const split = numberString.split(',');
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
        const separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
    return prefix == undefined ? rupiah : (rupiah ? prefix + rupiah : '');
}
