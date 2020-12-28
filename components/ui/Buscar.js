import React, {useState} from 'react'
import styled from '@emotion/styled'
import Router from 'next/router'
// import {css} from '@emotion/react'

const InputText = styled.input`
	padding: 1rem;
	border: none;
	min-width: 280px;
`

const InputSubmit = styled.button`
	height: 4rem;
	width: 4rem;
	background-size: 4rem;
	background-image: url('/static/img/buscar.png');
	background-repeat: no-repeat;
	background-color: #fff;
	border: none;
	text-indent: -9999px;
	transition: ease-in .2s;
	&:hover {
		cursor: pointer;
		background-color: #e1e1e1;
	}
`

const Form = styled.form`
	display: inline-flex;
	border: 1px solid var(--gris3);
`


export const Buscar = () => {

	const [busqueda, guardarBusqueda] = useState('')

	const buscarProducto = e => {
		e.preventDefault()
		// Que no haga si nada si no hay texto
		if(busqueda.trim() === '') return

		// Pasas a un componente / Redireccionar a /buscar
		Router.push({
			pathname: '/buscar',
			query: {q: busqueda} // 1° llave, 2° valor
		})

	}
	return (
		<>
			<Form
				onSubmit={buscarProducto}
			>
				<InputText
					type="text"
					placeholder="Buscar Productos"
					onChange={e=> guardarBusqueda(e.target.value)}
				/>
				<InputSubmit type="submit">
					Buscar
				</InputSubmit>
			</Form>
		</>
	)
}
