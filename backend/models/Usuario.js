import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    token: {
        type: String,
    },
    confirmado: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

//hook de mongoosse , se ejecuta antes de guardar el registro
usuarioSchema.pre('save', async function (next) {

    //Si no estamos modifiando el password, next() para pasar el middleware
    if(!this.isModified('password')){
        next();
    }
    //generamos el salt con las rondas de encriptacion
    const salt = await bcrypt.genSalt(10);
    //pasamos el string que haheamos y las rondas
    this.password = await bcrypt.hash(this.password, salt)
});

//creamos un metodo para comprobar la pasword en el schema
usuarioSchema.methods.comprobarPassword = async function (passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password)
}

const Usuario = mongoose.model("Usuario", usuarioSchema)

export default Usuario;