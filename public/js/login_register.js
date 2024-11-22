document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('container');
    const loginBtn = document.getElementById('login');
    const registerBtn = document.getElementById('register');

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    document.getElementById('foto').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; 

        if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.classList.add('uploaded-foto'); 
                const label = document.querySelector('.foto-label');
                if (label) {
                    label.innerHTML = '';
                    label.appendChild(img);
                } else {
                    console.error("Elemen label foto tidak ditemukan.");
                }
            };

            reader.readAsDataURL(file);
        } else {
            alert("Tipe file tidak didukung atau ukuran file terlalu besar!");
            event.target.value = ''; 
        }
    });
});