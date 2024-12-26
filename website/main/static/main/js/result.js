document.getElementById('search-button').addEventListener('click', function () {
    const button = this;
    const loader = document.getElementById('loader');
    const searchInput = document.getElementById('search-input').value.trim();
    document.getElementById('search-input').value = '';  // Очищення поля після введення

    const isValidUrl = /^(https?:\/\/)/i.test(searchInput);

    if (!isValidUrl) {
        alert('Введіть коректне посилання, яке починається з "http://" або "https://"');
        return;
    }

    button.disabled = true;
    loader.style.display = 'inline-block';

    fetch('/process-url/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCSRFToken(),
        },
        body: new URLSearchParams({ url: searchInput }),
    })
        .then(response => {
            loader.style.display = 'none';
            button.disabled = false;

            if (response.ok) {
                return response.blob();
            } else {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'result.txt';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            alert(`Помилка: ${error.message}`);
        });

    // Оновлення тексту результату після 3 секунд
    setTimeout(() => {
        document.getElementById('resultText').textContent = `${searchInput}: Приклад результату`;
    }, 3000);
});

document.getElementById('search-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('search-button').click();
    }
});

function getCSRFToken() {
    const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
    return csrfInput ? csrfInput.value : '';
}
