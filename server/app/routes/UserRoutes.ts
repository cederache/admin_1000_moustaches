import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'

const router = Router()
const userController = new UserController()

router.get('/', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Get all users'
       #swagger.description = 'Retrieve a list of all users in the system'
       #swagger.responses[200] = {
         description: 'List of users',
         content: {
           'application/json': {
             schema: {
               type: 'array',
               items: { $ref: '#/components/schemas/User' }
             }
           }
         }
       }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const users = await userController.getAllUsers()
    res.json(users)
})

router.get('/me', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Get current user'
       #swagger.description = 'Retrieve the currently authenticated user information'
       #swagger.responses[200] = {
         description: 'Current user details',
         schema: { $ref: '#/components/schemas/User' }
       }
       #swagger.responses[401] = { description: "Unauthorized" }
       #swagger.responses[404] = { description: "Not Found" }
    */
    if (!req.authEmail) {
        return res.status(401).send({ error: 'Unauthorized' })
    }
    const user = await userController.getUserByEmail(req.authEmail)
    res.json(user)
})

router.get('/:id', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Get user by ID'
       #swagger.description = 'Retrieve a specific user by their ID'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'User ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[200] = {
         description: 'User details',
         schema: { $ref: '#/components/schemas/User' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const users = await userController.getUserById(parseInt(req.params.id))
    res.json(users)
})

router.post('/', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Create new user'
       #swagger.description = 'Create a new user in the system'
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateUserRequest' }
           }
         }
       }
       #swagger.responses[201] = {
         description: 'User created successfully',
         schema: { $ref: '#/components/schemas/User' }
       }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const newUser = await userController.createUser(req.body)
    res.status(201).json(newUser)
})

router.put('/:id', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Update user'
       #swagger.description = 'Update an existing user'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'User ID',
         required: true,
         type: 'integer'
       }
       #swagger.requestBody = {
         required: true,
         content: {
           'application/json': {
             schema: { $ref: '#/components/schemas/CreateUserRequest' }
           }
         }
       }
       #swagger.responses[200] = {
         description: 'User updated successfully',
         schema: { $ref: '#/components/schemas/User' }
       }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[400] = { description: "Bad Request" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    const updatedUser = await userController.updateUser(parseInt(req.params.id), req.body)
    res.json(updatedUser)
})

router.delete('/:id', checkIfAuthenticated, async (req, res) => {
    /* #swagger.tags = ['Users']
       #swagger.summary = 'Delete user'
       #swagger.description = 'Delete a user by ID'
       #swagger.parameters['id'] = {
         in: 'path',
         description: 'User ID',
         required: true,
         type: 'integer'
       }
       #swagger.responses[204] = { description: "User deleted successfully" }
       #swagger.responses[404] = { description: "Not Found" }
       #swagger.responses[401] = { description: "Unauthorized" }
    */
    await userController.deleteUser(parseInt(req.params.id))
    res.status(204).send()
})

export default router 