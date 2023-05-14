const oracle = require('oracledb');

exports.getAllAnimals = (async () => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM animals`
    );
    connection.close();
    const animals = [];
    for (let i = 0; i < result.rows.length; i++) {
        animals.push({
            // id: result.rows[i][0],
            name: result.rows[i][1],
            binomial_name: result.rows[i][2],
            type: result.rows[i][3],
            climate: result.rows[i][4],
            conservation: result.rows[i][5],
            origin:result.rows[i][6],
            description: result.rows[i][7],
            rating: result.rows[i][8],
            min_weight: result.rows[i][9],
            max_weight: result.rows[i][10]
        });
    }
    return animals;
});

exports.getAnimalById = async (id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM animals WHERE id = :id`,
        [id]
    );
    connection.close();
    if (result.rows.length === 0) {
        return null;
    }
    return {
        name: result.rows[0][1],
        binomial_name: result.rows[0][2],
        type: result.rows[0][3],
        climate: result.rows[0][4],
        conservation: result.rows[0][5],
        origin:result.rows[0][6],
        description: result.rows[0][7],
        rating: result.rows[0][8],
        min_weight: result.rows[0][9],
        max_weight: result.rows[0][10]
    }
};

exports.getAnimalByName = async (name) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM animals WHERE name = :name`,
        [name]
    );
    connection.close();
    if (result.rows.length === 0) {
        return null;
    }
    return {
        name: result.rows[0][1],
        binomial_name: result.rows[0][2],
        type: result.rows[0][3],
        climate: result.rows[0][4],
        conservation: result.rows[0][5],
        origin:result.rows[0][6],
        description: result.rows[0][7],
        rating: result.rows[0][8],
        min_weight: result.rows[0][9],
        max_weight: result.rows[0][10]
    }
};
exports.createAnimal= (async (animal) => {
    const connection = await oracle.getConnection('zoodb');
    await connection.execute(
        `INSERT INTO animals (name, binomial_name, type,  climate, conservation,origin, description, rating, min_weight,max_weight) VALUES
        (:name, :binomial_name, :type, :climate, :conservation,:origin, :description, :rating, :min_weight, :max_weight)`,
        [animal.name, animal.binomial_name, animal.type, animal.climate, animal.conservation,animal.origin, animal.description, animal.rating, animal.min_weight,animal.max_weight],
        { autoCommit: true }
    );
    connection.close();
    return {
        name: animal.name,
        binomial_name: animal.binomial_name,
        type: animal.type,
        climate: animal.climate,
        conservation: animal.conservation,
        origin:animal.origin,
        description: animal.description,
        rating: animal.rating,
        min_weight: animal.min_weight,
        max_weight: animal.max_weight

    }
});

exports.deleteAnimal = async (id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `DELETE FROM animals WHERE id = :id`,
        [id],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.updateAnimal = async (id, updateFields) => {
    const connection = await oracle.getConnection('zoodb');
    const properties = Object.keys(updateFields);
    const values = Object.values(updateFields);
    const binds = {};
    for (let i = 0; i < properties.length; i++) {
        binds[properties[i]] = values[i];
    }
    binds.id = id;
    const result = await connection.execute(
        `UPDATE animals SET ${properties.map(property => `${property} = :${property}`).join(', ')} WHERE id = :id`,
        binds,
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.getAnimalsByType = async (type) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM animals WHERE type = :type`,
        [type]
    );
    connection.close();
    const animals = [];
    for (let i = 0; i < result.rows.length; i++) {
        animals.push({
            name: result.rows[i][1],
            binomial_name: result.rows[i][2],
            type: result.rows[i][3],
            climate: result.rows[i][4],
            conservation: result.rows[i][5],
            origin:result.rows[i][6],
            description: result.rows[i][7],
            rating: result.rows[i][8],
            min_weight: result.rows[i][9],
            max_weight: result.rows[i][10]
        });
    }
    return animals;
};

exports.getAnimalsByClimate = async (climate) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM animals WHERE climate = :climate`,
        [climate]
    );
    connection.close();
    const animals = [];
    for (let i = 0; i < result.rows.length; i++) {
        animals.push({
            name: result.rows[i][1],
            binomial_name: result.rows[i][2],
            type: result.rows[i][3],
            climate: result.rows[i][4],
            conservation: result.rows[i][5],
            origin:result.rows[i][6],
            description: result.rows[i][7],
            rating: result.rows[i][8],
            min_weight: result.rows[i][9],
            max_weight: result.rows[i][10]
        });
    }
    return animals;
};

exports.getAnimalsByConservation = async (conservation) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM animals WHERE conservation = :conservation`,
        [conservation]
    );
    connection.close();
    const animals = [];
    for (let i = 0; i < result.rows.length; i++) {
        animals.push({
            name: result.rows[i][1],
            binomial_name: result.rows[i][2],
            type: result.rows[i][3],
            climate: result.rows[i][4],
            conservation: result.rows[i][5],
            origin:result.rows[i][6],
            description: result.rows[i][7],
            rating: result.rows[i][8],
            min_weight: result.rows[i][9],
            max_weight: result.rows[i][10]
        });
    }
    return animals;
};

exports.getAnimalsByOrigin = async (origin) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM animals WHERE origin = :origin`,
        [origin]
    );
    connection.close();
    const animals = [];
    for (let i = 0; i < result.rows.length; i++) {
        animals.push({
            name: result.rows[i][1],
            binomial_name: result.rows[i][2],
            type: result.rows[i][3],
            climate: result.rows[i][4],
            conservation: result.rows[i][5],
            origin:result.rows[i][6],
            description: result.rows[i][7],
            rating: result.rows[i][8],
            min_weight: result.rows[i][9],
            max_weight: result.rows[i][10]
        });
    }
    return animals;
};