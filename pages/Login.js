/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import Swal from 'sweetalert2';

const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

const Login = () => {
  const [mensaje, guardarMensaje] = useState(null);
  const [autenticar] = useMutation(AUTENTICAR_USUARIO);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    validationSchema: Yup.object({
      email: Yup.string()
          .email('El Email no es valido')
          .required('Debe llenar el campo de Email'),
      password: Yup.string().required('La contraseña es obligatoria'),
    }),
    onSubmit: async (values) => {
      const {email, password} = values;
      try {
        const {data} = await autenticar({
          variables: {
            input: {
              email,
              password,
            },
          },
        });

        const token = data.autenticarUsuario.token;
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          text: 'Aguarde será redireccionado',
          confirmButtonColor: '#3085d6',
          showConfirmButton: false,
          timer: 3000,
        });
        localStorage.setItem('token', token);
        setTimeout(() => {
          router.replace('/IndexLogin');
        }, 3000);
      } catch (error) {
        const mensaje = error.message.replace(
            'ApolloError: ',
            '',
            'GraphQL error: ',
            '',
        );
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: mensaje,
          confirmButtonColor: '#d33',
          confirmButtonText: 'Intentar nuevamente',
        });
        setTimeout(() => {
          guardarMensaje(null);
        }, 15000);
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
        <h1 className="text-center text-2xl text-white font-bold">Ingresar</h1>
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-sm">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-5 text-center"
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
              {formik.touched.email && formik.errors.email ? (
                <div className="border-l-4 my-4 p-4 bg-red-100 justify-center mb-5">
                  <p className="text-center text-red-600 font-bold ">
                    {formik.errors.email}
                  </p>
                </div>
              ) : null}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-5 text-center"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Ingresar contraseña"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="border-l-4 my-4 p-4 bg-red-100 justify-center mb-5">
                    <p className="text-center text-red-600 font-bold ">
                      {formik.errors.password}
                    </p>
                  </div>
                ) : null}
              </div>
              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 uppercase text-white font-bold hover:bg-gray-900 "
                value="Iniciar Sesión"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
