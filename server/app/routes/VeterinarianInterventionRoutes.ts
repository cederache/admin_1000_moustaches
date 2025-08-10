import { Router } from 'express'
import { VeterinarianInterventionController } from '../controllers/VeterinarianInterventionController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'
import { checkIfPermitted, Method } from '../middlewares/permission-middleware'
import { Ressource } from '../types/ressource'

const router = Router()
const interventionController = new VeterinarianInterventionController()

router.get('/', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_HIST_VETO, Method.GET), async (req, res) => {
    /* #swagger.tags = ['Veterinary Interventions']
       #swagger.summary = 'Get all veterinary interventions'
       #swagger.description = 'Retrieve a list of all veterinary interventions in the system'
       #swagger.responses[200] = {
         description: 'List of veterinary interventions',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: { $ref: '#/components/schemas/VeterinarianIntervention' }
             }
           }
         }
       }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const interventions = await interventionController.getAllInterventions()
    res.json(interventions)
})

router.get('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_HIST_VETO, Method.GET), async (req, res) => {
    /* #swagger.tags = ['Veterinary Interventions']
       #swagger.summary = 'Get veterinary intervention by ID'
       #swagger.description = 'Retrieve a specific veterinary intervention by its ID'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Veterinary intervention ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[200] = {
         description: 'Veterinary intervention details',
         schema: { $ref: '#/components/schemas/VeterinarianIntervention' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const intervention = await interventionController.getInterventionById(parseInt(req.params.id))
    if (!intervention) {
        return res.status(404).json({ message: 'Intervention not found' })
    }
    res.json(intervention)
})

router.post('/', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_HIST_VETO, Method.POST), async (req, res) => {
    /* #swagger.tags = ['Veterinary Interventions']
       #swagger.summary = 'Create new veterinary intervention'
       #swagger.description = 'Record a new veterinary intervention for an animal'
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateVeterinarianInterventionRequest' }
           }
         }
       }
       #swagger.responses[201] = {
         description: 'Veterinary intervention created successfully',
         schema: { $ref: '#/components/schemas/VeterinarianIntervention' }
       }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const newIntervention = await interventionController.createIntervention(req.body)
    res.status(201).json(newIntervention)
})

router.put('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_HIST_VETO, Method.PUT), async (req, res) => {
    /* #swagger.tags = ['Veterinary Interventions']
       #swagger.summary = 'Update veterinary intervention'
       #swagger.description = 'Update an existing veterinary intervention'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Veterinary intervention ID',
         required: true,
         type: 'integer'
       }
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateVeterinarianInterventionRequest' }
           }
         }
       }
       #swagger.responses[200] = {
         description: 'Veterinary intervention updated successfully',
         schema: { $ref: '#/components/schemas/VeterinarianIntervention' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    const updatedIntervention = await interventionController.updateIntervention(parseInt(req.params.id), req.body)
    if (!updatedIntervention) {
        return res.status(404).json({ message: 'Intervention not found' })
    }
    res.json(updatedIntervention)
})

router.delete('/:id', checkIfAuthenticated, getAuthUser, checkIfPermitted(Ressource.PET_HIST_VETO, Method.DELETE), async (req, res) => {
    /* #swagger.tags = ['Veterinary Interventions']
       #swagger.summary = 'Delete veterinary intervention'
       #swagger.description = 'Remove a veterinary intervention record'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Veterinary intervention ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[204] = { description: 'Veterinary intervention deleted successfully' }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[403] = { description: "Forbidden" }
    */
    await interventionController.deleteIntervention(parseInt(req.params.id))
    res.status(204).send()
})

export default router 