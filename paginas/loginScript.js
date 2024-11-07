const HOST = ".";

$(document).on("submit", "#loginForm", function (event) {
    event.preventDefault();

    var formData = {
        userInput: $("#userInput").val(),
        passwordInput: $("#passwordInput").val()
    };

    $.ajax({
        url: `${HOST}/users/login`,
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),
        success: function (response) {
            console.log('Login response:', response);
            
            localStorage.setItem('userId', response.id);

            Swal.fire({
                title: "Login efetuado com sucesso!",
                icon: "success"
            }).then((result) => {
                if (result.isConfirmed) {
                    const returnTo = localStorage.getItem('returnTo');
                    if (returnTo) {
                        localStorage.removeItem('returnTo');
                        window.location.href = returnTo;
                    } else {
                        window.location.href = "/";
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: "Não foi possível realizar o login: " + (xhr.responseText || "Erro desconhecido")
            });
        }
    });
});

function irParaCadastro() {
    window.location.href = '/cadastro';
}

function togglePasswordVisibility(inputId) {
    var input = document.getElementById(inputId);
    if (input.type === "password") {
        input.type = "text";
        input.nextElementSibling.classList.add("fa-eye-slash");
        input.nextElementSibling.classList.remove("fa-eye");
    } else {
        input.type = "password";
        input.nextElementSibling.classList.remove("fa-eye-slash");
        input.nextElementSibling.classList.add("fa-eye");
    }
}
