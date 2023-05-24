'use strict';

if(localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}
else {
    if(localStorage.getItem('token') !== null) {
        fetch('http://localhost:3000/api/users/self', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }).then(response => {
            if(response.status === 200) {
                response.json().then(result => {
                    if(result.data.theme === 'DARK') {
                        document.body.classList.add('dark-mode');
                    } else{
                        document.body.classList.remove('dark-mode');
                    }
                })
            }
        }).catch(err => {
            document.body.classList.remove('dark-mode');
        })
    }
}

