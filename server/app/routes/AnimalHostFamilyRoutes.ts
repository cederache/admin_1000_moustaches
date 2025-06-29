import { Router } from 'express'
import { AnimalHostFamilyController } from '../controllers/AnimalHostFamilyController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'
import { checkIfPermitted, Method } from '../middlewares/permission-middleware'

const router = Router()
const animalHostFamilyController = new AnimalHostFamilyController()

router.get('/animal/:animalId', checkIfAuthenticated, getAuthUser, checkIfPermitted("pet_hist_hf", Method.GET), async (req, res) => {
    const animalHostFamilies = await animalHostFamilyController.getWithAnimalId(parseInt(req.params.animalId))
    res.json(animalHostFamilies)
})

router.get('/hostFamily/:hostFamilyId', checkIfAuthenticated, getAuthUser, checkIfPermitted("hf_hist_pets", Method.GET), async (req, res) => {
    const animalHostFamilies = await animalHostFamilyController.getWithHostFamilyId(parseInt(req.params.hostFamilyId))
    res.json(animalHostFamilies)
})

router.post('/', checkIfAuthenticated, getAuthUser, checkIfPermitted("pet_hist_hf", Method.POST), async (req, res) => {
    const newAnimalHostFamily = await animalHostFamilyController.createAnimalHostFamily(req.body)
    res.status(201).json(newAnimalHostFamily)
})

router.put('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted("pet_hist_hf", Method.PUT), async (req, res) => {
    const updatedAnimalHostFamily = await animalHostFamilyController.updateAnimalHostFamily(parseInt(req.params.id), req.body)
    if (!updatedAnimalHostFamily) {
        return res.status(404).json({ message: 'AnimalHostFamily not found' })
    }
    res.json(updatedAnimalHostFamily)
})

router.delete('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted("pet_hist_hf", Method.DELETE), async (req, res) => {
    await animalHostFamilyController.deleteAnimalHostFamily(parseInt(req.params.id))
    res.status(204).send()
})

export default router 