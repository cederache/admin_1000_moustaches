import moment from "moment";

const API_URL = process.env.REACT_APP_API_URL;

class AnimalsManager {
    static formatAnimal = (animal) => {
        ["birthdate", "entry_date", "exit_date", "death_date"].forEach(
            (date) => {
                const animalDate = animal[date];
                animal[date] = {};
                animal[date]["rawValue"] = animalDate;
                animal[date]["readable"] =
                    animalDate != null
                        ? moment(animalDate).format("DD/MM/YYYY")
                        : null;
                animal[date]["input"] =
                    animalDate != null
                        ? moment(animalDate).format("YYYY-MM-DD")
                        : null;
            }
        );
        console.log(animal);
        return animal;
    };

    static getAll = () => {
        return fetch(`${API_URL}/animals`, { method: "GET" })
            .then((response) => response.json())
            .then((animals) => animals.map(AnimalsManager.formatAnimal))
            .catch((err) => {
                console.log(err);
            });
    };

    static getById = (id) => {
        return fetch(`${API_URL}/animals/${id}`, { method: "GET" })
            .then((response) => response.json())
            .then(AnimalsManager.formatAnimal)
            .catch((err) => {
                console.log(err);
            });
    };
}

export default AnimalsManager;
