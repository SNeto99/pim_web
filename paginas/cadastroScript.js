const ENDPOINT = "./users";


$(document).ready(function() {
    // Valida as senhas quando o campo de confirmação de senha é alterado
    $('#confirmPasswordInput, #passwordInput').on('input blur', function() {
        var password = $('#passwordInput').val();
        var confirmPassword = $("#confirmPasswordInput").val();

        // Verifica se as senhas são iguais
        if (password !== confirmPassword) {
            // Mostra um aviso se as senhas não coincidirem
            $('#passwordMatchError').text('As senhas não coincidem.').css('color', 'red');
            $('#cadastroForm button[type="submit"]').prop('disabled', true); // Desativa o botão de submit
        } else {
            // Limpa o aviso se as senhas coincidirem
            $('#passwordMatchError').text('');
            $('#cadastroForm button[type="submit"]').prop('disabled', false); // Ativa o botão de submit
        }
    });
})

function togglePasswordVisibility(inputId) {
    var input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        // Muda o ícone para "olho fechado"
        input.nextElementSibling.classList.add("fa-eye-slash");
        input.nextElementSibling.classList.remove("fa-eye");
    } else {
        input.type = "password";
        // Muda o ícone para "olho aberto"
        input.nextElementSibling.classList.remove("fa-eye-slash");
        input.nextElementSibling.classList.add("fa-eye");
    }
}


$(document).on("submit", "#cadastroForm", function (event) {
    event.preventDefault();

    var formDataArray = $(this).serializeArray(); 
    var formData = formDataArray.reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    var jsonFormData = JSON.stringify(formData);

    $.ajax({
        url: ENDPOINT + "/newUser",
        type: "POST",
        contentType: "application/json",
        data: jsonFormData,
        success: function (response) {
            // Armazena o ID do usuário no localStorage
            localStorage.setItem("userId", response.id);

            Swal.fire({
                title: "Sucesso!",
                text: "Cadastro realizado com sucesso!",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    // Verifica se há uma página de retorno salva
                    const returnTo = localStorage.getItem("returnTo");
                    if (returnTo) {
                        localStorage.removeItem("returnTo"); // Limpa o returnTo
                        window.location.href = returnTo;
                    } else {
                        window.location.href = "/"; // Ou outra página padrão
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            Swal.fire(
                "Erro!",
                "Não foi possível realizar o cadastro: " + xhr.responseText,
                "error"
            );
        },
    });
});

