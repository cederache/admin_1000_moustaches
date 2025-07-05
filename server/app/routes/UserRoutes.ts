import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { checkIfAuthenticated, getAuthUser } from '../middlewares/auth-middleware'

const router = Router()
const userController = new UserController()

router.get('/', checkIfAuthenticated, async (req, res) => {
    const users = await userController.getAllUsers()
    res.json(users)
})

router.get('/me', checkIfAuthenticated, async (req, res) => {
    if (!req.authEmail) {
        return res.status(401).send({ error: 'Unauthorized' })
    }
    const user = await userController.getUserByEmail(req.authEmail)
    res.json(user)
})

router.get('/:id', checkIfAuthenticated, async (req, res) => {
    const users = await userController.getUserById(parseInt(req.params.id))
    res.json(users)
})

router.post('/', checkIfAuthenticated, async (req, res) => {
    const newUser = await userController.createUser(req.body)
    res.status(201).json(newUser)
})

router.put('/:id', checkIfAuthenticated, async (req, res) => {
    const updatedUser = await userController.updateUser(parseInt(req.params.id), req.body)
    res.json(updatedUser)
})

router.delete('/:id', checkIfAuthenticated, async (req, res) => {
    await userController.deleteUser(parseInt(req.params.id))
    res.status(204).send()
})

export default router 