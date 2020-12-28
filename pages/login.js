import React, { useState } from 'react'
import Router from 'next/router'
import Layout from '../components/layout/Layout'
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario'
// Extrae el index.js!
import firebase from '../firebase'
// hook
import useValidation from '../hooks/useValidation'
import validarIniciarSession  from '../validacion/validarIniciarSession'

export default function Login() {

	// Estado que maneje el error
	const [error, guardarError] = useState(false)

	const STATE_INICIAL = {
		email: 'articdj@hotmail.com',
		password: '123456'
	}

	const {
		valores,
		errores,
		// submitForm,
		handleSubmit,
		handleChange,
		handleBlur
	} = useValidation(STATE_INICIAL, validarIniciarSession, iniciarSesion)

	const {email, password} = valores

	async function iniciarSesion() {
		try {
			await firebase.login(email, password)
			Router.push('/') // Router de Nextjs
		} catch (error) {
			console.error('Hubo un error al iniciar session', error.message); // message es de firebase
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
					}}>Iniciar Sesión</h1>
					<Formulario
						onSubmit={handleSubmit}
						noValidate
					>

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
							value="Iniciar Sesión"
						>
						</InputSubmit>
					</Formulario>
				</>
			</Layout>
		</div>
	)
}