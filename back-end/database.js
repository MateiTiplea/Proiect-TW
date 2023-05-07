const oracle = require('oracledb');

const config = {
    user: 'zoo',
    password: 'password',
    connectString: 'localhost:1521/xe'
}

const connection = {
    con: null,
    connect: async () => {
        try {
            this.con = await oracle.getConnection(config);
        } catch (err) {
            console.log(err);
        }
    },
    closeConnection: async () => {
        if (this.con) {
            try {
                await this.con.close();
            } catch (err) {
                console.log(err);
            }
        }
    }
}

module.exports = connection;