const sql = require("./db.js");

const tableName = "Animals";
const fields = [
  "id",
  "name",
  "species_id",
  "icad",
  "sexe",
  "race",
  "birthdate",
  "entry_date",
  "distinctive_signs",
  "reason_for_care",
  "place_of_care",
  "care_infos",
  "exit_date",
  "exit_reason",
  "exit_infos",
  "death_date",
  "death_reason",
];

// constructor
const Animals = function (animal) {
  fields.forEach((field) => {
    this[field] = animal[field];
  });
};

Animals.create = (newEntity, result) => {
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

  console.log(fieldsRequest);
  console.log(fieldsData);
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

Animals.findById = (id, result) => {
  sql.query(
    `SELECT a.*, s.name as species FROM ${tableName} a JOIN Species s ON a.species_id = s.id WHERE a.id = ${id}`,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.length) {
        console.log(`found ${tableName}: `, res[0]);
        result(null, res[0]);
        return;
      }

      // not found entity with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Animals.getAll = (name, result) => {
  let query = `SELECT a.*, s.name as species FROM ${tableName} a JOIN Species s ON a.species_id = s.id`;

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

Animals.updateById = (id, animal, result) => {
  const fieldsToUpdate = fields.filter((field) => {
    return field !== "id";
  });

  var fieldsRequest = fieldsToUpdate
    .map((field) => {
      return `${field} = ?`;
    })
    .join(", ");

  var fieldsData = fieldsToUpdate.map((field) => {
    return animal[field];
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

      console.log(`updated ${tableName}: `, { id: id, ...animal });
      result(null, { id: id, ...animal });
    }
  );
};

Animals.remove = (id, result) => {
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

Animals.removeAll = (result) => {
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

module.exports = Animals;
