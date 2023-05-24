const inputFields = document.querySelectorAll(".input-field");
const loginButton = document.querySelector(".btn");


const loginBtnEvent =  async() => {
    const requestBody = {};
    inputFields.forEach((input) => {
        requestBody[input.name] = input.value;
    });
    if(!requestBody.username || !requestBody.password){
        alert("Please enter username and password!");
        return;
    }
    const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    const result = await response.json();
    if(response.status !== 200) {
        alert(result.message);
    } else if(result.status === 'success') {
        localStorage.setItem('logged', 'true');
        localStorage.setItem('token', result.token);
        window.location.href = "/";
    }
};

loginButton.addEventListener("click", async function (e) {
    e.preventDefault();
    await loginBtnEvent();
});