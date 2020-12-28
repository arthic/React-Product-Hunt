import React, {useEffect, useContext, useState} from 'react'
import {useRouter} from 'next/router'
import { Error404 } from '../../components/layout/404'
import Layout from '../../components/layout/Layout'
// Firebase
import {FirebaseContex} from '../../firebase'
import styled from '@emotion/styled'
// date-fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {es} from 'date-fns/locale'
// Styled components
import {Campo, InputSubmit} from '../../components/ui/Formulario'
import {Boton} from '../../components/ui/Boton'

const ContenedorProducto = styled.div`
	span {
		font-weight: 700;
	}
	@media(min-width: 768px){
		display: grid;
		grid-template-columns: 2fr 1fr;
		column-gap: 2rem;
	}
`
const CreadorProducto = styled.p`
	padding: .5rem 2rem;
	background-color: #da552f;
	color: #fff;
	text-transform: uppercase;
	font-weight: bold;
	display: inline-block;
	text-align: center;
`

const Producto = () => {

	// state
	const [producto, guardarProducto] = useState({})
	const [error, guardarError] = useState(false)
	const [comentario, guardarComentario] = useState({})
	// Inicia como true porque al renderizar queremos que haga consulta a la BD
	const [consultarDB, guardarConsultarDB] = useState(true)

	// Routing para obtener el id actual
	const router = useRouter()
	// id de la url
	const {query: {id}} = router

	// Context de firebase
	const {firebase, usuario} = useContext(FirebaseContex)

	/*React realiza varios renders a los componentes porque así
	funciona, por lo tanto al obtener del id de la url del router
	primero tenemos undefined y despues se dispara 2 veces
	con useEffect filtraremos ese undefined para evitar reventar
	la página, despues consultar la base de datos*/
	useEffect(() => {
		if(id && consultarDB) {
			const obtenerProducto = async () => {
				const productoQuery = await firebase.db.collection('productos').doc(id)
				const producto = await productoQuery.get() //Traer el producto
				// Si no existe el producto en la BD
				if(producto.exists) { //exists viene de firebase
					guardarProducto(producto.data()) // Colocamos en el state
					guardarConsultarDB(false) // Que no se itere la consulta
				} else {
					guardarError(true)
					guardarConsultarDB(false)
				}
			}
			obtenerProducto()
		}
		/* Este pendiente de los cambios de producto porque al votar,
		se va afectar la BD y se requiere renderizar el componente */
		// Ya no aplica por el state "consultarDB, guardarConsultarDB"
	}, [id])

	// && !error evita que se quede el cargando si hay un id no valido en la URL
	if(Object.keys(producto).length === 0 && !error) return 'Cargando...'

	const {
		comentarios,
		creado,
		descripcion,
		empresa,
		nombre,
		url,
		urlimagen,
		votos,
		creador,
		haVotado
	} = producto

	const votarProducto = () => {
		// Validar que usuario este autenticado
		if(!usuario){
			return router.push('./login')
		}
		// Obtener y sumar un nuevo voto
		const nuevoTotal = votos + 1
		// Verificar si el usuario actual ha votado
		if(haVotado.includes(usuario.uid)) return
		// Generar el uid del usuario que ha vodato
		const yaVoto = [...haVotado, usuario.uid]
		// Actualizar en la BD, queremos actualizar el campo votos con el nuevoTotal
		firebase.db.collection('productos').doc(id).update({
			votos: nuevoTotal,
			haVotado: yaVoto
		})
		// Actualizar el state
		guardarProducto({
			...producto, // Copia del state
			votos: nuevoTotal
		})
		// Hay un voto por lo tanto consultar a la BD
		guardarConsultarDB(true)

	}

	// Funciones para crear comentarios
	const comentarioChange = e => {
		guardarComentario({
			...comentario,
			[e.target.name] : e.target.value
		})
	}
	// Identifica si el comentario es del creador del producto
	const esCreador = id => {
		if(creador.id === id) {
			return true
		}
	}
	const agregarComentario = e => {
		e.preventDefault()
		// Validar que usuario este autenticado
		if(!usuario){
			return router.push('/login')
		}
		// Información extra al comentario, le dará forma al objeto
		comentario.usuarioId = usuario.uid
		comentario.usuarioNombre = usuario.displayName
		// Tomar copia de comentarios y agregarlos al array
		const nuevosComentarios = [...comentarios, comentario]
		// Actualizar BD
		firebase.db.collection('productos').doc(id).update({
			comentarios: nuevosComentarios
		})
		// Actualizar state
		guardarProducto({
			...producto,
			comentarios: nuevosComentarios // En el campo de comentarios pasamos los nuevos
		})
		// Hay un comentario por lo tanto consultar a la BD
		guardarConsultarDB(true)
	}

	// Borrar productos | Solo el creador puede hacerlo | Booleano
	const pruedeBorrar = () => {
		if(!usuario) return false

		if(creador.id === usuario.uid) {
			return true
		}
	}
	// Elimina producto de la BD
	const eliminarProducto = async () => {
		// Validar que usuario este autenticado
		if(!usuario){
			return router.push('/login')
		}
		if(creador.id !== usuario.uid) {
			return router.push('/')
		}

		try {
			await firebase.db.collection('productos').doc(id).delete()
			router.push('/')
		} catch (error) {
			console.error(error);
		}
	}
	return (
		<Layout>
		<>
		{error ? <Error404 /> : (
			<div className="contenedor">
			<h1 css={{
				marginTop: '5rem',
				textAlign: 'center',
			}}>{nombre}</h1>

			<ContenedorProducto>
				<div>
					<div css={{
							display: 'inline-flex',
							alignItems: 'center'
						}}>
						<img src="/static/img/reloj.png" css={{
							width: '36px',
							height: '30px'
						}}/>
						<p>&nbsp;{formatDistanceToNow(new Date(creado), {locale: es})}</p>
					</div>
						<p><span>Por:</span> {creador.nombre}</p>
						<p><span>Empresa:</span> {empresa}</p>
						<img src={urlimagen} />
						<p>{descripcion}</p>

					{
					(usuario && (
						<>
							<h2>Agrega tu comentario</h2>
							<form
								onSubmit={agregarComentario}
							>
								<Campo>
									<input
										type="text"
										name="mensaje"
										onChange={comentarioChange}
									/>
								</Campo>
								<InputSubmit
									type="submit"
									value="Agregar Comentario"
								/>
							</form>
						</>
					))
					}
					<h2 css={{
						margin: '2rem'
					}}>Comentarios</h2>

					{
					comentarios.length === 0 ?
					"Aún no hay comentarios"
					: (
						<ul>
							{comentarios.map((comentario, i) => (
								<li
									// Mezclar id del usuario con indice del array
									key={`${comentario.usuarioId}-${i}`}
									css={{
										border: '1px solid #e1e1e1',
										padding: '2rem'
									}}
								>
									<p>{comentario.mensaje}</p>
									<p>Escrito por: <span
										css={{
											fontWeight: 'bold'
										}}
									>{comentario.usuarioNombre}</span></p>
									{
										esCreador(comentario.usuarioId) &&
										<CreadorProducto>Es Creador</CreadorProducto>
									}
								</li>
							))}
						</ul>
					)
					}
				</div>
				<aside>
					<Boton
						target="_blank"
						bgColor="true"
						href={url}
					>Visitar URL</Boton>

					<div css={{
						marginTop: '5rem'
					}}>
						<p css={{
							textAlign: 'center',
						}}>{votos} Votos</p>
						{
							(usuario &&
								(<Boton
									onClick={votarProducto}
								>Votar</Boton>))
						}
					</div>
				</aside>
			</ContenedorProducto>
			{
				pruedeBorrar() &&
				<Boton
					onClick={eliminarProducto}
				css={{
					hover: {
						backgroundColor: '#e1e1e1'
					}
				}}>Eliminar Producto</Boton>
			}
			</div>
		)
		}
		</>
		</Layout>
	)
}
export default Producto