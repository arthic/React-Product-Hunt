import React, { useState, useContext } from 'react'
import Router, {useRouter} from 'next/router'
import Layout from '../components/layout/Layout'
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario'
import {Error404} from '../components/layout/404'
// Extrae el index.js!
import {FirebaseContex} from '../firebase'
// npm i react-firebase-file-uploader
import FileUploader from 'react-firebase-file-uploader'
// hook
import useValidation from '../hooks/useValidation'
import validarCrearProducto  from '../validacion/validarCrearProducto'

const STATE_INICIAL = {
	nombre: '',
	empresa: '',
	imagen: '',
	url: '',
	descripcion: ''
}

export default function NuevoProducto() {

	// state de las imagenes
	const [nombreimagen, guardarNombre] = useState('')
	const [subiendo, guardarSubiendo] = useState(false)
	const [progreso, guardarProgreso] = useState(0)
	const [urlimagen, guardarUrlImagen] = useState('')

	// Estado que maneje el error
	const [error, guardarError] = useState(false)

	const {
		valores,
		errores,
		// submitForm,
		handleSubmit,
		handleChange,
		handleBlur
	} = useValidation(STATE_INICIAL, validarCrearProducto, crearProducto)

	const {nombre, empresa, imagen, url, descripcion} = valores

	// hook de Routing para redireccionar
	const router = useRouter()

	// context con las operaciones CRUD de firebase
	const {usuario, firebase} = useContext(FirebaseContex)

	async function crearProducto() {

		// Si el usuario no esta autenticado llevar al login
		if(!usuario) {
			return router.push('/login')
		}

		// Crear el objeto de un nuevo producto
		const producto = {
			nombre,
			empresa,
			// imagen,
			url,
			urlimagen,
			descripcion,
			votos: 0,
			comentarios: [],
			creado: Date.now(),
			creador: {
				id: usuario.uid,
				nombre: usuario.displayName
			},
			haVotado: []
		}

		// Insertarlo en la DB
		// npm i react-firebase-file-uploader
		await firebase.db.collection('productos').add(producto)
		return router.push('/')
	}

	const handleUploadStart = () => {
		guardarProgreso(0)
		guardarSubiendo(true) //Cambia el hook
	}

	const handleProgress = async (progreso, task) => {
		console.log(progreso);
		guardarProgreso(progreso)

		if(progreso === 100) {
			handleUploadSuccess(task.snapshot.ref.name)
		}
	}

	const handleUploadError = error => {
		guardarSubiendo(error)
		console.error(error)
	}

	const handleUploadSuccess = async nombre => {
		guardarProgreso(100)
		guardarSubiendo(false)
		guardarNombre(nombre)
		await firebase.storage
			.ref("productos")
			.child(nombre)
			.getDownloadURL()
			.then(url => {
				console.log(url)
				guardarUrlImagen(url)
			});
	};

	return (
		<div>
			<Layout >
				{/* Si no hay usuario */}
				{!usuario ? <Error404 /> : (
					<>
                    <h1 css={{
							textAlign: 'center',
							marginTop: '5rem',
					}}>Nuevo Producto</h1>
					<Formulario
						onSubmit={handleSubmit}
						noValidate
					>
						<fieldset>
							<legend>Infromación General</legend>
							<Campo>
								<label htmlFor="nombre">Nombre</label>
								<input
									type="text"
									id="nombre"
									placeholder="Nombre del Producto"
									name="nombre"
									value={nombre}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</Campo>

							{errores.nombre && <Error>{errores.nombre}</Error>}

							<Campo>
								<label htmlFor="empresa">Empresa</label>
								<input
									type="text"
									id="empresa"
									placeholder="Nombre Empresa o Compañía"
									name="empresa"
									value={empresa}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</Campo>

							{errores.empresa && <Error>{errores.empresa}</Error>}

							<Campo>
								<label htmlFor="imagen">Imagen</label>
								<FileUploader
									accept="imagen/*" //Cualquier formato
									id="imagen"
									name="imagen"
									storageRef={firebase.storage.ref("productos")} // Ref al doc de firebase
									onUploadStart={handleUploadStart}
									onUploadError={handleUploadError}
									// onUploadSuccess={handleUploadSuccess}
									onProgress={handleProgress}
									randomizeFilename // genera nombre aleatorio

								/>
							</Campo>

							<Campo>
								<label htmlFor="url">URL</label>
								<input
									type="url"
									placeholder="URL de tu producto"
									id="url"
									name="url"
									value={url}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
							</Campo>

							{errores.url && <Error>{errores.url}</Error>}
						</fieldset>
						<fieldset>
							<legend>Sobre tu Producto</legend>
							<Campo>
								<label htmlFor="descripcion">Descripción</label>
								<textarea
									id="descripcion"
									name="descripcion"
									value={descripcion}
									onChange={handleChange}
									onBlur={handleBlur}
									/>
							</Campo>

							{errores.descripcion && <Error>{errores.descripcion}</Error>}
							{/* Error al crear cuenta viene del state */
							error && <Error>{error}</Error>
							}
						</fieldset>

						<InputSubmit
							type="submit"
							value="Crear Producto"
						>
						</InputSubmit>
					</Formulario>
				</>

				)}
			</Layout>
		</div>
	)
}