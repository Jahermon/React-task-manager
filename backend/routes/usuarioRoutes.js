import express from "express";

const router = express.Router();

import { registrar,autenticar } from "../controllers/usuarioController.js";

//Autenticacion, Registro y Confirmacion de Usuarios
router.post('/', registrar) // crea un nuevo user
router.post('/login', autenticar) // crea un nuevo user

export default router;