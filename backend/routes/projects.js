import express from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import {
  createProject,
  getProjects,
  getProject,
  deleteProject,
} from '../controllers/projectController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post(
  '/',
  [body('name').trim().notEmpty().withMessage('Project name is required')],
  createProject
);

router.get('/', getProjects);
router.get('/:id', getProject);
router.delete('/:id', deleteProject);

export default router;

