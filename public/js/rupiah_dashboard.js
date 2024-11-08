document.addEventListener("DOMContentLoaded", function() {
    const currencyElements = document.querySelectorAll(".currency");
    
    currencyElements.forEach(currencyElement => {
        const amount = parseInt(currencyElement.innerText.replace('Rp.', '').trim());
        
        // Format the number as Rupiah
        const formattedAmount = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);

        // Update the content with the formatted currency
        currencyElement.innerText = formattedAmount;
    });
});
