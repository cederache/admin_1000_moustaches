const sql = require("./db.js");

const tableName = "Species";
const fields = ["id", "name"];

// constructor
const Species = function (species) {
  fields.forEach((field) => {
    this[field] = species[field];
  });
};

Species.create = (newEntity, result) => {
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

Species.findById = (id, result) => {
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

Species.getAll = (name, result) => {
  let query = `SELECT * FROM ${tableName}`;

  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  sql.connect((connection) =>
    connection.query(query, (err, res) => {
      connection.end();
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log(`getAll : ${tableName}: `, res);
      result(null, res);
    })
  );
};

Species.updateById = (id, species, result) => {
  const fieldsToUpdate = fields.filter((field) => {
    return field !== "id";
  });

  var fieldsRequest = fieldsToUpdate
    .map((field) => {
      return `${field} = ?`;
    })
    .join(", ");

  var fieldsData = fieldsToUpdate.map((field) => {
    return species[field];
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
          result(null, err);
          return;
        }

        if (res.affectedRows == 0) {
          // not found Animal with the id
          result({ kind: "not_found" }, null);
          return;
        }

        console.log(`updated ${tableName}: `, { id: id, ...species });
        result(null, { id: id, ...species });
      }
    )
  );
};

Species.remove = (id, result) => {
  sql.connect((connection) =>
    connection.query(
      `DELETE FROM ${tableName} WHERE id = ?`,
      id,
      (err, res) => {
        connection.end();
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
      }
    )
  );
};

Species.removeAll = (result) => {
  sql.connect((connection) =>
    connection.query(`DELETE FROM ${tableName}`, (err, res) => {
      connection.end();
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log(`deleted ${res.affectedRows} ${tableName}`);
      result(null, res);
    })
  );
};

module.exports = Species;
