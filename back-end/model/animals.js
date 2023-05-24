const oracle = require('oracledb');
const fs = require('fs');
const path = require('path');

exports.getAllAnimals = (async () => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        `SELECT * FROM animals ORDER BY id`
    );
    connection.close();
    const animals = [];
    for (let i = 0; i < result.rows.length; i++) {
        animals.push({
            id: result.rows[i][0],
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
        id: result.rows[0][0],
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
        id: result.rows[0][0],
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
    // get the id of the newly inserted animal
    const result = await connection.execute(
        `SELECT id FROM animals WHERE name = :name`,
        [animal.name]
    );
    connection.close();
    return {
        id: result.rows[0][0],
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
            id: result.rows[i][0],
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
            id: result.rows[i][0],
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
            id: result.rows[i][0],
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
            id: result.rows[i][0],
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

exports.uploadPhoto = async (id, photoData, photoName, contentType) => {
    const destPath = path.join(__dirname, '..', 'public', 'animalPhotos', photoName);
    fs.writeFileSync(destPath, photoData, 'binary', (err) => {
        if (err) {
            return false;
        }
    });
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        'INSERT INTO images (animal_id, path, content_type) VALUES (:id, :photoName, :contentType)',
        [id, photoName, contentType],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.getPhoto = async (id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        'SELECT * FROM images WHERE animal_id = :id',
        [id]
    );
    connection.close();
    if (result.rows.length === 0) {
        return null;
    }
    const photoData = fs.readFileSync(path.join(__dirname, '..', 'public', 'animalPhotos', result.rows[0][2]));
    return {
        photo: photoData,
        contentType: result.rows[0][3]
    };
};

exports.validatePhoto = async (id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        'SELECT * FROM images WHERE animal_id = :id',
        [id]
    );
    connection.close();
    return result.rows.length === 1;
};

exports.updatePhoto = async (id, photoData, photoName, contentType) => {
    // delete the old file stored in the database
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        'SELECT * FROM images WHERE animal_id = :id',
        [id]
    );
    fs.unlinkSync(path.join(__dirname, '..', 'public', 'animalPhotos', result.rows[0][2]));
    // save the new file
    const destPath = path.join(__dirname, '..', 'public', 'animalPhotos', photoName);
    fs.writeFileSync(destPath, photoData, 'binary', (err) => {
        if (err) {
            return false;
        }
    });
    // update the database
    const result2 = await connection.execute(
        'UPDATE images SET path = :photoName, content_type = :contentType WHERE animal_id = :id',
        [photoName, contentType, id],
        { autoCommit: true }
    );
    connection.close();
    return result2.rowsAffected === 1;
};

exports.getRating = async (id) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        'SELECT rating FROM animals WHERE id = :id',
        [id]
    );
    const ratingNumber = await connection.execute(
        'SELECT COUNT(*) FROM ratings WHERE animal_id = :id',
        [id]
    );
    connection.close();
    if(result.rows.length === 0) {
        return null;
    }
    return {
        rating: result.rows[0][0],
        numberRatings: ratingNumber.rows[0][0]
    };
};

exports.addRating = async (userId, animalId, rating) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        'INSERT INTO ratings (user_id, animal_id, rating) VALUES (:userId, :animalId, :rating)',
        [userId, animalId, rating],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.updateRating = async (userId, animalId, rating) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        'UPDATE ratings SET rating = :rating WHERE user_id = :userId AND animal_id = :animalId',
        [rating, userId, animalId],
        { autoCommit: true }
    );
    connection.close();
    return result.rowsAffected === 1;
};

exports.search = async (searchTerm) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        'SELECT * FROM animals WHERE name LIKE :searchTerm OR binomial_name LIKE :searchTerm OR type LIKE :searchTerm ' +
        'OR climate LIKE :searchTerm OR conservation LIKE :searchTerm OR origin LIKE :searchTerm OR description LIKE :searchTerm',
        ['%' + searchTerm + '%']
    );
    connection.close();
    const animals = [];
    for (let i = 0; i < result.rows.length; i++) {
        animals.push({
            id: result.rows[i][0],
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

exports.getCriteria = async(criteriaDict) => {
    const connection = await oracle.getConnection('zoodb');
    // criteriaDict is a dictionary that contains arrays of criteria
    // for example, criteriaDict = {type: ['mammal', 'bird'], climate: ['tropical', 'temperate']}
    const result = await connection.execute(
        'SELECT * FROM ANIMALS WHERE ' + Object.keys(criteriaDict).map(key => key + ' IN (' + criteriaDict[key].map((_, i) => ':' + key + i).join(', ') + ')').join(' AND '),
        Object.keys(criteriaDict).reduce((acc, key) => acc.concat(criteriaDict[key]), [])
    );
    connection.close();
    const animals = [];
    for (let i = 0; i < result.rows.length; i++) {
        animals.push({
            id: result.rows[i][0],
            name: result.rows[i][1],
            binomial_name: result.rows[i][2],
            type: result.rows[i][3],
            climate: result.rows[i][4],
            conservation: result.rows[i][5],
            origin: result.rows[i][6],
            description: result.rows[i][7],
            rating: result.rows[i][8],
            min_weight: result.rows[i][9],
            max_weight: result.rows[i][10]
        });
    }
    return animals;
};

exports.getMyRating = async(userId, animalId) => {
    const connection = await oracle.getConnection('zoodb');
    const result = await connection.execute(
        'SELECT rating FROM ratings WHERE user_id = :userId AND animal_id = :animalId',
        [userId, animalId]
    );
    connection.close();
    if(result.rows.length === 0) {
        return null;
    }
    return result.rows[0][0];
}