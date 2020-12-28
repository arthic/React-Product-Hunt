import React, {useContext} from 'react'
import styled from '@emotion/styled'
import Link from 'next/link'
// import {css} from '@emotion/react'

import {FirebaseContex} from '../../firebase'

import {Buscar}  from '../ui/Buscar'
import {Navegación}  from './Navegación'
import {Boton} from '../ui/Boton'

const ContenedorHeader = styled.div`
	max-width: 1200px;
	width: 95%;
	margin: 0 auto;
	@media (min-width:768px) {
		display: flex;
		justify-content: space-between;
	}
`

const Logo = styled.a`
	color: var(--naranja);
	font-size: 4rem;
	line-height: 0;
	font-weight: 700;
	font-family: 'Roboto Slab', serif;
	margin-right: 2rem;
	cursor: pointer;
`

const BorderHeader = styled.div`
	border-bottom: 2px solid var(--gris3);
	padding: 1rem 0;
`
const ContenedorSesion = styled.div`
	display: flex;
	align-items: center;
`

const ContenedorMenu = styled.div`
	display:flex;
	align-items: center;
	flex-wrap: wrap;

	@media(max-width: 500px){
		padding: 1rem;
	}
`
const P = styled.p`
	margin-right: 2rem;
	span {
		font-weight: 700;
	}
`
export const Header = () => {

	const {usuario, firebase} = useContext(FirebaseContex)

	return (
		<>
		{/* <div
			css={css`
				border-bottom: 2px solid var(--gris3);
				padding: 1rem 0;
			`}
		> */}
			<BorderHeader>
				<ContenedorHeader >
					<ContenedorMenu>
						<Link href="/" >
							<Logo>P</Logo>
						</Link>

						<Buscar />

						<Navegación />
					</ContenedorMenu>

					<ContenedorSesion>
						<>
						{ usuario ? (
							<>
								<P>Hola: <span>{usuario.displayName}</span></P>

								<Boton
									bgColor={true}
									onClick={() => firebase.cerrarSession()}
								>Cerrar Sesión</Boton>
							</>
						) : (
							<>
								<Link href="/login">
									<Boton
										bgColor={true}
										css={{
											marginRight: '2rem'
										}}
									>
									Login</Boton>
								</Link>

								<Link href="/crear-cuenta">
									<Boton>Crear Cuenta</Boton>
								</Link>
							</>
						)}
						</>
					</ContenedorSesion>
				</ContenedorHeader>
			</BorderHeader>
		</>
	)
}
