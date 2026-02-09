import { Router } from 'express'
import { AnimalController } from '../controllers/AnimalController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'
import { checkIfPermitted, Method } from '../middlewares/permission-middleware'
import { Ressource } from '../types/ressource'

const router = Router()
const animalController = new AnimalController()

router.get('/', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_LIST, Method.GET), async (req, res) => {
    /* #swagger.tags = ['Animals']
       #swagger.summary = 'Get all animals'
       #swagger.description = 'Retrieve a list of all animals in the system'
       #swagger.responses[200] = {
         description: 'List of animals',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: { $ref: '#/components/schemas/Animal' }
             }
           }
         }
       }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const animals = await animalController.getAllAnimals()
    res.json(animals)
})

router.get('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_INFO, Method.GET), async (req, res) => {
    /* #swagger.tags = ['Animals']
       #swagger.summary = 'Get animal by ID'
       #swagger.description = 'Retrieve a specific animal by its ID'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Animal ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[200] = {
         description: 'Animal details',
         schema: { $ref: '#/components/schemas/Animal' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const animal = await animalController.getAnimalById(parseInt(req.params.id))
    if (!animal) {
        return res.status(404).json({ message: 'Animal not found' })
    }
    res.json(animal)
})

router.post('/', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_LIST, Method.POST), async (req, res) => {
    /* #swagger.tags = ['Animals']
       #swagger.summary = 'Create new animal'
       #swagger.description = 'Register a new animal in the system'
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateAnimalRequest' }
           }
         }
       }
       #swagger.responses[201] = {
         description: 'Animal created successfully',
         schema: { $ref: '#/components/schemas/Animal' }
       }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const newAnimal = await animalController.createAnimal(req.body)
    res.status(201).json(newAnimal)
})

router.put('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_INFO, Method.PUT), async (req, res) => {
    /* #swagger.tags = ['Animals']
       #swagger.summary = 'Update animal'
       #swagger.description = 'Update an existing animal\'s information'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Animal ID',
         required: true,
         type: 'integer'
       }
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/UpdateAnimalRequest' }
           }
         }
       }
       #swagger.responses[200] = {
         description: 'Animal updated successfully',
         schema: { $ref: '#/components/schemas/Animal' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const updatedAnimal = await animalController.updateAnimal(parseInt(req.params.id), req.body)
    if (!updatedAnimal) {
        return res.status(404).json({ message: 'Animal not found' })
    }
    res.json(updatedAnimal)
})

router.delete('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_LIST, Method.DELETE), async (req, res) => {
    /* #swagger.tags = ['Animals']
       #swagger.summary = 'Delete animal'
       #swagger.description = 'Remove an animal from the system'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Animal ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[204] = { description: 'Animal deleted successfully' }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    await animalController.deleteAnimal(parseInt(req.params.id))
    res.status(204).send()
})

export default router 