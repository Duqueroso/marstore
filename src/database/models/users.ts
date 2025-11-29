import { Schema, model, Model } from "mongoose";
import { IUser } from "@/types/user";

const usersSchema = new Schema({
    email: {
        type: String,
        required: [true, "El email es requerido"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Email inválido"]
    },
    password: {
        type: String,
        required: function(this: IUser) {
            // Solo requerido si no es usuario de Google
            return this.provider !== 'google';
        },
        minlength: [8, "La contraseña debe tener al menos 8 caracteres"]
    },
    name: {
        type: String,
        required: [true, "El nombre es requerido"],
        trim: true,
        maxlength: [100, "El nombre no puede exceder 100 caracteres"]
    },
    documento: {
        type: String,
        required: [true, "El documento es requerido"],
        unique: true,
        trim: true,
        match: [/^[0-9]{6,15}$/, "El documento debe contener solo números y tener entre 6 y 15 caracteres"]
    },
    provider: {
        type: String,
        enum: ["credentials", "google"],
        default: "credentials"
    },
    image: {
        type: String,
        trim: true
    },
    emailVerified: {
        type: Date
    },
    rol: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    cart: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    }]
}, {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false // Remueve __v
});

// Utiliza un patrón singleton para garantizar que solo se compile una instancia del modelo
let Users: Model<IUser>;
try {
    // Intenta obtener el modelo si ya existe
    Users = model<IUser>("users");
} catch {
    // Si el modelo no existe, créalo
    Users = model<IUser>("users", usersSchema);
}

export default Users;