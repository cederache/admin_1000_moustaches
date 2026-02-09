import { Router } from 'express'
import { VeterinarianController } from '../controllers/VeterinarianController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'
import { checkIfPermitted, Method } from '../middlewares/permission-middleware'
import { Ressource } from '../types/ressource'

const router = Router()
const veterinarianController = new VeterinarianController()

router.get('/', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.VET_LIST, Method.GET), async (req, res) => {
    /* #swagger.tags = ['Veterinarians']
       #swagger.summary = 'Get all veterinarians'
       #swagger.description = 'Retrieve a list of all veterinarians in the system'
       #swagger.responses[200] = {
         description: 'List of veterinarians',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: { $ref: '#/components/schemas/Veterinarian' }
             }
           }
         }
       }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const vets = await veterinarianController.getAllVeterinarians()
    res.json(vets)
})

router.get('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.VET_INFO, Method.GET), async (req, res) => {
    /* #swagger.tags = ['Veterinarians']
       #swagger.summary = 'Get veterinarian by ID'
       #swagger.description = 'Retrieve a specific veterinarian by their ID'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Veterinarian ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[200] = {
         description: 'Veterinarian details',
         schema: { $ref: '#/components/schemas/Veterinarian' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const vet = await veterinarianController.getVeterinarianById(parseInt(req.params.id))
    if (!vet) {
        return res.status(404).json({ message: 'Veterinarian not found' })
    }
    res.json(vet)
})

router.post('/', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.VET_LIST, Method.POST), async (req, res) => {
    /* #swagger.tags = ['Veterinarians']
       #swagger.summary = 'Create new veterinarian'
       #swagger.description = 'Register a new veterinarian in the system'
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateVeterinarianRequest' }
           }
         }
       }
       #swagger.responses[201] = {
         description: 'Veterinarian created successfully',
         schema: { $ref: '#/components/schemas/Veterinarian' }
       }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const newVet = await veterinarianController.createVeterinarian(req.body)
    res.status(201).json(newVet)
})

router.put('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.VET_INFO, Method.PUT), async (req, res) => {
    /* #swagger.tags = ['Veterinarians']
       #swagger.summary = 'Update veterinarian'
       #swagger.description = 'Update an existing veterinarian\'s information'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Veterinarian ID',
         required: true,
         type: 'integer'
       }
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateVeterinarianRequest' }
           }
         }
       }
       #swagger.responses[200] = {
         description: 'Veterinarian updated successfully',
         schema: { $ref: '#/components/schemas/Veterinarian' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const updatedVet = await veterinarianController.updateVeterinarian(parseInt(req.params.id), req.body)
    if (!updatedVet) {
        return res.status(404).json({ message: 'Veterinarian not found' })
    }
    res.json(updatedVet)
})

router.delete('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.VET_INFO, Method.DELETE), async (req, res) => {
    /* #swagger.tags = ['Veterinarians']
       #swagger.summary = 'Delete veterinarian'
       #swagger.description = 'Remove a veterinarian from the system'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Veterinarian ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[204] = { description: 'Veterinarian deleted successfully' }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    await veterinarianController.deleteVeterinarian(parseInt(req.params.id))
    res.status(204).send()
})

export default router 