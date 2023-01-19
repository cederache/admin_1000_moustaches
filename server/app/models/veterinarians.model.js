const sql = require("./db.js");

const tableName = "Veterinarians";
const fields = [
  "id",
  "name",
  "phone",
  "mail",
  "address",
  "latitude",
  "longitude",
  "emergencies",
  "appointment_confirmation_procedure",
  "invoice_payment_date",
  "payment_method",
  "price_level",
];

// constructor
const Veterinarians = function (veterinarian) {
  fields.forEach((field) => {
    this[field] = veterinarian[field];
  });
};

Veterinarians.create = (newEntity, result) => {
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

Veterinarians.findById = (id, result) => {
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

Veterinarians.getAll = (name, result) => {
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

Veterinarians.updateById = (id, vet, result) => {
  const fieldsToUpdate = fields.filter((field) => {
    return field !== "id";
  });

  var fieldsRequest = fieldsToUpdate
    .map((field) => {
      return `${field} = ?`;
    })
    .join(", ");

  var fieldsData = fieldsToUpdate.map((field) => {
    return vet[field];
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

        console.log(`updated ${tableName}: `, { id: id, ...vet });
        result(null, { id: id, ...vet });
      }
    )
  );
};

Veterinarians.remove = (id, result) => {
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

Veterinarians.removeAll = (result) => {
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

module.exports = Veterinarians;
