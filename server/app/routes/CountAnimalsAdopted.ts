import { Router } from 'express'
import { AnimalsCountController } from '../controllers/AnimalsCountController'
import { checkIfAuthenticated } from '../middlewares/auth-middleware'

const router = Router()
const animalsCountController = new AnimalsCountController()

router.get('/', checkIfAuthenticated, async (req, res) => {
  /* #swagger.tags = ['Statistics']
     #swagger.summary = 'Get count of adopted animals'
     #swagger.description = 'Retrieve the total number of animals that have been adopted'
     #swagger.responses[200] = {
       description: 'Count of adopted animals',
       schema: { $ref: '#/components/schemas/CountResponse' }
     }
     #swagger.responses[401] = { description: "Unauthorized" }
  */
  const animalsCount = await animalsCountController.getCountAnimalsAdopted()
  res.json(animalsCount)
})

export default router