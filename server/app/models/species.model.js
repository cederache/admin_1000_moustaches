const sql = require("./db.js");

// constructor
const Species = function(species) {
    this.id = species.id;
    this.name = species.name;
};

Species.create = (newSpecies, result) => {
  sql.query("INSERT INTO Species SET ?", newSpecies, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created species: ", { id: res.insertId, ...newSpecies });
    result(null, { id: res.insertId, ...newSpecies });
  });
};

Species.findById = (id, result) => {
  sql.query(`SELECT * FROM Species WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found species: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Species with the id
    result({ kind: "not_found" }, null);
  });
};

Species.getAll = (name, result) => {
  let query = "SELECT * FROM Species";

  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("species: ", res);
    result(null, res);
  });
};

Species.updateById = (id, species, result) => {
  sql.query(
    "UPDATE Species SET name = ? WHERE id = ?",
    [species.name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Species with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated species: ", { id: id, ...species });
      result(null, { id: id, ...species });
    }
  );
};

Species.remove = (id, result) => {
  sql.query("DELETE FROM Species WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Species with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted species with id: ", id);
    result(null, res);
  });
};

Species.removeAll = result => {
  sql.query("DELETE FROM Species", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} species`);
    result(null, res);
  });
};

module.exports = Species;