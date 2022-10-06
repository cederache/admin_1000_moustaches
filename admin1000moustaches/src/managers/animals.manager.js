import moment from 'moment';

const API_URL = process.env.REACT_APP_API_URL;

class AnimalsManager {
    static formatAnimal = (animal) => {
        animal.readable_birth_date = animal.birthdate != null ? moment(animal.birthdate).format("YYYY/MM/DD") : "";
        animal.readable_entry_date = animal.entry_date != null ? moment(animal.entry_date).format("YYYY/MM/DD") : "";
        return animal;
    }
    
    static getAll = () => {
        return fetch(`${API_URL}/animals`, {"method": "GET"})
        .then(response => response.json())
        .then(animals => animals.map(AnimalsManager.formatAnimal))
        .catch(err => {
            console.log(err)
        })
    }
}

export default AnimalsManager;