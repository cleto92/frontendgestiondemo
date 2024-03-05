/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUsers,
  FaArrowLeft,
} from 'react-icons/fa';
import Link from 'next/link';

const NUEVA_CUENTA = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      email
      rol
    }
  }
`;

const NuevaCuenta = () => {
  const [mensaje, guardarMensaje] = useState(null);
  const router = useRouter();

  const [nuevoUsuario] = useMutation(NUEVA_CUENTA, {
    fetchPolicy: 'no-cache',
  });

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      rol: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El Nombre es Obligatorio'),
      apellido: Yup.string().required('El Apellido es Obligatorio'),
      email: Yup.string()
          .email('El email no es valido')
          .required('El Email es Obligatorio'),
      password: Yup.string().required('El Password es Obligatorio'),
      rol: Yup.string().required('El Rol es Obligatorio'),
    }),
    onSubmit: async (values) => {
      const {nombre, apellido, email, password, rol} = values;
      try {
        await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              email,
              password,
              rol,
            },
          },
        });
        guardarMensaje('Usuario Creado con éxito, Redireccionando, aguarde');
        setTimeout(() => {
          guardarMensaje(null);
          router.push('/IndexLogin');
        }, 5000);
      } catch (error) {
        guardarMensaje(
            error.message.replace('ApolloError: ', '', 'GraphQL error: ', ''),
        );
        console.log(error.message);
        setTimeout(() => {
          guardarMensaje(null);
        }, 5000);
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
    <>
      <Layout>
        {mensaje && mostrarMensaje()}
        <h1 className="text-center text-2xl text-white font-bold">
          Nueva Cuenta
        </h1>
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="flex justify-end">
                <Link href="/IndexLogin">
                  <button className="text-blue-500 hover:text-blue-700 flex items-center mb-4">
                    <FaArrowLeft className="mr-2" /> Volver
                  </button>
                </Link>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="nombre"
                >
                  <FaUser className="mr-2 inline-block" /> Nombre
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="nombre"
                  type="text"
                  placeholder="Ingresar Nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.nombre && formik.errors.nombre ? (
                <div className="border-l-4 my-4 p-4 bg-red-100 justify-center mb-5">
                  <p className="text-center text-red-600 font-bold ">
                    {formik.errors.nombre}
                  </p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apellido"
                >
                  <FaUser className="mr-2 inline-block" /> Apellido
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="apellido"
                  type="text"
                  placeholder="Ingresar Apellido"
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.touched.apellido && formik.errors.apellido ? (
                <div className="border-l-4 my-4 p-4 bg-red-100 justify-center mb-5">
                  <p className="text-center text-red-600 font-bold ">
                    {formik.errors.apellido}
                  </p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  <FaEnvelope className="mr-2 inline-block" /> Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Ingresar Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <div className="border-l-4 my-4 p-4 bg-red-100 justify-center mb-5">
                  <p className="text-center text-red-600 font-bold ">
                    {formik.errors.email}
                  </p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  <FaLock className="mr-2 inline-block" /> Contraseña
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Ingresar contraseña"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="border-l-4 my-4 p-4 bg-red-100 justify-center mb-5">
                  <p className="text-center text-red-600 font-bold ">
                    {formik.errors.password}
                  </p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="rol"
                >
                  <FaUsers className="mr-2 inline-block" /> Rol
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="rol"
                  value={formik.values.rol}
                  onChange={formik.handleChange}
                >
                  <option value="" disabled>
                    Seleccionar Rol
                  </option>
                  <option value="SuperAdmin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Deposito">Deposito</option>
                  <option value="Tecnico">Tecnico</option>
                </select>
              </div>
              {formik.touched.rol && formik.errors.rol ? (
                <div className="border-l-4 my-4 p-4 bg-red-100 justify-center mb-5">
                  <p className="text-center text-red-600 font-bold ">
                    {formik.errors.rol}
                  </p>
                </div>
              ) : null}
              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 uppercase text-white font-bold hover:bg-gray-900"
                value="Crear Usuario"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NuevaCuenta;
