import { Document, Types } from "mongoose"

export interface ICartItem {
  productId: Types.ObjectId
  quantity: number
}

export interface IUser extends Document {
  email: string
  password?: string // Opcional para usuarios de Google
  name: string
  documento: string // Número de documento único
  rol: "admin" | "user"
  provider?: string // "credentials" o "google"
  image?: string
  emailVerified?: Date
  cart?: ICartItem[]
  createdAt?: Date
  updatedAt?: Date
}

export interface UserLoginData {
  documento: string
  password: string
}

export interface UserRegistrationData {
  email: string
  password: string
  name: string
  documento: string
  rol?: "admin" | "user"
}

export interface UserResponse {
  id: string
  email: string
  rol: "admin" | "user"
  name: string
  documento: string
  image?: string
  provider?: string
}