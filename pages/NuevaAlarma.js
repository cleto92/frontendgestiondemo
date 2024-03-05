/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React from 'react';
import Layout from '../components/Layout';
import {FaUser} from 'react-icons/fa';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation} from '@apollo/client';
import Swal from 'sweetalert2';
import {useRouter} from 'next/router';
import AsignarProductos from '../components/Pedidos/AsignarProductos';
import Resumen from '../components/Pedidos/Resumen';

const NUEVO_ALARMA = gql`
  mutation nuevaAlarma($input: AlarmaInput) {
    nuevaAlarma(input: $input) {
      id
      productoscompuestos {
        id
        cantidad
      }
      nombre
      tipo
    }
  }
`;

const NuevoProducto = () => {
  const router = useRouter();
  const [nuevaAlarma] = useMutation(NUEVO_ALARMA, {
    fetchPolicy: 'no-cache',
  });
  const formik = useFormik({
    initialValues: {
      nombre: '',
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es obligatorio'),
    }),

    onSubmit: async (valores) => {
      const {nombre} = valores;
      try {
        const {data} = await nuevaAlarma({
          variables: {
            input: {
              nombre,
            },
          },
        });
        Swal.fire(
            'Producto Creado',
            'El producto se creo correctamente',
            'success',
        );
        router.push('/productos');
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <>
      <Layout>
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
                  Alarma
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
              <AsignarProductos />
              <Resumen />
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
