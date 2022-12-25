import express from "express";
import {
    getAdmins,
    getAdminById,
    createAdmin,
    updateAdmin,
    deleteAdmin
} from "../controllers/Admin.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/admin',verifyUser, getAdmins);
router.get('/admin/:id',verifyUser, getAdminById);
router.post('/admin',verifyUser, createAdmin);
router.patch('/admin/:id',verifyUser, updateAdmin);
router.delete('/admin/:id',verifyUser, deleteAdmin);

export default router;