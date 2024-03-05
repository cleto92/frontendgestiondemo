/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {FaUser, FaEnvelope, FaPhone, FaMapMarker} from 'react-icons/fa';
import {useMutation, gql} from '@apollo/client';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_CLIENTE_MINORISTA = gql`
  mutation nuevoClienteMinorista($input: ClienteMinoristaInput) {
    nuevoClienteMinorista(input: $input) {
      nombre
      apellido
    }
  }
`;

const NuevoClienteMinorista = () => {
  const [mensaje, guardarMensaje] = useState(null);
  const router = useRouter();
  const [nuevoClienteMinorista] = useMutation(NUEVO_CLIENTE_MINORISTA, {
    fetchPolicy: 'no-cache',
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      numerocliente: '',
      telefono: '',
      movil: '',
      provincia: '',
      localidad: '',
      direccion: '',
      entrecalles: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El Nombre es obligatorio'),
      apellido: Yup.string().required('El Apellido es obligatorio'),
      numerocliente: Yup.string().required(
          'El numero de Cliente es Obligatorio',
      ),
      email: Yup.string().required('El Email es obligatorio'),
      telefono: Yup.string().required('El Telefono es obligatorio'),
      movil: Yup.string().required('El Movil es obligatorio'),
      provincia: Yup.string().required('La Provincia es obligatoria'),
      localidad: Yup.string().required('La Localidad es obligatoria'),
      direccion: Yup.string().required('La Direccion es obligatoria'),
      entrecalles: Yup.string().required('Las Entre Calles son obligatorias'),
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
          nuevoClienteMinorista({
            variables: {
              input: {
                nombre: valores.nombre,
                apellido: valores.apellido,
                email: valores.email,
                telefono: valores.telefono,
                movil: valores.movil,
                provincia: valores.provincia,
                localidad: valores.localidad,
                direccion: valores.direccion,
                entrecalles: valores.entrecalles,
                numerocliente: valores.numerocliente,
              },
            },
          }).then(({data}) => {
            Swal.fire(
                'Registrado',
                'Aguarde para ser redireccionado',
                'success',
            );
            setTimeout(() => {
              router.push('/ClientesMinoristas');
            }, 3000);
          }).catch((error) => {
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
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">
          Nuevo Cliente Minorista
        </h1>
        {mensaje && mostrarMensaje()}
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white shadow-sm px-8 pt-6 pb-8 mb-4"
            >
              <div className="mb-2 flex items-center">
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaUser className="text-gray-700 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-2"
                    htmlFor="numerocliente"
                  >
                    N°Cliente
                  </label>
                </div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="numerocliente"
                  type="numerocliente"
                  placeholder="N°Cliente"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.numerocliente}
                />
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaUser className="text-gray-700 ml-2 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-3"
                    htmlFor="nombre"
                  >
                    Nombre
                  </label>
                </div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="nombre"
                  type="nombre"
                  placeholder="Ingresar Nombre"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.nombre}
                />
              </div>
              <div className="mb-4 flex items-center">
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaUser className="text-gray-700 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-3"
                    htmlFor="apellido"
                  >
                    Apellido
                  </label>
                </div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="apellido"
                  type="apellido"
                  placeholder="Apellido"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.apellido}
                />
              </div>
              <div className="mb-4 flex items-center">
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaEnvelope className="text-gray-700 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-3"
                    htmlFor="email"
                  >
                    Email
                  </label>
                </div>
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
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaPhone className="text-gray-700 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-3"
                    htmlFor="telefono"
                  >
                    Teléfono
                  </label>
                </div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="telefono"
                  type="telefono"
                  placeholder="Ingresar Teléfono"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.telefono}
                />
              </div>
              <div className="mb-4 flex items-center">
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaPhone className="text-gray-700 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-3"
                    htmlFor="movil"
                  >
                    Móvil
                  </label>
                </div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="movil"
                  type="movil"
                  placeholder="Ingresar Móvil"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.movil}
                />
              </div>
              <div className="mb-4 flex items-center">
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaMapMarker className="text-gray-700 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-3"
                    htmlFor="provincia"
                  >
                    Provincia
                  </label>
                </div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="provincia"
                  type="provincia"
                  placeholder="Ingresar Provincia"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.provincia}
                />
              </div>
              <div className="mb-4 flex items-center">
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaMapMarker className="text-gray-700 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-3"
                    htmlFor="localidad"
                  >
                    Localidad
                  </label>
                </div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="localidad"
                  type="localidad"
                  placeholder="Ingresar Localidad"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.localidad}
                />
              </div>
              <div className="mb-4 flex items-center">
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaMapMarker className="text-gray-700 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-3"
                    htmlFor="direccion"
                  >
                    Dirección
                  </label>
                </div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="direccion"
                  type="direccion"
                  placeholder="Ingresar Dirección"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.direccion}
                />
              </div>
              <div className="mb-4 flex items-center">
                <div className="flex-shrink-0 w-24 flex items-center">
                  <FaMapMarker className="text-gray-700 text-lg" />
                  <label
                    className="block text-gray-700 text-sm font-bold ml-3"
                    htmlFor="entrecalles"
                  >
                    Entre Calles
                  </label>
                </div>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="entrecalles"
                  type="entrecalles"
                  placeholder="Ingresar Entre Calles"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.entrecalles}
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
    </>
  );
};

export default NuevoClienteMinorista;
