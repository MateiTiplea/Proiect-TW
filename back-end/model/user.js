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
            // id: result.rows[i][0],
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
        role: result.rows[0][6]
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
