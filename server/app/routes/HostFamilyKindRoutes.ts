import { Router } from 'express'
import { HostFamilyKindController } from '../controllers/HostFamilyKindController'
import { checkIfAuthenticated } from '../middlewares/auth-middleware'

const router = Router()
const hostFamilyKindController = new HostFamilyKindController()

router.get('/', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Host Family Kinds']
       #swagger.summary = 'Get all host family kinds'
       #swagger.description = 'Retrieve a list of all host family kinds (care types)'
       #swagger.responses[200] = {
         description: 'List of host family kinds',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: { $ref: '#/components/schemas/HostFamilyKind' }
             }
           }
         }
       }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const kinds = await hostFamilyKindController.getAllHostFamilyKinds()
    res.json(kinds)
})

router.get('/:id', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Host Family Kinds']
       #swagger.summary = 'Get host family kind by ID'
       #swagger.description = 'Retrieve a specific host family kind by its ID'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Host family kind ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[200] = {
         description: 'Host family kind details',
         schema: { $ref: '#/components/schemas/HostFamilyKind' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const kind = await hostFamilyKindController.getHostFamilyKindById(parseInt(req.params.id))
    if (!kind) {
        return res.status(404).json({ message: 'Host family kind not found' })
    }
    res.json(kind)
})

router.post('/', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Host Family Kinds']
       #swagger.summary = 'Create new host family kind'
       #swagger.description = 'Create a new host family kind (care type)'
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateHostFamilyKindRequest' }
           }
         }
       }
       #swagger.responses[201] = {
         description: 'Host family kind created successfully',
         schema: { $ref: '#/components/schemas/HostFamilyKind' }
       }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const newKind = await hostFamilyKindController.createHostFamilyKind(req.body)
    res.status(201).json(newKind)
})

router.put('/:id', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Host Family Kinds']
       #swagger.summary = 'Update host family kind'
       #swagger.description = 'Update an existing host family kind'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Host family kind ID',
         required: true,
         type: 'integer'
       }
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateHostFamilyKindRequest' }
           }
         }
       }
       #swagger.responses[200] = {
         description: 'Host family kind updated successfully',
         schema: { $ref: '#/components/schemas/HostFamilyKind' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const updatedKind = await hostFamilyKindController.updateHostFamilyKind(parseInt(req.params.id), req.body)
    if (!updatedKind) {
        return res.status(404).json({ message: 'Host family kind not found' })
    }
    res.json(updatedKind)
})

router.delete('/:id', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Host Family Kinds']
       #swagger.summary = 'Delete host family kind'
       #swagger.description = 'Delete a host family kind by ID'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'Host family kind ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[204] = { description: "Host family kind deleted successfully" }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    await hostFamilyKindController.deleteHostFamilyKind(parseInt(req.params.id))
    res.status(204).send()
})

export default router 