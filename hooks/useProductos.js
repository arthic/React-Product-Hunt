import React, {useState, useEffect, useContext} from 'react';
import {FirebaseContex} from '../firebase'

const useProductos = orden => {

	const [productos, guardarProductos] = useState([])

	const {firebase} = useContext(FirebaseContex)

	useEffect(() => {
		const obtenerProductos = () => {
			// Traemos las colleciones de firebase
			// desc: orden descendente
			firebase.db.collection('productos').orderBy(orden, 'desc').onSnapshot(manejarSnapshot)
		}
		obtenerProductos()
	}, [])

	// El que realmente permite manejar los datos y permite iterarlos
	function manejarSnapshot(snapshot) {
		const productos = snapshot.docs.map(doc => {
			return {
				// Accedemos a los datos de cada documento
				id: doc.id,
				...doc.data()
			}
		})
		// Mandamos al state
		guardarProductos(productos)
	}

	return {
		productos
	}
}

export default useProductos
