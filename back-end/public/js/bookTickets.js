'use strict';

const inputFields = document.querySelectorAll('.input-field');
const submitBtn = document.querySelector('.btn');
const token = localStorage.getItem('token');
const bookTableDiv = document.querySelector('.book-table');

const bookTicket = async () => {
    const requestBody = {
        name: inputFields[0].value,
        phone: inputFields[1].value,
        book_date: inputFields[2].value,
        adult_tickets: Number(inputFields[3].value),
        student_tickets: Number(inputFields[4].value),
        kids_tickets: Number(inputFields[5].value)
    }
    if(requestBody.name === '' || requestBody.phone === '' || requestBody.book_date === '')
        return alert('Please fill all the required fields');
    if(requestBody.adult_tickets === 0 && requestBody.student_tickets === 0 && requestBody.kids_tickets === 0)
        return alert('Please fill at least one ticket field');
    const date = new Date(requestBody.book_date);
    if(date.getDay() === 4)
        return alert('Zoo is closed on Thursday');
    if(date < new Date())
        return alert('Please enter a valid date');
    if(token === null)
        return alert('Please login to book tickets');
    const response = await fetch('http://localhost:3000/api/users/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
    });
    if(response.status === 201) {
        alert('Ticket booked successfully');
        window.location.href = '/';
    } else {
        const result = await response.json();
        alert(result.message);
    }
};

submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await bookTicket();
});

const getBookings = async () => {
    const response = await fetch('http://localhost:3000/api/users/bookings', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if(response.status === 200) {
        const result = await response.json();
        return result.data.tickets;
    } else {
        return null;
    }
};

const createTable = (tickets) => {
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Book Date</th>
                <th>Adult Tickets</th>
                <th>Student Tickets</th>
                <th>Kids Tickets</th>
            </tr>
        </thead>
    `;
    const tbody = document.createElement('tbody');
    tickets.forEach((ticket) => {
        const row = document.createElement('tr');
        // format book_date
        const date = new Date(ticket.book_date);
        const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        row.innerHTML = `
            <td>${ticket.name}</td>
            <td>${ticket.phone}</td>
            <td>${formattedDate}</td>
            <td>${ticket.adult_tickets}</td>
            <td>${ticket.student_tickets}</td>
            <td>${ticket.kids_tickets}</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    bookTableDiv.appendChild(table);
};


if(token) {
    getBookings().then((tickets) => {
        if(tickets.length > 0){
            createTable(tickets);
        }
    });
}