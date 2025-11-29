import mongoose from "mongoose";

const dbConnection = async (): Promise<void> => {
  try {
    // Si ya está conectado, no volver a conectar
    if (mongoose.connection.readyState === 1) {
      return;
    }

    const mongodbAtlas = process.env.MONGODB_URI || "";
    
    if (!mongodbAtlas) {
      throw new Error("MONGODB_URI no está definida en las variables de entorno");
    }

    await mongoose.connect(mongodbAtlas);
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error en la base de datos - Hable con el administrador");
  }
};

export default dbConnection;
