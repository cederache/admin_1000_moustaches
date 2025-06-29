import { Router } from 'express'
import { VeterinarianController } from '../controllers/VeterinarianController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'
import { checkIfPermitted, Method } from '../middlewares/permission-middleware'

const router = Router()
const veterinarianController = new VeterinarianController()

router.get('/', checkIfAuthenticated, getAuthUser, checkIfPermitted("vet_list", Method.GET), async (req, res) => {
    const vets = await veterinarianController.getAllVeterinarians()
    res.json(vets)
})

router.get('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted("vet_info", Method.GET), async (req, res) => {
    const vet = await veterinarianController.getVeterinarianById(parseInt(req.params.id))
    if (!vet) {
        return res.status(404).json({ message: 'Veterinarian not found' })
    }
    res.json(vet)
})

router.post('/', checkIfAuthenticated, getAuthUser, checkIfPermitted("vet_list", Method.POST), async (req, res) => {
    const newVet = await veterinarianController.createVeterinarian(req.body)
    res.status(201).json(newVet)
})

router.put('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted("vet_info", Method.PUT), async (req, res) => {
    const updatedVet = await veterinarianController.updateVeterinarian(parseInt(req.params.id), req.body)
    if (!updatedVet) {
        return res.status(404).json({ message: 'Veterinarian not found' })
    }
    res.json(updatedVet)
})

router.delete('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted("vet_info", Method.DELETE), async (req, res) => {
    await veterinarianController.deleteVeterinarian(parseInt(req.params.id))
    res.status(204).send()
})

export default router 