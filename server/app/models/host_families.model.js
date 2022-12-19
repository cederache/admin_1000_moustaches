const sql = require("./db.js");

const tableName = "HostFamilies";
const fields = [
  "id",
  "name",
  "firstname",
  "phone",
  "mail",
  "social_network_alias",
  "address",
  "latitude",
  "longitude",
  "driver_license",
  "nb_children",
  "children_infos",
  "animals_infos",
  "can_provide_veterinary_care",
  "can_provide_sociabilisation",
  "can_host_disable_animal",
  "can_provide_night_care",
  "observations",
  "housing_informations",
  "can_isolate",
  "host_conditions",
  "on_break",
  "membership_up_to_date",
  "referent_id",
];

// constructor
const HostFamilies = function (hostFamily) {
  fields.forEach((field) => {
    this[field] = hostFamily[field];
  });
};

HostFamilies.create = (newEntity, result) => {
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

HostFamilies.findById = (id, result) => {
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

HostFamilies.getAll = (name, result) => {
  let query = `SELECT T.*, (
    Select host_family_kind_id
    from
     HostFamilyToHostFamilyKinds hfthfk
    where
     hfthfk.host_family_id = T.id
     limit 1
  ) main_host_family_kind_id FROM ${tableName} T`;

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

HostFamilies.updateById = (id, hostFamily, result) => {
  const fieldsToUpdate = fields.filter((field) => {
    return field !== "id";
  });

  var fieldsRequest = fieldsToUpdate
    .map((field) => {
      return `${field} = ?`;
    })
    .join(", ");

  var fieldsData = fieldsToUpdate.map((field) => {
    return hostFamily[field];
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

        console.log(`updated ${tableName}: `, { id: id, ...hostFamily });
        result(null, { id: id, ...hostFamily });
      }
    )
  );
};

HostFamilies.remove = (id, result) => {
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

HostFamilies.removeAll = (result) => {
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

module.exports = HostFamilies;
