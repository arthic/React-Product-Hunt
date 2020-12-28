import React, { useEffect, useState } from 'react'

const useValidation = (stateInicial, validar, fn) => {

	const [valores, guardarValores] = useState(stateInicial)
	const [errores, guardarErrores] = useState({})
	const [submitForm, guardarSubmitForm] = useState(false)

	useEffect(() => {
		// Si se envia el formulario
		if(submitForm) {
			const noErrores = Object.keys(errores).length === 0;
			// Si no hay errores se ejecuta
			if(noErrores) {
				fn()
			}
			// Reinicia el formulario
			guardarSubmitForm(false)
		}
		// Dep. Errores para que este revisando todo el tiempo si los hay
	}, [errores])

	// Funcion que se ejecuta confrome el usuario escribe algo
	const handleChange = e => {
		guardarValores({
			...valores,
			[e.target.name] : e.target.value
		})
	}

	// Función que se ejecuta cuando el usuario hace submit
	const handleSubmit = e => {
		e.preventDefault()
		// validar viene de los parametros que recibe el hook
		const erroresValidacion = validar(valores)
		guardarErrores(erroresValidacion)
		guardarSubmitForm(true)
	}
	// Blur: Cuando esta escribiendo y se sale del input disparar alerta
	const handleBlur = () => {
		const erroresValidacion = validar(valores)
		guardarErrores(erroresValidacion)
	}

	return {
		valores,
		errores,
		// submitForm,
		handleSubmit,
		handleChange,
		handleBlur
	}
}

export default useValidation