import App from 'next/app'
import firebase from '../firebase'
import {FirebaseContex} from '../firebase'
import useAutenticacion from '../hooks/useAutenticacion'

import '../styles/globals.css'

const MyApp = props => {

    const usuario = useAutenticacion()

    const {Component, pageProps} = props

    return <FirebaseContex.Provider
        // Se proveen los metodos en todos los componentes
        value={{
            // Contiene todos los metodos para interartuar con la BD
            firebase,
            usuario
        }}
    >
        <Component {...pageProps} />
    </FirebaseContex.Provider>
}
export default MyApp
