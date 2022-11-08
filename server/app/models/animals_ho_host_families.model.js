const sql = require("./db.js");

const tableName = "AnimalsToHostFamilies";
const fields = ["animal_id", "host_family_id", "entry_date", "exit_date"];

// constructor
const AnimalsToHostFamilies = function (animalsToHostFamily) {
  this.animal_id = animalsToHostFamily.animal_id;
  this.host_family_id = animalsToHostFamily.host_family_id;
  this.entry_date = animalsToHostFamily.entry_date;
  this.exit_date = animalsToHostFamily.exit_date;
};

AnimalsToHostFamilies.create = (newEntity, result) => {
  const fieldsToUpdate = fields.filter((field) => {
    return field !== "id";
  });

  var fieldsRequest = fieldsToUpdate
    .map((field) => {
      return `${field}`;
    })
    .join(", ");

  var fieldsDataRequest = fieldsToUpdate
    .map((field) => {
      return "?";
    })
    .join(", ");

  var fieldsData = fieldsToUpdate.map((field) => {
    return newEntity[field];
  });

  sql.query(
    `INSERT INTO ${tableName}(${fieldsRequest}) VALUES(${fieldsDataRequest})`,
    fieldsData,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(`created ${tableName}: `, { id: res.insertId, ...newEntity });
      result(null, { id: res.insertId, ...newEntity });
    }
  );
};

AnimalsToHostFamilies.getAll = (name, result) => {
  let query = `SELECT * FROM ${tableName}`;

  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`${tableName}: `, res);
    result(null, res);
  });
};

AnimalsToHostFamilies.getAllWithAnimalId = (animal_id, result) => {
  let query = `SELECT athf.*, hf.id as host_family_id, hf.firstname, hf.name FROM ${tableName} athf JOIN HostFamilies hf ON athf.host_family_id = hf.id WHERE athf.animal_id = ${animal_id} ORDER BY athf.entry_date ASC`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`${tableName}: `, res);
    result(null, res);
  });
};

AnimalsToHostFamilies.getAllWithHostFamilyId = (host_family_id, result) => {
  let query = `SELECT athf.*, a.id as animal_id, a.name as animal_name, a.entry_date as host_entry_date, a.exit_date as host_exit_date FROM ${tableName} athf JOIN Animals a ON athf.animal_id = a.id WHERE athf.host_family_id = ${host_family_id} ORDER BY athf.entry_date ASC`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`${tableName}: `, res);
    result(null, res);
  });
};

AnimalsToHostFamilies.updateById = (id, animalToHostFamily, result) => {
  const fieldsToUpdate = fields.filter((field) => {
    return field !== "id";
  });

  var fieldsRequest = fieldsToUpdate
    .map((field) => {
      return `${field} = ?`;
    })
    .join(", ");

  var fieldsData = fieldsToUpdate.map((field) => {
    return animalToHostFamily[field];
  });
  fieldsData.push(id);

  sql.query(
    `UPDATE ${tableName} SET ${fieldsRequest} WHERE id = ?`,
    fieldsData,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Animal with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log(`updated ${tableName}: `, { id: id, ...animalToHostFamily });
      result(null, { id: id, ...animalToHostFamily });
    }
  );
};

AnimalsToHostFamilies.remove = (id, result) => {
  sql.query(`DELETE FROM ${tableName} WHERE id = ?`, id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Animal with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log(`deleted ${tableName} with id: `, id);
    result(null, res);
  });
};

AnimalsToHostFamilies.removeAll = (result) => {
  sql.query(`DELETE FROM ${tableName}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} ${tableName}`);
    result(null, res);
  });
};

module.exports = AnimalsToHostFamilies;
