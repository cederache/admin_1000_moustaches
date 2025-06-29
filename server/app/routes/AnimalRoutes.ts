import { Router } from 'express'
import { AnimalController } from '../controllers/AnimalController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'
import { checkIfPermitted, Method } from '../middlewares/permission-middleware'

const router = Router()
const animalController = new AnimalController()

router.get('/', checkIfAuthenticated, getAuthUser, checkIfPermitted("pet_list", Method.GET), async (req, res) => {
    const animals = await animalController.getAllAnimals()
    res.json(animals)
})

router.get('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted("pet_info", Method.GET), async (req, res) => {
    const animal = await animalController.getAnimalById(parseInt(req.params.id))
    if (!animal) {
        return res.status(404).json({ message: 'Animal not found' })
    }
    res.json(animal)
})

router.post('/', checkIfAuthenticated, getAuthUser, checkIfPermitted("pet_list", Method.POST), async (req, res) => {
    const newAnimal = await animalController.createAnimal(req.body)
    res.status(201).json(newAnimal)
})

router.put('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted("pet_info", Method.PUT), async (req, res) => {
    const updatedAnimal = await animalController.updateAnimal(parseInt(req.params.id), req.body)
    if (!updatedAnimal) {
        return res.status(404).json({ message: 'Animal not found' })
    }
    res.json(updatedAnimal)
})

router.delete('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted("pet_list", Method.DELETE), async (req, res) => {
    await animalController.deleteAnimal(parseInt(req.params.id))
    res.status(204).send()
})

export default router 