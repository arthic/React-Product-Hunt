import React, {useEffect, useState} from 'react';
// Index de firebase
import firebase from '../firebase'

// Parece que se tiene que declarar de esta forma para que el
function useAutenticacion() {
	const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null)

	useEffect(() => {
		const unsuscribe = firebase.auth.onAuthStateChanged(usuario => {
			if(usuario) {
				guardarUsuarioAutenticado(usuario)
			} else {
				guardarUsuarioAutenticado(null)
			}
		})
		return () => unsuscribe()
	}, []) // Se queda en blanco porque se ejecuta una vez

	return usuarioAutenticado
}

export default useAutenticacion