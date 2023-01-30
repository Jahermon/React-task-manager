import express from "express";

const router = express.Router();

import { registrar,autenticar,confirmar,olvidePassword,comprobarToken } from "../controllers/usuarioController.js";

//Autenticacion, Registro y Confirmacion de Usuarios
router.post('/', registrar) // crea un nuevo user
router.post('/login', autenticar) // crea un nuevo user
router.get('/confirmar/:token', confirmar) // confirmar user con token
router.post('/olvide-password',olvidePassword)
router.get('/olvide-password/:token',comprobarToken)
export default router;