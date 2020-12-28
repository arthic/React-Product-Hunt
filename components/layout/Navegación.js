import React, {useContext} from 'react'
import Link from 'next/link'
import styled from '@emotion/styled'
// Contexto de firebase
import {FirebaseContex} from '../../firebase'


const Nav = styled.nav`
	padding-left: 2rem;

	a {
		font-size: 1.8rem;
		margin-left: 2rem;
		color: var(--gris2);
		font-family: 'PT Sans',sans-serif;

		&:last-of-type {
			margin-right: 0;
		}
	}
	@media(max-width: 500px){
		margin: 0 auto;
		padding: 3rem 0;
	}
`

export const Navegación = () => {

	const {usuario} = useContext(FirebaseContex)

	return (
		<Nav>
			<Link href="/" >
				<a>Inicio</a>
			</Link>
			<Link href="/populares" >
				<a>Populares</a>
			</Link>
			{
				usuario && // Si existe el usuario, retorna
				<Link href="/nuevo-producto" >
					<a>Nuevo Producto</a>
				</Link>
			}
		</Nav>
	)
}
