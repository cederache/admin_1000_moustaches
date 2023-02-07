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
  "sterilised",
  "first_vaccination_date",
  "second_vaccination_date",
  "fiv_negative",
  "felv_negative",
  "health_issues",
  "behaviour",
  "adopted",
  "broadcastable",
  "bookable",
  "need_external_access",
  "transferor",
  "anti_parasitic_date",
  "transfer_certificate"
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

  sql.connect((connection) =>
    connection.query(
      `INSERT INTO ${tableName}(${fieldsRequest}) VALUES(${fieldsDataRequest})`,
      fieldsData,
      (err, res) => {
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
        result(null, { id: res.insertId, ...newEntity });
      }
    )
  );
};

Animals.findById = (id, result) => {
  sql.connect((connection) =>
    connection.query(
      `SELECT a.*, s.name as species, hf.id as current_host_family_id, hf.referent_id as current_host_family_referent_id
      FROM ${tableName} a
      JOIN Species s ON a.species_id = s.id
      LEFT JOIN AnimalsToHostFamilies athf ON athf.animal_id = a.id
      LEFT JOIN HostFamilies hf ON hf.id = athf.host_family_id WHERE a.id = ${id}`,
      (err, res) => {
        connection.end();
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.length) {
          console.log(`findById(${id}) : ${tableName}: `, res[0]);
          result(null, res[0]);
          return;
        }

        // not found entity with the id
        result({ kind: "not_found" }, null);
      }
    )
  );
};

Animals.getAll = (name, result) => {
  let query = `SELECT a.*, s.name as species, hf.id as current_host_family_id, hf.referent_id as current_host_family_referent_id
  FROM ${tableName} a
  JOIN Species s ON a.species_id = s.id
  LEFT JOIN AnimalsToHostFamilies athf ON athf.animal_id = a.id
  LEFT JOIN HostFamilies hf ON hf.id = athf.host_family_id`;

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

  sql.connect((connection) =>
    connection.query(
      `UPDATE ${tableName} SET ${fieldsRequest} WHERE id = ?`,
      fieldsData,
      (err, res) => {
        connection.end();
        if (err) {
          console.log("error: ", err);
          result(err, null);
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
    )
  );
};

Animals.remove = (id, result) => {
  sql.connect((connection) =>
    connection.query(
      `DELETE FROM ${tableName} WHERE id = ?`,
      id,
      (err, res) => {
        connection.end();
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Animal with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log(`deleted ${tableName} with id: `, id);
        result(null, res);
      }
    )
  );
};

Animals.removeAll = (result) => {
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

module.exports = Animals;
