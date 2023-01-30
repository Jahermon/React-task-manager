import mongoose from 'mongoose'



const conectarDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        const connectionInfo = `${connection.connection.host}:${connection.connection.port}`;

        console.log(`MongoDb Conectado en:${connectionInfo} `)
    } catch (error) {
        console.log(`error al conectar db: ${error.message}`);
        //Fuerza que el proceso se termine
        process.exit(1);
    }
};

export default conectarDB ;