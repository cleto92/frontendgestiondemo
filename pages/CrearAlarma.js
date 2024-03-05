/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Layout from '../components/Layout';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {gql, useMutation, useQuery} from '@apollo/client';
import Swal from 'sweetalert2';
import {useRouter} from 'next/router';
import Select from 'react-select';

const NUEVA_ALARMA = gql`
  mutation nuevaAlarma($input: AlarmaInput) {
    nuevaAlarma(input: $input) {
      id
      productos {
        id
        cantidad
      }
      nombre
    }
  }
`;

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      stock
      creado
    }
  }
`;

const CrearAlarma = () => {
  const router = useRouter();
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [nuevaAlarma] = useMutation(NUEVA_ALARMA, {
    fetchPolicy: 'no-cache',
  });
  const [mensaje, guardarMensaje] = useState(null);
  const {loading, error, data} = useQuery(OBTENER_PRODUCTOS, {
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
      const productosCompuestos = opcionSeleccionada.map((opcion) => ({
        id: opcion.value,
        cantidad: parseInt(opcion.cantidad, 10),
      }));
      try {
        const {data} = await nuevaAlarma({
          variables: {
            input: {
              nombre,
              productos: productosCompuestos,
            },
          },
        });
        console.log(data);
        Swal.fire(
            'Alarma Creada',
            'La alarma se creó correctamente',
            'success',
        );
        router.push('/Productos');
      } catch (error) {
        guardarMensaje(
            error.message.replace('ApolloError: ', '', 'GraphQL error: ', ''),
        );
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

  const handleChange = (opcionSeleccionada) => {
    setOpcionSeleccionada(
        opcionSeleccionada.map((opcion) => ({...opcion, cantidad: 0})),
    );
  };

  const handleCantidadChange = (opcion, event) => {
    const nuevaOpcionSeleccionada = opcionSeleccionada.slice();
    const index = opcionSeleccionada.indexOf(opcion);
    nuevaOpcionSeleccionada[index].cantidad = event.target.value;
    setOpcionSeleccionada(nuevaOpcionSeleccionada);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error :</p>;

  const opciones = data.obtenerProductos.map((producto) => ({
    value: producto.id,
    label: producto.nombre,
  }));

  return (
    <Layout>
      {mensaje && mostrarMensaje}
      <h1 className="text-2xl text-gray-800 font-light">
        Agregar Nueva Alarma
      </h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            className="bg-white shadow-sm px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                Nombre
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                placeholder="Ingresar nombre Alarma"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productoscompuestos"
              >
                Productos
              </label>
              <Select
                isMulti
                value={opcionSeleccionada}
                onChange={handleChange}
                options={opciones}
              />
              {opcionSeleccionada &&
                opcionSeleccionada.map((opcion) => (
                  <div key={opcion.value} className="mt-2">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor={`cantidad-${opcion.value}`}
                    >
                      Cantidad de {opcion.label}
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                      id={`cantidad-${opcion.value}`}
                      type="number"
                      value={opcion.cantidad}
                      onChange={(event) => handleCantidadChange(opcion, event)}
                    />
                  </div>
                ))}
            </div>

            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value="Agregar Alarma"
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CrearAlarma;
