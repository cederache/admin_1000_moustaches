const sql = require("./db.js");

const tableName = "AnimalsToHostFamilies";

// constructor
const AnimalsToHostFamilies = function(animalsToHostFamily) {
    this.animal_id = animalsToHostFamily.animal_id;
    this.host_family_id = animalsToHostFamily.host_family_id;
    this.entry_date = animalsToHostFamily.entry_date;
    this.exit_date = animalsToHostFamily.exit_date;
};

AnimalsToHostFamilies.create = (newEntity, result) => {
  sql.query(`INSERT INTO ${tableName} SET ?`, newEntity, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log(`created ${tableName}: `, { id: res.insertId, ...newEntity });
    result(null, { id: res.insertId, ...newEntity });
  });
};

AnimalsToHostFamilies.findById = (id, result) => {
  sql.query(`SELECT * FROM ${tableName} WHERE id = ${id}`, (err, res) => {
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
  });
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

AnimalsToHostFamilies.updateById = (id, animal, result) => {
  sql.query(
    `UPDATE ${tableName} SET name = ? WHERE id = ?`,
    [animal.name, id],
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

      console.log(`updated ${tableName}: `, { id: id, ...animals });
      result(null, { id: id, ...animals });
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

AnimalsToHostFamilies.removeAll = result => {
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