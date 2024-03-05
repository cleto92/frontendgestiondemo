/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useMutation, gql} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';

const NUEVA_ENTRADA = gql`
  mutation nuevaEntrada($input: EntradaInput) {
    nuevaEntrada(input: $input) {
      proveedor
      numerofactura
      detalle
      tipo
      fecha
    }
  }
`;

const CrearEntrada = () => {
  const router = useRouter();
  const [nuevaEntrada] = useMutation(NUEVA_ENTRADA, {
    fetchPolicy: 'no-cache',
  });
  const [mensaje, guardarMensaje] = useState(null);

  const formik = useFormik({
    initialValues: {
      proveedor: '',
      numerofactura: '',
      detalle: '',
    },
    validationSchema: Yup.object({
      proveedor: Yup.string().required('El campo proveedor es obligatorio'),
      numerofactura: Yup.string().required('El campo Numero de Factura es obligatorio'),
      detalle: Yup.string().required('El campo detalle es obligatorio'),
    }),
    onSubmit: async (valores) => {
      const {proveedor, numerofactura, detalle} = valores;
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres registrar esta entrada?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, registrar!',
        cancelButtonText: 'No, cancelar',
      });
      if (result.isConfirmed) {
        try {
          const {data} = await nuevaEntrada({
            variables: {
              input: {
                proveedor,
                numerofactura,
                detalle,
              },
            },
          });
          console.log(data);
          Swal.fire(
              'Entrada registrada',
              'Click en OK, para ser redireccionado',
              'success',
          ).then(() => {
            // Redirigir después de 3 segundos
            setTimeout(() => {
              router.push('/Entradas');
            }, 3000);
          });
        } catch (error) {
          guardarMensaje(
              error.message.replace('ApolloError: ', '').replace('GraphQL error: ', ''),
          );
          setTimeout(() => {
            guardarMensaje(null);
          }, 5000);
        }
      }
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
      {mensaje && mostrarMensaje()}
      <div>
        <form onSubmit={formik.handleSubmit}>
          <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
            Ingresar Proveedor
          </p>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 mt-5 text-gray leading-tight focus:outline-none focus:shadow-outline"
            id="proveedor"
            type="proveedor"
            placeholder="Proveedor"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.proveedor}
          />
          <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
            Ingresar N°Factura
          </p>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 mt-5 text-gray leading-tight focus:outline-none focus:shadow-outline"
            id="numerofactura"
            type="numerofactura"
            placeholder="N°Factura"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.numerofactura}
          />
          <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
            Ingresar Detalle
          </p>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 mt-5 text-gray leading-tight focus:outline-none focus:shadow-outline"
            id="detalle"
            type="detalle"
            placeholder="Detalle"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.detalle}
          />
          <input
            type="submit"
            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
            value="Registrar Entrada"
          />
        </form>
      </div>
    </Layout>
  );
};

export default CrearEntrada;
