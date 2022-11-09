const sql = require("./db.js");

const tableName = "HostFamilyToHostFamilyKinds";
const fields = ["host_family_kind_id", "host_family_id"];

// constructor
const HostFamilyToHostFamilyKinds = function (hostFamilyToHostFamilyKind) {
  this.host_family_id = hostFamilyToHostFamilyKind.host_family_id;
  this.host_family_kind_id = hostFamilyToHostFamilyKind.host_family_kind_id;
};

HostFamilyToHostFamilyKinds.create = (newEntity, result) => {
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

HostFamilyToHostFamilyKinds.getAll = (name, result) => {
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

    console.log(`getAll : ${tableName}: `, res);
    result(null, res);
  });
};

HostFamilyToHostFamilyKinds.getAllWithHostFamilyId = (
  host_family_id,
  result
) => {
  let query = `SELECT hfk.* FROM ${tableName} hfthfk JOIN HostFamilyKinds hfk ON hfthfk.host_family_kind_id = hfk.id WHERE hfthfk.host_family_id = ${host_family_id} ORDER BY hfk.id ASC`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(
      `getAllWithHostFamilyId(${host_family_id}) : ${tableName}: `,
      res
    );
    result(null, res);
  });
};

HostFamilyToHostFamilyKinds.getAllWithHostFamilyKindId = (
  host_family_kind_id,
  result
) => {
  let query = `SELECT hf.* FROM ${tableName} hfthfk JOIN HostFamilies hf ON hfthfk.host_family_id = hf.id WHERE hfthfk.host_family_kind_id = ${host_family_kind_id} ORDER BY hfk.id ASC`;

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(
      `getAllWithHostFamilyKindId(${host_family_kind_id}) : ${tableName}: `,
      res
    );
    result(null, res);
  });
};

HostFamilyToHostFamilyKinds.updateById = (id, animalToHostFamily, result) => {
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

HostFamilyToHostFamilyKinds.remove = (link, result) => {
  const kindId = link.host_family_kind_id;
  const hostFamilyId = link.host_family_id;

  sql.query(
    `DELETE FROM ${tableName} WHERE host_family_kind_id = ? AND host_family_id = ?`,
    [kindId, hostFamilyId],
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

      console.log(`deleted ${tableName} with ids: `, kindId, hostFamilyId);
      result(null, res);
    }
  );
};

HostFamilyToHostFamilyKinds.removeAll = (result) => {
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

module.exports = HostFamilyToHostFamilyKinds;
