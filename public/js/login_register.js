const container = document.getElementById('container');
const loginBtn = document.getElementById('login');
const registerBtn = document.getElementById('register');

loginBtn.addEventListener('click', () => {
    container.classList.add("active");
});

registerBtn.addEventListener('click', () => {
    container.classList.remove("active");
});
loginForm.addEventListener('submit', (e) => {
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;
    
    // Validasi email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email || !email.match(emailPattern)) {
        e.preventDefault();
        alert("Email tidak valid!");
        return;
    }

    // Validasi password
    if (!password || password.length < 6) {
        e.preventDefault();
        alert("Password harus memiliki minimal 6 karakter!");
        return;
    }
    
    // Jika semua validasi lolos, form akan diteruskan
});

document.getElementById('foto').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // Maksimal 5MB

    if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;
            document.querySelector('.foto-label').appendChild(img);
        };
        
        reader.readAsDataURL(file);
    } else {
        alert("Tipe file tidak didukung atau ukuran file terlalu besar!");
        event.target.value = ''; // Reset file input
    }
});

