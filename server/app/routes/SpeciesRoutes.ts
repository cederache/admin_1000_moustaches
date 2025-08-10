import { Router } from 'express'
import { SpeciesController } from '../controllers/SpeciesController'
import { checkIfAuthenticated } from '../middlewares/auth-middleware'

const router = Router()
const speciesController = new SpeciesController()

router.get('/', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Species']
       #swagger.summary = 'Get all species'
       #swagger.description = 'Retrieve a list of all animal species'
       #swagger.responses[200] = {
         description: 'List of species',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: { $ref: '#/components/schemas/Species' }
             }
           }
         }
       }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const species = await speciesController.getAllSpecies()
    res.json(species)
})

router.get('/:id', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Species']
       #swagger.summary = 'Get species by ID'
       #swagger.description = 'Retrieve a specific species by its ID'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Species ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[200] = {
         description: 'Species details',
         schema: { $ref: '#/components/schemas/Species' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const species = await speciesController.getSpeciesById(parseInt(req.params.id))
    if (!species) {
        return res.status(404).json({ message: 'Species not found' })
    }
    res.json(species)
})

router.post('/', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Species']
       #swagger.summary = 'Create new species'
       #swagger.description = 'Create a new animal species'
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { 
               type: 'object',
               required: ['name'],
               properties: {
                 name: { type: 'string', example: 'Cat' }
               }
             }
           }
         }
       }
       #swagger.responses[201] = {
         description: 'Species created successfully',
         schema: { $ref: '#/components/schemas/Species' }
       }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const newSpecies = await speciesController.createSpecies(req.body)
    res.status(201).json(newSpecies)
})

router.put('/:id', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Species']
       #swagger.summary = 'Update species'
       #swagger.description = 'Update an existing species'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Species ID',
         required: true,
         type: 'integer'
       }
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { 
               type: 'object',
               properties: {
                 name: { type: 'string', example: 'Updated Cat' }
               }
             }
           }
         }
       }
       #swagger.responses[200] = {
         description: 'Species updated successfully',
         schema: { $ref: '#/components/schemas/Species' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const updatedSpecies = await speciesController.updateSpecies(parseInt(req.params.id), req.body)
    if (!updatedSpecies) {
        return res.status(404).json({ message: 'Species not found' })
    }
    res.json(updatedSpecies)
})

router.delete('/:id', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Species']
       #swagger.summary = 'Delete species'
       #swagger.description = 'Delete a species by ID'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Species ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[204] = { description: "Species deleted successfully" }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    await speciesController.deleteSpecies(parseInt(req.params.id))
    res.status(204).send()
})

export default router 