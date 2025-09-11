import express from 'express';
import { loginController, logoutController, signupController } from '../Controllers/UserController.js';
import { protectRoute } from '../middleware/protectRoute.js';
const router = express.Router();

router.post('/signup', signupController);
router.post('/Login',loginController);
router.post('/logout',protectRoute,logoutController);


export default router;
