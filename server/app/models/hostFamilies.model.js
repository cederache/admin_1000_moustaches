const sql = require("./db.js");

const tableName = "HostFamilies";

// constructor
const HostFamilies = function(hostFamily) {
    this.id = hostFamily.id;
    this.name = hostFamily.name;
    this.firstname = hostFamily.firstname;
    this.phone = hostFamily.phone;
    this.mail = hostFamily.mail;
    this.social_network_alias = hostFamily.social_network_alias;
    this.driver_license = hostFamily.driver_license;
    this.nb_children = hostFamily.nb_children;
    this.children_info = hostFamily.children_info;
    this.animals_info = hostFamily.animals_info;
    this.can_provide_veterinary_care = hostFamily.can_provide_veterinary_care;
    this.can_provide_sociabilisation = hostFamily.can_provide_sociabilisation;
    this.can_host_disable_animal = hostFamily.can_host_disable_animal;
    this.can_provide_night_care = hostFamily.can_provide_night_care;
    this.observations = hostFamily.observations;
    this.housing_informations = hostFamily.housing_informations;
    this.can_isolate = hostFamily.can_isolate;
};

HostFamilies.create = (newEntity, result) => {
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

HostFamilies.findById = (id, result) => {
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

HostFamilies.getAll = (name, result) => {
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

HostFamilies.updateById = (id, animal, result) => {
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

HostFamilies.remove = (id, result) => {
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

HostFamilies.removeAll = result => {
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

module.exports = HostFamilies;