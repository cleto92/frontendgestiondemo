/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarker,
  FaBuilding,
} from 'react-icons/fa';
import {gql, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_CLIENTE_MAYORISTA = gql`
  mutation nuevoClienteMayorista($input: ClienteMayoristaInput) {
    nuevoClienteMayorista(input: $input) {
      id
      nombre
      apellido
      email
      telefono
      movil
      provincia
      localidad
      direccion
      empresa
    }
  }
`;

const NuevoClienteMayorista = () => {
  const [mensaje, guardarMensaje] = useState(null);
  const router = useRouter();
  const [nuevoClienteMayorista] = useMutation(NUEVO_CLIENTE_MAYORISTA, {
    fetchPolicy: 'no-cache',
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      movil: '',
      provincia: '',
      localidad: '',
      direccion: '',
      empresa: '',
    },

    validationSchema: Yup.object({
      nombre: Yup.string().required('El Nombre es obligatorio'),
      apellido: Yup.string().required('El Apellido es obligatorio'),
      email: Yup.string().required('El Email es obligatorio'),
      telefono: Yup.string().required('El Telefono es obligatorio'),
      movil: Yup.string().required('El Movil es obligatorio'),
      provincia: Yup.string().required('La Provincia es obligatoria'),
      localidad: Yup.string().required('La Localidad es obligatoria'),
      direccion: Yup.string().required('La Direccion es obligatoria'),
      empresa: Yup.string().required('La Empresa es obligatoria'),
    }),
    onSubmit: async (valores) => {
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Confirma si deseas registrar al cliente',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, registrar!',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          nuevoClienteMayorista({
            variables: {
              input: valores,
            },
          })
              .then(({data}) => {
                Swal.fire(
                    'Registrado',
                    'Aguarde para ser redireccionado',
                    'success',
                );
                setTimeout(() => {
                  router.push('/ClientesMayoristas');
                }, 3000);
              })
              .catch((error) => {
                guardarMensaje(
                    error.message.replace('ApolloError: ', '', 'GraphQL error: ', ''),
                );
                setTimeout(() => {
                  guardarMensaje(null);
                }, 5000);
              });
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
      {mensaje && mostrarMensaje()}
      <h1 className="text-2xl text-gray-800 font-light">
        Nuevo Cliente Mayorista
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
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                placeholder="Ingresar Nombre"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
              />
            </div>
            <div className="mb-4 flex items-center">
              <FaUser className="mr-2" />
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                htmlFor="apellido"
              >
                Apellido
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="apellido"
                type="text"
                placeholder="Apellido"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.apellido}
              />
            </div>
            <div className="mb-4 flex items-center">
              <FaEnvelope className="mr-2" />
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Ingresar Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            <div className="mb-4 flex items-center">
              <FaPhone className="mr-2" />
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                htmlFor="telefono"
              >
                Telefono
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="telefono"
                type="text"
                placeholder="Ingresar Telefono"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefono}
              />
            </div>
            <div className="mb-4 flex items-center">
              <FaPhone className="mr-2" />
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                htmlFor="movil"
              >
                Movil
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="movil"
                type="text"
                placeholder="Ingresar Movil"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.movil}
              />
            </div>
            <div className="mb-4 flex items-center">
              <FaMapMarker className="mr-2" />
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                htmlFor="provincia"
              >
                Provincia
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="provincia"
                type="text"
                placeholder="Ingresar Provincia"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.provincia}
              />
            </div>
            <div className="mb-4 flex items-center">
              <FaMapMarker className="mr-2" />
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                htmlFor="localidad"
              >
                Localidad
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="localidad"
                type="text"
                placeholder="Ingresar Localidad"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.localidad}
              />
            </div>
            <div className="mb-4 flex items-center">
              <FaMapMarker className="mr-2" />
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                htmlFor="direccion"
              >
                Direccion
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="direccion"
                type="text"
                placeholder="Ingresar Direccion"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.direccion}
              />
            </div>
            <div className="mb-4 flex items-center">
              <FaBuilding className="mr-2" />
              <label
                className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                htmlFor="empresa"
              >
                Empresa
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="empresa"
                type="text"
                placeholder="Ingresar Empresa"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.empresa}
              />
            </div>
            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value="Registrar"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NuevoClienteMayorista;
