import express from 'express';
import { searchAll } from '../controllers/searchController.js';
const router = express.Router();

router.get('/', searchAll); // /api/search?q=something

export default router;
