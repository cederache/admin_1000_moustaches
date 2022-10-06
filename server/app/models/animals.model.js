const sql = require("./db.js");

const tableName = "Animals";

// constructor
const Animals = function (animal) {
  this.id = animal.id;
  this.name = animal.name;
  this.species_id = animal.species_id;
  this.icad = animal.icad;
  this.sexe = animal.sexe;
  this.race = animal.race;
  this.birthdate = animal.birthdate;
  this.entry_date = animal.entry_date;
  this.distinctive_signs = animal.distinctive_signs;
  this.reason_for_care = animal.reason_for_care;
  this.place_of_care = animal.place_of_care;
  this.care_infos = animal.care_infos;
  this.exit_date = animal.exit_date;
  this.exit_reason = animal.exit_reason;
  this.exit_infos = animal.exit_infos;
  this.death_date = animal.death_date;
  this.death_reason = animal.death_reason;
};

Animals.create = (newEntity, result) => {
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

Animals.findById = (id, result) => {
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
    }
  );
};

Animals.getAll = (name, result) => {
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

Animals.updateById = (id, animal, result) => {
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
