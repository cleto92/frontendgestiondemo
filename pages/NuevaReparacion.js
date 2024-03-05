/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {FaUserAlt, FaClipboardList, FaToolbox, FaCogs} from 'react-icons/fa';
import {useMutation, gql} from '@apollo/client';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';

const NUEVA_REPARACION = gql`
  mutation nuevaReparacion($input: ReparacionesInput) {
    nuevaReparacion(input: $input) {
      numerocliente
      detalle
      tecnico
      fecha
      componente
    }
  }
`;

const NuevaReparacion = () => {
  const [mensaje, guardarMensaje] = useState(null);
  const router = useRouter();
  const [nuevaReparacion] = useMutation(NUEVA_REPARACION, {
    fetchPolicy: 'no-cache',
  });

  const mostrarMensaje = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p className="font-bold text-red-500">{mensaje}</p>
      </div>
    );
  };

  const formik = useFormik({
    initialValues: {
      numerocliente: '',
      detalle: '',
      tecnico: '',
      componente: '',
    },
    validationSchema: Yup.object({
      numerocliente: Yup.string().required('El Número de Cliente es obligatorio'),
      detalle: Yup.string().required('El Detalle es obligatorio'),
      tecnico: Yup.string().required('El Técnico es obligatorio'),
      componente: Yup.string().required('El Componente es obligatorio'),
    }),
    onSubmit: async (valores) => {
      const {numerocliente, detalle, tecnico, componente} = valores;

      // Muestra el cuadro de diálogo de confirmación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres registrar esta reparación?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, registrar!',
        cancelButtonText: 'No, cancelar',
      });

      // Si el usuario confirma, procede con la mutación
      if (result.isConfirmed) {
        try {
          const {data} = await nuevaReparacion({
            variables: {
              input: {
                numerocliente,
                detalle,
                tecnico,
                componente,
              },
            },
          });
          console.log(data);
          Swal.fire(
              'Reparación registrada',
              'Click en OK, para ser redireccionado',
              'success',
          ).then(() => {
            setTimeout(() => {
              router.push('/Placas');
            }, 3000);
          });
        } catch (error) {
          guardarMensaje(
              error.message.replace('ApolloError: ', '', 'GraphQL error: ', ''),
          );
          setTimeout(() => {
            guardarMensaje(null);
          }, 3000);
        }
      }
    },
  });

  return (
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Nueva Reparación</h1>
        {mensaje && mostrarMensaje()}
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              {/* Campo Número Cliente */}
              <div className="mb-4 flex">
                <div className="mr-4">
                  <FaUserAlt className="text-gray-700 text-lg" />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="numerocliente"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    N° Cliente
                  </label>
                  <input
                    id="numerocliente"
                    type="text"
                    placeholder="Número de Cliente"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.numerocliente}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              {/* Campo Detalle */}
              <div className="mb-4 flex">
                <div className="mr-4">
                  <FaClipboardList className="text-gray-700 text-lg" />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="detalle"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Detalle
                  </label>
                  <input
                    id="detalle"
                    type="text"
                    placeholder="Detalle de la reparación"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.detalle}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              {/* Campo Técnico */}
              <div className="mb-4 flex">
                <div className="mr-4">
                  <FaToolbox className="text-gray-700 text-lg" />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="tecnico"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Técnico
                  </label>
                  <input
                    id="tecnico"
                    type="text"
                    placeholder="Nombre del Técnico"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.tecnico}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              {/* Campo Componente */}
              <div className="mb-4 flex">
                <div className="mr-4">
                  <FaCogs className="text-gray-700 text-lg" />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="componente"
                    className="block text-gray-700 text-sm font-bold mb-2"
                  >
                    Componente
                  </label>
                  <input
                    id="componente"
                    type="text"
                    placeholder="Componente a reparar"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.componente}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <input
                type="submit"
                value="Registrar Reparación"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NuevaReparacion;
