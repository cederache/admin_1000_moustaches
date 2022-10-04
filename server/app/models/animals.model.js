const sql = require("./db.js");

// constructor
const Animals = function(animal) {
    this.id = animal.id;
    this.name = animal.name;
    this.species_id = animal.species_id;
};

Animals.create = (newAnimal, result) => {
  sql.query("INSERT INTO animals SET ?", newAnimal, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created animals: ", { id: res.insertId, ...newAnimal });
    result(null, { id: res.insertId, ...newAnimal });
  });
};

Animals.findById = (id, result) => {
  sql.query(`SELECT * FROM animals WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found animals: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Animal with the id
    result({ kind: "not_found" }, null);
  });
};

Animals.getAll = (name, result) => {
  let query = "SELECT * FROM animals";

  if (name) {
    query += ` WHERE name LIKE '%${name}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("animals: ", res);
    result(null, res);
  });
};

Animals.updateById = (id, animal, result) => {
  sql.query(
    "UPDATE animals SET name = ? WHERE id = ?",
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

      console.log("updated animals: ", { id: id, ...animals });
      result(null, { id: id, ...animals });
    }
  );
};

Animals.remove = (id, result) => {
  sql.query("DELETE FROM animals WHERE id = ?", id, (err, res) => {
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

    console.log("deleted animals with id: ", id);
    result(null, res);
  });
};

Animals.removeAll = result => {
  sql.query("DELETE FROM animals", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} animals`);
    result(null, res);
  });
};

module.exports = Animals;