/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, {useContext, useState} from 'react';
import Layout from '../components/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useMutation, gql} from '@apollo/client';
import PedidoContext from '../context/pedidosMayoristas/PedidoMayoristaContext';
import {useRouter} from 'next/router';
import AsignarProductos from '../components/Pedidos/AsignarProductos';
import Resumen from '../components/Pedidos/Resumen';
import Swal from 'sweetalert2';

const NUEVA_SALIDA = gql`
  mutation nuevaSalida($input: SalidaInput) {
    nuevaSalida(input: $input) {
      tecnico
      fecha
      detalle
      tipo
      productos {
        cantidad
        id
        nombre
      }
    }
  }
`;

const CrearSalida = () => {
  const [nuevaSalida] = useMutation(NUEVA_SALIDA, {
    fetchPolicy: 'no-cache',
  });
  const [mensaje, guardarMensaje] = useState(null);
  const router = useRouter();
  const pedidoContext = useContext(PedidoContext);
  const {productos} = pedidoContext;

  const formik = useFormik({
    initialValues: {
      tecnico: '',
      detalle: '',
    },
    validationSchema: Yup.object({
      tecnico: Yup.string().required('El campo Tecnico es obligatorio'),
      detalle: Yup.string().required('El campo detalle es obligatorio'),
    }),
    onSubmit: async (valores) => {
      const {tecnico, detalle} = valores;

      Swal.fire({
        icon: 'question',
        title: '¿Confirmar salida?',
        text: 'Por favor, confirma si deseas registrar la salida.',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const respuesta = await nuevaSalida({
              variables: {
                input: {
                  tecnico,
                  detalle,
                  productos: productos.map((p) => ({
                    cantidad: p.cantidad,
                    id: p.id,
                    nombre: p.nombre,
                  })),
                },
              },
            });

            Swal.fire({
              icon: 'success',
              title: '¡Salida Registrada!',
              text: 'La salida fue agregada correctamente.',
              confirmButtonText: 'OK',
            }).then(() => {
              router.push('/Salidas');
            });
          } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message.replace('ApolloError: ', '').replace('GraphQL error: ', ''),
            });
          }
        }
      });
    },
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-1 w-full my-1 max-w-sm text-center mx-auto">
        <p className="font-bold text-red-500">{mensaje}</p>
      </div>
    );
  };


  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Crear Nueva Salida</h1>
      {mensaje && mostrarMensaje()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tecnico">
                Técnico
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="tecnico"
                type="text"
                placeholder="Nombre del Técnico"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.tecnico}
              />
              {formik.touched.tecnico && formik.errors.tecnico ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.tecnico}</p>
                </div>
              ) : null}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detalle">
                Detalle
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="detalle"
                placeholder="Detalle de la Salida"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.detalle}
              ></textarea>
              {formik.touched.detalle && formik.errors.detalle ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.detalle}</p>
                </div>
              ) : null}
            </div>

            <AsignarProductos />
            <Resumen />

            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value="Registrar Salida"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CrearSalida;
