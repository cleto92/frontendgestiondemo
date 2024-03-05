/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';
import Layout from '../../components/Layout';
import {gql, useQuery, useMutation} from '@apollo/client';
import {useRouter} from 'next/router';
import {GoPackageDependents} from 'react-icons/go';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO = gql`
  query obtenerProductosId($id: ID!) {
    obtenerProductosId(id: $id) {
      nombre
      stock
    }
  }
`;

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
      id
      stock
    }
  }
`;

const EditarProducto = () => {
  const router = useRouter();
  const {pid} = router.query;
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);
  const {data, loading} = useQuery(OBTENER_PRODUCTO, {
    variables: {
      id: pid,
      skip: !pid,
    },
  });
  const validacion = Yup.object({
    stock: Yup.string().required('Colocar el stock correcto'),
  });

  if (loading) return 'Cargando...';

  if (!data) {
    console.error('Data es undefined');
  }

  console.log(data);

  const {obtenerProductosId} = data;
  const {nombre} = obtenerProductosId;
  const actualizarStock = async (valores) => {
    const {stock} = valores;

    // Muestra el cuadro de diálogo de confirmación
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres actualizar el stock del producto?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar!',
      cancelButtonText: 'No, cancelar',
    });

    // Si el usuario confirma, procede con la actualización
    if (result.isConfirmed) {
      try {
        const {data} = await actualizarProducto({
          variables: {
            id: pid,
            input: {
              stock,
            },
          },
        });
        Swal.fire('Correcto', 'Stock Actualizado', 'success');
        console.log(data);
        router.push('/Productos');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">
          Editar Stock del Producto: {nombre}
        </h1>

        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <Formik
              enableReinitialize
              initialValues={obtenerProductosId}
              validationSchema={validacion}
              onSubmit={(valores) => {
                actualizarStock(valores);
              }}
            >
              {(props) => {
                return (
                  <form
                    className="bg-white shadow-sm px-8 pt-6 pb-8 mb-4"
                    onSubmit={props.handleSubmit}
                  >
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
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        value={props.values.stock}
                      />
                    </div>
                    <input
                      type="submit"
                      className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                      value="Editar Stock"
                    />
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default EditarProducto;
