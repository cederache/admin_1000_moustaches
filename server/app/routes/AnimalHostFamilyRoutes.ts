import { Router } from 'express'
import { AnimalHostFamilyController } from '../controllers/AnimalHostFamilyController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'
import { checkIfPermitted, Method } from '../middlewares/permission-middleware'
import { Ressource } from '../types/ressource'

const router = Router()
const animalHostFamilyController = new AnimalHostFamilyController()

router.get('/animal/:animalId', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_HIST_HF, Method.GET), async (req, res) => {
    /* #swagger.tags = ['Host Family Relations']
       #swagger.summary = 'Get host family history for animal'
       #swagger.description = 'Retrieve all host family relationships for a specific animal'
       #swagger.parameters['animalId'] = {
         in: 'path',
         description: 'Animal ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[200] = {
         description: 'List of host family relationships for the animal',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: { $ref: '#/components/schemas/AnimalHostFamily' }
             }
           }
         }
       }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const animalHostFamilies = await animalHostFamilyController.getWithAnimalId(parseInt(req.params.animalId))
    res.json(animalHostFamilies)
})

router.get('/hostFamily/:hostFamilyId', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.HF_HIST_PETS, Method.GET), async (req, res) => {
    /* #swagger.tags = ['Host Family Relations']
       #swagger.summary = 'Get animals hosted by host family'
       #swagger.description = 'Retrieve all animals that have been hosted by a specific host family'
       #swagger.parameters['hostFamilyId'] = {
         in: 'path',
         description: 'Host family ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[200] = {
         description: 'List of animals hosted by the host family',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: { $ref: '#/components/schemas/AnimalHostFamily' }
             }
           }
         }
       }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const animalHostFamilies = await animalHostFamilyController.getWithHostFamilyId(parseInt(req.params.hostFamilyId))
    res.json(animalHostFamilies)
})

router.post('/', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_HIST_HF, Method.POST), async (req, res) => {
    /* #swagger.tags = ['Host Family Relations']
       #swagger.summary = 'Create new animal-host family relationship'
       #swagger.description = 'Create a new relationship between an animal and a host family'
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateAnimalHostFamilyRequest' }
           }
         }
       }
       #swagger.responses[201] = {
         description: 'Animal-host family relationship created successfully',
         schema: { $ref: '#/components/schemas/AnimalHostFamily' }
       }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const newAnimalHostFamily = await animalHostFamilyController.createAnimalHostFamily(req.body)
    res.status(201).json(newAnimalHostFamily)
})

router.put('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_HIST_HF, Method.PUT), async (req, res) => {
    /* #swagger.tags = ['Host Family Relations']
       #swagger.summary = 'Update animal-host family relationship'
       #swagger.description = 'Update an existing animal-host family relationship'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Animal-host family relationship ID',
         required: true,
         type: 'integer'
       }
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateAnimalHostFamilyRequest' }
           }
         }
       }
       #swagger.responses[200] = {
         description: 'Animal-host family relationship updated successfully',
         schema: { $ref: '#/components/schemas/AnimalHostFamily' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const updatedAnimalHostFamily = await animalHostFamilyController.updateAnimalHostFamily(parseInt(req.params.id), req.body)
    if (!updatedAnimalHostFamily) {
        return res.status(404).json({ message: 'AnimalHostFamily not found' })
    }
    res.json(updatedAnimalHostFamily)
})

router.delete('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_HIST_HF, Method.DELETE), async (req, res) => {
    /* #swagger.tags = ['Host Family Relations']
       #swagger.summary = 'Delete animal-host family relationship'
       #swagger.description = 'Delete an existing animal-host family relationship'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Animal-host family relationship ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[204] = { description: "Animal-host family relationship deleted successfully" }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    await animalHostFamilyController.deleteAnimalHostFamily(parseInt(req.params.id))
    res.status(204).send()
})

export default router 