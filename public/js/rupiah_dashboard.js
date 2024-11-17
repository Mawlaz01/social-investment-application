document.addEventListener("DOMContentLoaded", function() {
    const currencyElements = document.querySelectorAll(".currency");
    
    currencyElements.forEach(currencyElement => {
        const amount = parseInt(currencyElement.innerText.replace('Rp.', '').trim());
        
        const formattedAmount = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);

        currencyElement.innerText = formattedAmount;
    });
});
