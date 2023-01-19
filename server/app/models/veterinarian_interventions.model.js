const sql = require("./db.js");

const tableName = "VeterinarianInterventions";
const fields = ["id", "veterinarian_id", "date", "description", "animal_id"];

// constructor
const VeterinarianInterventions = function (veterinarianIntervention) {
  fields.forEach((field) => {
    this[field] = veterinarianIntervention[field];
  });
};

VeterinarianInterventions.create = (newEntity, result) => {
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

VeterinarianInterventions.findById = (id, result) => {
  sql.connect((connection) =>
    connection.query(
      `SELECT * FROM ${tableName} WHERE id = ${id}`,
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

VeterinarianInterventions.getAll = (name, result) => {
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

VeterinarianInterventions.getAllWithAnimalId = (animalId, result) => {
  let query = `SELECT * FROM ${tableName} WHERE animal_id = ?`;

  sql.connect((connection) =>
    connection.query(query, [animalId], (err, res) => {
      connection.end();
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(`getAllWithAnimalId(${animalId}) : ${tableName}: `, res);
      result(null, res);
    })
  );
};

VeterinarianInterventions.getAllWithVeterinarianId = (
  veterinarianId,
  result
) => {
  let query = `SELECT * FROM ${tableName} WHERE veterinarian_id = ?`;

  sql.connect((connection) =>
    connection.query(query, [veterinarianId], (err, res) => {
      connection.end();
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      console.log(
        `getAllWithVeterinarianId(${veterinarianId}) : ${tableName}: `,
        res
      );
      result(null, res);
    })
  );
};

VeterinarianInterventions.updateById = (
  id,
  veterinarianIntervention,
  result
) => {
  const fieldsToUpdate = fields.filter((field) => {
    return field !== "id";
  });

  var fieldsRequest = fieldsToUpdate
    .map((field) => {
      return `${field} = ?`;
    })
    .join(", ");

  var fieldsData = fieldsToUpdate.map((field) => {
    return veterinarianIntervention[field];
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
          // not found with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log(`updated ${tableName}: `, {
          id: id,
          ...veterinarianIntervention,
        });
        result(null, { id: id, ...veterinarianIntervention });
      }
    )
  );
};

VeterinarianInterventions.remove = (id, result) => {
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

VeterinarianInterventions.removeAll = (result) => {
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

module.exports = VeterinarianInterventions;
