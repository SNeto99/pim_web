
const ENDPOINT = "./users";


$(document).on("submit", "#loginForm", function (event) {
    event.preventDefault();

    var formDataArray = $(this).serializeArray(); 
    var formData = formDataArray.reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});

    console.log(formData);

    var jsonFormData = JSON.stringify(formData); // Converte o objeto para JSON

    
    $.ajax({
        url: ENDPOINT+"/login", 
        type: "POST", 
        contentType: "application/json", 
        data: jsonFormData, 
        success: function (response) {
            console.log(response)

            sessionStorage.setItem("idUser", response.id);

            Swal.fire({
                title: "Login efetuado com sucesso!",
                icon: "success"
            })
            // window.location.href = "/appdenotas/app";
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
