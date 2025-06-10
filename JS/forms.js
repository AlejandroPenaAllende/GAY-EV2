//Validacion Login
document.addEventListener("DOMContentLoaded", function(){
    const form = document.getElementById("register-form");

    form.addEventListener("submit", function(e){
        e.preventDefault();

        const email = document.getElementById("reg-email").value.trim();
        const pass = document.getElementById("reg-pass").value.trim();
        const name = document.getElementById("reg-name").value.trim();
        const conf = document.getElementById("reg-confirm").value.trim();

        const validarEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const ValidarPass = /^(?=(?:[^a-zA-Z]*[a-zA-Z]){4})(?=(?:\D*\d){4})(?=.*[^a-zA-Z0-9]).{9,}$/;

        //Evitar que los campos esten vacios
        if(email === "" || pass === "" || name === "" || conf === ""){
            alert("Es obligatorio completar todos los campos")
            return;
        }

        //Evitar nombres muy largos o muy cortos
        if(name.length < 3){
            alert("El nombre ingresado es demasiado corto, minimo 3 caracteres");
            return;
        }

        if(name.length > 50){
            alert("El nombre ingresado es demasiado largo, maximo 50 caracteres");
            return;
        }

        //Evitar que se ingrese un correo erroneo
        if (!validarEmail.test(email)) {
            alert("El correo ingresado no es valido");
            return;
        }

        //Contraseña
        if(!ValidarPass.test(pass)){
            alert("La contraseña no es valdida, 4 caracteres - 4 digitos - 1 simbolo minimo");
            return;
        }

        if(pass.length > 16){
            alert("La contraseña ingresada es demasiado larga, maximo 16 caracteres");
            return;
        }

        //Confirmar contraseña
        if(conf !== pass){
            alert("Las contraseñas no coinciden");
            return;
        }

    })
})



