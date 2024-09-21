function onClickTipoMovimentacao() {
    toggleFieldFormaPagamento();
    toggleOptionTipo();
}
function toggleFieldFormaPagamento() {
    console.log('toggleFieldFormaPagamento')

    var tipoReceita = document.getElementById('tipoMovimentacaoReceita');
    var fieldFormaPagamento = document.getElementById('formaPagamento');
    var labelFormaPagamento = document.getElementById('labelFormaPagamento');

    var fieldQuantidadeParcela = document.getElementById('quantidadeParcercela');
    var labelFieldQuantidadeParcela = document.getElementById('labelQuantidadeParcercela');
    if (tipoReceita.checked) {
        fieldFormaPagamento.style.display = 'none';
        labelFormaPagamento.style.display = 'none';
        fieldQuantidadeParcela.style.display = 'none';
        labelFieldQuantidadeParcela.style.display = 'none';
    } else {
        fieldFormaPagamento.style.display = 'block';
        labelFormaPagamento.style.display = 'block';

        onChangeFormaPagamento();
    }
}

function toggleOptionTipo() {
    console.log('toggleOptionTipo')

    var tipoReceita = document.getElementById('tipoMovimentacaoReceita');
    var labelTextField = document.getElementById('labelTipo');
    if (tipoReceita.checked) {
        labelTextField.innerHTML = 'Tipo Receita';
        updateSelectOptionsTipo(['Salario', 'Extra', 'Presente', 'Outros']);
    } else {
        labelTextField.innerHTML = 'Tipo Despesa';
        updateSelectOptionsTipo(['Comida', 'Mercado', 'Gasolina', 'Roupa', 'Presente', 'Outros']);
    }
}

function updateSelectOptionsTipo(options) {
    console.log('updateSelectOptionsTipo')

    var select = document.getElementById('tipo');
    select.innerHTML = '';  // Limpa as opções atuais

    var placeholderOption = document.createElement('option');
    placeholderOption.text = 'Selecione uma opção';
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    select.add(placeholderOption);

    options.forEach(function (optionText) {
        var option = document.createElement('option');
        option.text = optionText;
        option.value = optionText.toLowerCase();
        select.add(option);
    });
}

function onChangeFormaPagamento() {
    console.log('onChangeFormaPagamento')

    var fieldFormaPagamento = document.getElementById('formaPagamento');
    var selectedOptionFormaPagamento = fieldFormaPagamento.options[fieldFormaPagamento.selectedIndex]?.value;  // Pega o texto da opção selecionada

    var fieldQuantidadeParcela = document.getElementById('quantidadeParcercela');
    var labelFieldQuantidadeParcela = document.getElementById('labelQuantidadeParcercela');
    if (selectedOptionFormaPagamento == 'credito') {
        fieldQuantidadeParcela.style.display = 'block';
        labelFieldQuantidadeParcela.style.display = 'block';
    } else {
        fieldQuantidadeParcela.style.display = 'none';
        labelFieldQuantidadeParcela.style.display = 'none';
    }
}


document.getElementById('formulario').addEventListener('submit', async function (event) {
    await submitForm(event, this);
});
async function submitForm(event, form) {
    console.log('submitForm')

    event.preventDefault();
    try {
        await validateForm();
        await sendData(form)
    } catch (error) {
        throw error;
    }
}
async function validateForm() {
    console.log('validateForm');

    try {
        var responsavelMovimentacaoLarissa = document.getElementById('responsavelMovimentacaoLarissa').checked
        var responsavelMovimentacaoTailon = document.getElementById('responsavelMovimentacaoTailon').checked
        var tipoMovimentacaoDespesa = document.getElementById('tipoMovimentacaoDespesa').checked
        var tipoMovimentacaoReceita = document.getElementById('tipoMovimentacaoReceita').checked
        var tipo = document.getElementById('tipo').value
        var data = document.getElementById('data').value
        var descricao = document.getElementById('descricao').value
        var valor = document.getElementById('valor').value
        var formaPagamento = document.getElementById('formaPagamento').value
        var quantidadeParcercela = document.getElementById('quantidadeParcercela').value

        if (!responsavelMovimentacaoLarissa && !responsavelMovimentacaoTailon) {
            throw new Error('Informe o responsável pela movimentação!');
        }
        if (!valor) {
            throw new Error('Informe o valor!');
        }

        if (tipoMovimentacaoDespesa) {
            if (tipo.toUpperCase() == 'SELECIONE UMA OPÇÃO') {
                throw new Error('Informe o tipo da despesa!');
            }
            if (tipo.toUpperCase() == 'OUTROS' && !descricao) {
                throw new Error('Para o tipo de despesa "Outros" é necessário que se seja informado uma descricao!');
            }
            if (formaPagamento.toUpperCase() == 'SELECIONE UMA OPÇÃO') {
                throw new Error('Informe a forma de pagamento!');
            }
        }
        if (tipoMovimentacaoReceita) {
            if (tipo.toUpperCase() == 'SELECIONE UMA OPÇÃO') {
                throw new Error('Informe o tipo da receita!');
            }
            if (tipo.toUpperCase() == 'OUTROS' && !descricao) {
                throw new Error('Para o tipo de receita "Outros" é necessário que se seja informado uma descricao!');
            }
        }
    } catch (error) {
        alert(error?.message)
        throw error;
    }
}

async function sendData(form) {
    console.log('sendData');

    var formData = new FormData(form);
    document.getElementById('spinner-overlay').style.display = '';
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
            resetFormulario();
        })
        .catch(error => {
            document.getElementById('spinner-overlay').style.display = 'none';
            alert(error?.message)
        }).finally(() => {
            // Esconde o spinner após receber a resposta (sucesso ou erro)
            document.getElementById('spinner-overlay').style.display = 'none';
        });;
}

function resetFormulario(){
    document.getElementById('tipo').value = '';
    document.getElementById('data').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';
    document.getElementById('formaPagamento').value = '';
    document.getElementById('quantidadeParcercela').value = '';
    onChangeFormaPagamento();
}