import Usuario from "../models/Usuario.js";
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";

const registrar = async (req, res) => {
    //Evitar registros duplicados
    //extraemos email del body
    const { email } = req.body
    //comprobar si el usuario ya existe en la db
    const existeUsuario = await Usuario.findOne({ email })

    //si existe usuario duplicado
    if (existeUsuario) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        const usuarioAlmacenado = await usuario.save()
        res.json(usuarioAlmacenado)
    } catch (error) {
        console.log(error)
    }

}

const autenticar = async (req, res) => {
    //extraemos los campos a comprobar
    const { email, password } = req.body

    // comprobar si el usuario existe
    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("El Usuario no existe")
        return res.status(404).json({ msg: error.message })
    }

    //comprobar si el usuario esta confirmado

    if (!usuario.confirmado) {
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({ msg: error.message })
    }
    //comprobar su password
    if (await usuario.comprobarPassword(password)) {
        res.json({
            _id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario._id)
        })
    } else {
        const error = new Error("El Password es incorrecto")
        return res.status(403).json({ msg: error.message })
    }
}

const confirmar = async (req, res) => {

    const { token } = req.params
    const usuarioConfirmar = await Usuario.findOne({ token })


    if (!usuarioConfirmar) {
        const error = new Error("Token no valido")
        return res.status(403).json({ msg: error.message })
    }

    try {
        usuarioConfirmar.confirmado = true
        usuarioConfirmar.token = ""
        await usuarioConfirmar.save();
        res.json({ msg: 'Usuario Confirmado Correctamente' })
    } catch (error) {
        console.log(error)
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body

    const usuario = await Usuario.findOne({ email })

    if (!usuario) {
        const error = new Error("El Usuario no existe")
        return res.status(404).json({ msg: error.message })
    }

    try {
        usuario.token = generarId()
        await usuario.save()
        res.json({ mesg: "Hemos enviado un email con las instrucciones" })
    } catch (error) {
        console.log(error)
    }
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ token })

    if (tokenValido) {
        res.json({ msg: "Token valido y el user existe" })
    } else {
        const error = new Error("El Token no es valido")
        return res.status(404).json({ msg: error.message })
    }
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ token })

    if (usuario) {
        usuario.password = password
        usuario.token = ''
        try {
            await usuario.save()
            res.json({ msg: "Password modificado correctamente" })
        } catch (error) {
            console.log(error)
        }
    } else {
        const error = new Error("El Token no es valido")
        return res.status(404).json({ msg: error.message })
    }
}


export {
    registrar,
    autenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword
};