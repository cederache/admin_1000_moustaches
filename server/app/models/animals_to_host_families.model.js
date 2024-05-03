const Animals = require("./animals.model.js");
const sql = require("./db.js");

const tableName = "AnimalsToHostFamilies";
const fields = ["animal_id", "host_family_id", "entry_date"];

// constructor
const AnimalsToHostFamilies = function (animalsToHostFamily) {
  this.animal_id = animalsToHostFamily.animal_id;
  this.host_family_id = animalsToHostFamily.host_family_id;
  this.entry_date = animalsToHostFamily.entry_date;
};

AnimalsToHostFamilies.create = (newEntity, result) => {
  var fieldsRequest = fields
    .map((field) => {
      return `${field}`;
    })
    .join(", ");

  var fieldsDataRequest = fields
    .map((field) => {
      return "?";
    })
    .join(", ");

  var fieldsData = fields.map((field) => {
    return newEntity[field];
  });

  sql.connect((connection) =>
    connection.query(`INSERT INTO ${tableName}(${fieldsRequest}) VALUES(${fieldsDataRequest})`, fieldsData, (err, res) => {
      connection.end();

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(`created ${tableName}: `, {
        id: res.insertId,
        ...newEntity,
      });

      Animals.resetContractSent(newEntity.animal_id, (err, res) => {
        if (err) {
          console.log("error while reseting animal contract_sent: ", err);
          result(null, { id: res.insertId, ...newEntity });
          return;
        }
        result(null, { id: res.insertId, ...newEntity });
      });
    })
  );
};

AnimalsToHostFamilies.getAll = (name, result) => {
  let query = `SELECT * FROM ${tableName}`;

  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  sql.connect((connection) =>
    connection.query(query, (err, res) => {
      connection.end();

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(`getAll : ${tableName}: `, res);
      result(null, res);
    })
  );
};

AnimalsToHostFamilies.getAllWithAnimalId = (animal_id, result) => {
  let query = `SELECT athf.*, hf.id as host_family_id, hf.firstname, hf.name FROM ${tableName} athf JOIN HostFamilies hf ON athf.host_family_id = hf.id WHERE athf.animal_id = ${animal_id} ORDER BY athf.entry_date ASC`;

  sql.connect((connection) =>
    connection.query(query, (err, res) => {
      connection.end();

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(`getAllWithAnimalId(${animal_id}) : ${tableName}: `, res);
      result(null, res);
    })
  );
};

AnimalsToHostFamilies.getAllWithHostFamilyId = (host_family_id, result) => {
  let query = `SELECT athf.*, a.id as animal_id, a.name as animal_name, a.entry_date as host_entry_date FROM ${tableName} athf JOIN Animals a ON athf.animal_id = a.id WHERE athf.host_family_id = ${host_family_id} ORDER BY athf.entry_date ASC`;

  sql.connect((connection) =>
    connection.query(query, (err, res) => {
      connection.end();

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(`getAllWithHostFamilyId(${host_family_id}) : ${tableName}: `, res);
      result(null, res);
    })
  );
};

AnimalsToHostFamilies.update = (animalToHostFamily, result) => {
  const fieldsToUpdate = fields.filter((field) => {
    return field !== "animal_id" && field !== "host_family_id";
  });

  var fieldsRequest = fieldsToUpdate
    .map((field) => {
      return `${field} = ?`;
    })
    .join(", ");

  var fieldsData = fieldsToUpdate.map((field) => {
    return animalToHostFamily[field];
  });
  fieldsData.push(animalToHostFamily.animal_id);
  fieldsData.push(animalToHostFamily.host_family_id);

  sql.connect((connection) =>
    connection.query(`UPDATE ${tableName} SET ${fieldsRequest} WHERE animal_id = ? AND host_family_id = ?`, fieldsData, (err, res) => {
      connection.end();

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Animal with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log(`updated ${tableName}: `, {
        ...animalToHostFamily,
      });
      result(null, { ...animalToHostFamily });
    })
  );
};

AnimalsToHostFamilies.remove = (animalId, hostFamilyId, result) => {
  sql.connect((connection) =>
    connection.query(`DELETE FROM ${tableName} WHERE animal_id = ? AND host_family_id = ?`, [animalId, hostFamilyId], (err, res) => {
      connection.end();

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows === 0) {
        // not found Animal with the id
        result({ kind: `not_found with ids ${animalId} ${hostFamilyId}` }, null);
        return;
      }

      console.log(`deleted ${tableName} with animalId ${animalId} and hostFamilyId ${hostFamilyId}`);

      Animals.resetContractSent(animalId, (err, res) => {
        if (err) {
          console.log("error while reseting animal contract_sent: ", err);
          result(null, res);
          return;
        }
        result(null, res);
      });
      result(null, res);
    })
  );
};

AnimalsToHostFamilies.removeAll = (result) => {
  sql.connect((connection) =>
    connection.query(`DELETE FROM ${tableName}`, (err, res) => {
      connection.end();

      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(`deleted ${res.affectedRows} ${tableName}`);
      result(null, res);
    })
  );
};

module.exports = AnimalsToHostFamilies;
