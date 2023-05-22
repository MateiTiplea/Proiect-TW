const inputFields = document.querySelectorAll(".input-field");
const loginButton = document.querySelector(".btn");

const forgotBtnEvent = async() => {
    console.log("loginBtnEvent");
    const requestBody = {};
    inputFields.forEach((input) => {
        requestBody[input.name] = input.value;
    });
    if(!requestBody.email || !requestBody.password){
        alert("Please enter email and password!");
        return;
    }
    const response = await fetch('http://localhost:3000/api/auth/forgotPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: requestBody.email
        })
    });
    const result = await response.json();
    if(result.status === 'fail' || result.status === 'error') {
        alert(result.message);
    } else if(result.status === 'success') {
        const resetResult = await fetch('http://localhost:3000/api/auth/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        const resetResponse = await resetResult.json();
        if(resetResponse.status === 'fail' || resetResponse.status === 'error'){
            alert(result.message);
        } else{
            alert('Password reset successful');
            window.location.href = "/login";
        }
    }
};

loginButton.addEventListener("click", async function (e) {
    e.preventDefault();
    await forgotBtnEvent();
});