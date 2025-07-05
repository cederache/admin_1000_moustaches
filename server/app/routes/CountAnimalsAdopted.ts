import { Router } from 'express'
import { AnimalsCountController } from '../controllers/AnimalsCountController'
import { checkIfAuthenticated } from '../middlewares/auth-middleware'

const router = Router()
const animalsCountController = new AnimalsCountController()

router.get('/', checkIfAuthenticated, async (req, res) => {
  const animalsCount = await animalsCountController.getCountAnimalsAdopted()
  res.json(animalsCount)
})

export default router