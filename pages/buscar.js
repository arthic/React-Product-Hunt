import React, {useEffect, useState} from 'react'
import Layout from '../components/layout/Layout'
import {useRouter} from 'next/router'

import { DetallesProducto } from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

export default function Buscar() {

	// leer del router componentes
	const router = useRouter()
	const {query: {q}} = router

	// Todos los productos
	// Hook
	const {productos} = useProductos('creado')
	// state
	const [resultado, guardarResultado] = useState([])

	useEffect(() => {
		/* Pasar a minusculas porque en JS la busqueda seria
		diferente si se alterna mayusculas y minusculas */
		const busqueda = q.toLowerCase()
		const filtro = productos.filter(producto => {
			return (
				producto.nombre.toLowerCase().includes(busqueda) ||
				producto.descripcion.toLowerCase().includes(busqueda)
			)
		})
		guardarResultado(filtro)
	}, [q, productos])

	return (
		<div>
			<Layout >
				<div className="listado-productos">
                        <div className="contenedor">
                            <ul className="bg-white">
                                {/* Del state */}
                                {resultado.map(producto => (
                                    <DetallesProducto
                                        key={producto.id}
                                        producto={producto}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
			</Layout>
		</div>
	)
}
