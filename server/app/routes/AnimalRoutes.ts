import { Router } from 'express'
import { AnimalController } from '../controllers/AnimalController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'
import { checkIfPermitted, Method } from '../middlewares/permission-middleware'
import { Ressource } from '../types/ressource'

const router = Router()
const animalController = new AnimalController()

router.get('/', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_LIST, Method.GET), async (req, res) => {
    const animals = await animalController.getAllAnimals()
    res.json(animals)
})

router.get('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_INFO, Method.GET), async (req, res) => {
    const animal = await animalController.getAnimalById(parseInt(req.params.id))
    if (!animal) {
        return res.status(404).json({ message: 'Animal not found' })
    }
    res.json(animal)
})

router.post('/', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_LIST, Method.POST), async (req, res) => {
    const newAnimal = await animalController.createAnimal(req.body)
    res.status(201).json(newAnimal)
})

router.put('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_INFO, Method.PUT), async (req, res) => {
    const updatedAnimal = await animalController.updateAnimal(parseInt(req.params.id), req.body)
    if (!updatedAnimal) {
        return res.status(404).json({ message: 'Animal not found' })
    }
    res.json(updatedAnimal)
})

router.delete('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_LIST, Method.DELETE), async (req, res) => {
    await animalController.deleteAnimal(parseInt(req.params.id))
    res.status(204).send()
})

export default router 