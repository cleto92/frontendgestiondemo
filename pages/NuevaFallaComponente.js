/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
import React, {useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import {useMutation, gql} from '@apollo/client';
import Layout from '../components/Layout';
import {useRouter} from 'next/router';

const NUEVA_FALLA_COMPONENTE = gql `
mutation nuevaFallaComponente($input: FallasComponenteInput) {
  nuevaFallaComponente(input: $input) {
productos
detalle
fecha
tecnico
numerocliente
}
}
`;


const NuevaFallaComponente = () => {
  const [mensaje, guardarMensaje] = useState(null);
  const [nuevaFallaComponente] = useMutation(NUEVA_FALLA_COMPONENTE, {
    fetchPolicy: 'no-cache',
  });
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      productos: '',
      detalle: '',
      tecnico: '',
      numerocliente: '',
    },
    validationSchema: Yup.object({
      productos: Yup.string().required('El campo productos es obligatorio'),
      detalle: Yup.string().required('El campo detalle es obligatorio'),
      tecnico: Yup.string().required('El campo tecnico es obligatorio'),
      numerocliente: Yup.string().required('El campo N° de Cliente es obligatorio'),
    }),
    onSubmit: async (valores, {resetForm}) => {
      const {productos, detalle, tecnico, numerocliente} = valores;

      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Confirma para registrar la falla',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar',
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const {data} = await nuevaFallaComponente({
              variables: {
                input: {
                  productos,
                  detalle,
                  tecnico,
                  numerocliente,
                },
              },
            });
            console.log(data);
            resetForm();
            Swal.fire(
                'Registrado!',
                'La falla ha sido registrada con éxito.',
                'success',
            );
            router.push('/FallasComponentes');
          } catch (error) {
            console.log(error);
            Swal.fire(
                'Error!',
                'Hubo un problema al registrar la falla.',
                'error',
            );
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
    <div>
      <Layout>
        {mensaje && mostrarMensaje()}
        <h1>Fallas Componentes</h1>
        <form onSubmit={formik.handleSubmit}>
          <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
            Ingresar Productos
          </p>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 mt-5 text-gray leading-tight focus:outline-none focus:shadow-outline"
            id="productos"
            type="productos"
            placeholder="Productos"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.productos}
          />
          <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
            Ingresar Detalle
          </p>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 mt-5 text-gray leading-tight focus:outline-none focus:shadow-outline"
            id="detalle"
            type="detalle"
            placeholder="Ingresar Detalle"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.detalle}
          />
          <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
            Ingresar Tecnico
          </p>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 mt-5 text-gray leading-tight focus:outline-none focus:shadow-outline"
            id="tecnico"
            type="tecnico"
            placeholder="Ingresar Tecnico"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tecnico}
          />
          <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
            Ingresar N° Cliente
          </p>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 mt-5 text-gray leading-tight focus:outline-none focus:shadow-outline"
            id="numerocliente"
            type="numerocliente"
            placeholder="Ingresar N° Cliente"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.numerocliente}
          />
          <input
            type="submit"
            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
            value="Registrar Falla"
          />
        </form>
      </Layout>
    </div>
  );
};

export default NuevaFallaComponente;
