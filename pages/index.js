import React from 'react';
// import Head from 'next/head'
// import '../public/static/css/app.css'

// npm i @emotion/react @emotion/core @emotion/styled
// npm i babel-plugin-emotion @emotion/babel-preset-css-prop
// npm install --save @babel/polyfill
// npm install --save-dev @babel/core @babel/cli @babel/preset-env
import Layout from '../components/layout/Layout'
import { DetallesProducto } from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

// import styled from '@emotion/styled'

/* const Heading = styled.h1`
    color: red;
` */
export default function Home() {

    // De esta froma coloca en el state los productos
    const {productos} = useProductos('creado')

    return (
            <div>
                <Layout >
                    <div className="listado-productos">
                        <div className="contenedor">
                            <ul className="bg-white">
                                {/* Del state */}
                                {productos.map(producto => (
                                    <DetallesProducto
                                        key={producto.id}
                                        producto={producto}
                                    />
                                ))}
                            </ul>
                        </div>
                    </div>
                </Layout>


                {/* <Heading>Inicio</Heading> */}
                {/* <style jsx>{`
                    h1 {
                        color: red;
                    }
                `}</style> */}
            </div>
    )
}
