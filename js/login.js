const inputFields = document.querySelectorAll(".input-field");
const loginButton = document.querySelector(".btn");

const loginData = {
    email: "",
    password: "",
};

const user = {
    email: "ceva",
    password: "1234",
};

const loginBtnEvent = function () { 
    console.log("loginBtnEvent");
    inputFields.forEach((input) => {
        loginData[input.name] = input.value;
    });
    if (
        loginData.email === user.email &&
        loginData.password === user.password
    ) {  
        localStorage.setItem("logged", true);
        window.location.href = "index.html";
    } else {    
        localStorage.setItem("logged", false);
        alert("Wrong email/username or password!");
        window.location.href = "login.html";
    }
};

loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    loginBtnEvent();
});