export default function validarCrearProducto(valores) {

	let errores = {}

	// Validar usuario
	if(!valores.nombre) {
		errores.nombre = 'El Nombre es obligatorio'
	}

	// Validar empresa
	if(!valores.empresa) {
		errores.empresa = "Nombre de Empresa es obligatorio"
	}

	// Validar URL
	if(!valores.url) {
		errores.url = "La URL del Producto es obligatoria"
	} else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)) {
		errores.url = "La URL no es válida o está mal formateada"
	}

	// Validar imagen
	// Validar descripcion
	if(!valores.descripcion) {
		errores.descripcion = "Agrega una descripción de tu producto"
	}

	return errores
}
