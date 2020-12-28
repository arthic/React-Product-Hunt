import React, { useState } from 'react'
import Router from 'next/router'
import Layout from '../components/layout/Layout'
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario'
// Extrae el index.js!
import firebase from '../firebase'
// hook
import useValidation from '../hooks/useValidation'
import validarCrearCuenta  from '../validacion/validarCrearCuenta'

const STATE_INICIAL = {
	nombre: '',
	email: '',
	password: ''
}
export default function CrearCuenta() {

	// Estado que maneje el error
	const [error, guardarError] = useState(false)


	const {
		valores,
		errores,
		// submitForm,
		handleSubmit,
		handleChange,
		handleBlur
	} = useValidation(STATE_INICIAL, validarCrearCuenta, crearCuenta)

	const {nombre, email, password} = valores

	async function crearCuenta() {
		try {
			await firebase.registrar(nombre, email, password)
			// Al crear la cuenta, manda a la páigna principal
			Router.push('/') // Router de Nextjs
		} catch (error) {
			console.error('Hubo un error al crear el usuario', error.message); // message es de firebase
			guardarError(error.message)
		}
	}

	return (
		<div>
			<Layout >
				<>
                    <h1 css={{
							textAlign: 'center',
							marginTop: '5rem',
					}}>Crear Cuenta</h1>
					<Formulario
						onSubmit={handleSubmit}
						noValidate
					>
						<Campo>
							<label htmlFor="nombre">Nombre</label>
							<input
								type="text"
								id="nombre"
								placeholder="Tu Nombre"
								name="nombre"
								value={nombre}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{errores.nombre && <Error>{errores.nombre}</Error>}

						<Campo>
							<label htmlFor="email">Email</label>
							<input
								type="email"
								id="email"
								placeholder="Tu Email"
								name="email"
								value={email}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{errores.email && <Error>{errores.email}</Error>}

						<Campo>
							<label htmlFor="password">Password</label>
							<input
								type="password"
								id="password"
								placeholder="Tu password"
								name="password"
								value={password}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
						</Campo>

						{errores.password && <Error>{errores.password}</Error>}
						{/* Error al crear cuenta viene del state */
						error && <Error>{error}</Error>
						}

						<InputSubmit
							type="submit"
							value="Crear Cuenta"
						>
						</InputSubmit>
					</Formulario>
				</>
			</Layout>
		</div>
	)
}
