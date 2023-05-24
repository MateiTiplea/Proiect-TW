const oracle = require('oracledb');
const bcrypt = require('bcryptjs');

exports.getAllUsers = (async () => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM users`
    );
    connection.close();
    const users = [];
    for (let i = 0; i < result.rows.length; i++) {
        users.push({
            id: result.rows[i][0],
            username: result.rows[i][1],
            email: result.rows[i][2],
            // password: result.rows[i][3],
            first_name: result.rows[i][4],
            last_name: result.rows[i][5],
            role: result.rows[i][6],
            theme: result.rows[i][7],
            phone: result.rows[i][8],
        });
    }
    return users;
});

const hashPassword = async (password) => {
    return await bcrypt.hash(password, 12);
}

exports.validateUsername = async (username) => {
    const connection = await oracle.getConnection('zoodb');
    const query = `
        DECLARE
            username_exists BOOLEAN;
        BEGIN
            username_exists := user_exists(:username);
            :username_exists := CASE WHEN username_exists THEN 1 ELSE 0 END;
        END;`;
    const binds = {
        username,
        username_exists: { dir: oracle.BIND_OUT, type: oracle.BOOLEAN }
    };
    const result = await connection.execute(query, binds);
    connection.close();
    return result.outBinds.username_exists === '1';
}

exports.validateEmail = async (email) => {
    const connection = await oracle.getConnection('zoodb');
    const query = `
        DECLARE
            email_exists BOOLEAN;
        BEGIN
            email_exists := user_exists_mail(:email);
            :email_exists := CASE WHEN email_exists THEN 1 ELSE 0 END;
        END;`;
    const binds = {
        email,
        email_exists: { dir: oracle.BIND_OUT, type: oracle.BOOLEAN }
    };
    const result = await connection.execute(query, binds);
    connection.close();
    return result.outBinds.email_exists === '1';

}

exports.createUser = (async (user) => {
    const connection = await oracle.getConnection('zoodb');

    user.password = await hashPassword(user.password);
    await connection.execute(
        `INSERT INTO users (username, email, password, first_name, last_name, role, theme, phone) VALUES (:username, :email, :password, :first_name, :last_name, :role, :theme, :phone)`,
        [user.username, user.email, user.password, user.first_name, user.last_name, user.role, user.theme, user.phone],
        { autoCommit: true }
    );
    connection.close();
    return {
        username: user.username,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        theme: user.theme,
        phone: user.phone
    }
});

exports.getUserByUsername = async (username) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM users WHERE username = :username`,
        [username]
    );
    connection.close();
    if (result.rows.length === 0) {
        return null;
    }
    return {
        id: result.rows[0][0],
        username: result.rows[0][1],
        email: result.rows[0][2],
        password: result.rows[0][3],
        first_name: result.rows[0][4],
        last_name: result.rows[0][5],
        role: result.rows[0][6],
        theme: result.rows[0][7],
        phone: result.rows[0][8],
    }
};

exports.updatePassword = async (email, password) => {
    const connection = await oracle.getConnection('zoodb');
    const cryptPassword = await hashPassword(password);
    const result = await connection.execute(
        `UPDATE users SET password = :password WHERE email = :email`,
        [cryptPassword, email],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
}

exports.deleteUserById = async (id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `DELETE FROM users WHERE id = :id`,
        [id],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.updateUserById = async (id, updateFields) => {
    const connection = await oracle.getConnection('zoodb');
    const properties = Object.keys(updateFields);
    const values = Object.values(updateFields);
    const binds = {};
    for (let i = 0; i < properties.length; i++) {
        binds[properties[i]] = values[i];
    }
    binds.id = id;
    const result = await connection.execute(
        `UPDATE users SET ${properties.map((property, index) => `${property} = :${property}`).join(', ')} WHERE id = :id`,
        binds,
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.bookTicket = async(id, ticket) => {
    const connection = await oracle.getConnection('zoodb');
    await connection.execute(
        `INSERT INTO BOOKINGS (user_id, name, phone, book_date, adult_tickets, student_tickets, kids_tickets)
            VALUES (:user_id, :name, :phone, TO_DATE(:book_date, 'YYYY-MM-DD'), :adult_tickets, :student_tickets, :kids_tickets)`,
        [id, ticket.name, ticket.phone, ticket.book_date, ticket.adult_tickets, ticket.student_tickets, ticket.kids_tickets],
        { autoCommit: true }
    );
    connection.close();
    return ticket;
};

exports.getBookings = async (id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM BOOKINGS WHERE user_id = :id ORDER BY book_date DESC`,
        [id]
    );
    connection.close();
    const bookings = [];
    for (let i = 0; i < result.rows.length; i++) {
        bookings.push({
            id: result.rows[i][0],
            name: result.rows[i][2],
            phone: result.rows[i][3],
            book_date: result.rows[i][4],
            adult_tickets: result.rows[i][5],
            student_tickets: result.rows[i][6],
            kids_tickets: result.rows[i][7]
        });
    }
    return bookings;
};

exports.getFavorites = async (id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT a.name, a.binomial_name, a.type, a.climate, a.conservation, a.origin, a.description, a.rating, a.min_weight,
            a.max_weight, a.id, f.animal_id FROM ANIMALS a JOIN FAVORITES F on a.ID = F.ANIMAL_ID WHERE F.USER_ID = :id`,
        [id]
    );
    connection.close();
    const favorites = [];
    for (let i = 0; i < result.rows.length; i++) {
        favorites.push({
            name: result.rows[i][0],
            binomial_name: result.rows[i][1],
            type: result.rows[i][2],
            climate: result.rows[i][3],
            conservation: result.rows[i][4],
            origin: result.rows[i][5],
            description: result.rows[i][6],
            rating: result.rows[i][7],
            min_weight: result.rows[i][8],
            max_weight: result.rows[i][9],
            animal_id: result.rows[i][10],
            id: result.rows[i][11]
        });
    }
    return favorites;
}

exports.deleteFavorite = async (id, animal_id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `DELETE FROM FAVORITES WHERE user_id = :id AND animal_id = :animal_id`,
        [id, animal_id],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.addFavorite = async (id, animal_id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `INSERT INTO FAVORITES (user_id, animal_id) VALUES (:id, :animal_id)`,
        [id, animal_id],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.getComments = async (id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT c.message, c.date_created, u.username FROM COMMENTS c JOIN USERS u ON c.user_id = u.id WHERE c.animal_id = :id ORDER BY c.date_created DESC`,
        [id]
    );
    connection.close();
    const comments = [];
    for (let i = 0; i < result.rows.length; i++) {
        comments.push({
            id: result.rows[i][0],
            comment: result.rows[i][0],
            date_created: result.rows[i][1],
            username: result.rows[i][2]
        });
    }
    return comments;
};

exports.addComment = async (user_id, animal_id, comment) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `INSERT INTO COMMENTS (user_id, animal_id, message) VALUES (:user_id, :animal_id, :message)`,
        [user_id, animal_id, comment],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.deleteMyComment = async (userId, animalId, comment_id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `DELETE FROM COMMENTS WHERE user_id = :userId AND id = :comment_id AND animal_id = :animal_id`,
        [userId, comment_id, animalId],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};
