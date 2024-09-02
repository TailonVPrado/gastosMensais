// document.getElementById('dataForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const name = document.getElementById('name').value;
//     const email = document.getElementById('email').value;

//     // Enviar os dados para uma planilha
//     fetch('https://api.sheety.co/YOUR_PROJECT_ID/your_endpoint', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             yourData: {
//                 name: name,
//                 email: email
//             }
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         console.log('Success:', data);
//         alert('Dados enviados com sucesso!');
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//         alert('Erro ao enviar dados.');
//     });
// });
