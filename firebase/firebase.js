import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

import firebaseConfig from './config'

class Firebase {
	constructor() {
		// Si no hay app creada, creala
		if(!app.apps.length) {
			app.initializeApp(firebaseConfig)
		}
		this.auth = app.auth()
		this.db = app.firestore()
		this.storage = app.storage()
	}

	// Registrar usuario
	async registrar(nombre, email, password) {
		const nuevoUsuario = await this.auth.createUserWithEmailAndPassword(
			email,
			password
		)

		// Actualizar perfil del usuario
		// Crea y actualiza con el mismo nombre que le estamos pasando
		return await nuevoUsuario.user.updateProfile({
			displayName: nombre
		})
	}

	// Iniciar Sesión
	async login(email, password) {
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	// Cerrar session
	async cerrarSession() {
		await this.auth.signOut()
	}
}

const firebase = new Firebase()
export default firebase