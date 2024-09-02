document.getElementById('dataForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o envio padrão do formulário

    // Captura os dados do formulário
    var formData = new FormData(this);

    // Envia os dados via AJAX usando fetch
    fetch('https://script.google.com/macros/s/AKfycbzOPJsRuvCP-WlSFAM0_JEWzKO1MEsq_aQ0uA1ZTrmeXqXMLXtFt_iPWOlvKsihC2p_KA/exec', {
        method: 'POST',
        body: formData,
    })
    .then(response => response.json())
    .then(data => {
        var responseMessage = document.getElementById('responseMessage');
        responseMessage.textContent = "Sucesso: " + data.message;

        // Apaga os campos do formulário após o sucesso
        document.getElementById('dataForm').reset();

        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            responseMessage.textContent = '';
        }, 3000);
    })
    .catch(error => {
        document.getElementById('responseMessage').textContent = "Ocorreu um erro: " + error.message;
    });
});
