/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable object-curly-spacing */
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { FaUser } from 'react-icons/fa';
import { useFormik } from 'formik';
import { GoPackageDependents } from 'react-icons/go';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';

const NUEVO_PRODUCTO = gql`
  mutation nuevoProducto($input: ProductoInput) {
    nuevoProducto(input: $input) {
      nombre
      stock
      detalle
    }
  }
`;

const NuevoProducto = () => {
  const router = useRouter();
  const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
    fetchPolicy: 'no-cache',
  });
  const [mensaje, guardarMensaje] = useState(null);
  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-1 w-full my-1 max-w-sm text-center mx-auto">
        <p className="font-bold text-red-500">{mensaje}</p>
      </div>
    );
  };

  const formik = useFormik({
    initialValues: {
      nombre: '',
      stock: '',
      detalle: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es obligatorio'),
      detalle: Yup.string().required('El detalle es obligatorio'),
      stock: Yup.number()
          .required('La cantidad es obligatoria')
          .positive('No se aceptan numeros negativos')
          .integer('Valor incorreto, ingresa un valor entero'),
    }),

    onSubmit: async (valores) => {
      const { nombre, stock, detalle } = valores;
      try {
        const { data } = await nuevoProducto({
          variables: {
            input: {
              nombre,
              stock,
              detalle,
            },
          },
        });
        Swal.fire(
            'Producto Creado',
            'Aguarde para ser redireccionado',
            'success',
        );
        setTimeout(() => {
          router.push('/Productos');
        }, 3000);
        console.log(data);
      } catch (error) {
        guardarMensaje(
            error.message.replace('ApolloError: ', '', 'GraphQL error: ', ''),
        );
        setTimeout(() => {
          guardarMensaje(null);
        }, 5000);
      }
    },
  });

  return (
    <>
      <Layout>
        {mensaje && mostrarMensaje()}
        <h1 className="text-2xl text-gray-800 font-light">
          Agregar Nuevo Producto
        </h1>
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <form
              className="bg-white shadow-sm px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4 flex items-center">
                <FaUser className="mr-2" />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                  htmlFor="nombre"
                >
                  Producto
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="nombre"
                  type="text"
                  placeholder="Ingresar nombre Producto"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nombre}
                />
              </div>
              <div className="mb-4 flex items-center">
                <FaUser className="mr-2" />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                  htmlFor="detalle"
                >
                  Detalle
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="detalle"
                  type="text"
                  placeholder="Ingresar detalle Producto"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.detalle}
                />
              </div>
              <div className="mb-4 flex items-center">
                <GoPackageDependents className="mr-4" />
                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                  htmlFor="stock"
                >
                  Stock
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="stock"
                  type="number"
                  placeholder="Ingresar cantidad Stock"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.stock}
                />
              </div>
              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                value="Agregar Producto"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NuevoProducto;
