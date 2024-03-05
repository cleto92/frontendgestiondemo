/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React from 'react';
import {useRouter} from 'next/router';
import Layout from '../../components/Layout';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarker,
  FaBuilding,
} from 'react-icons/fa';
import {useQuery, gql, useMutation} from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_CLIENTE_MINORISTA_ID = gql`
  query obtenerClienteMinoristaId($id: ID!) {
    obtenerClienteMinoristaId(id: $id) {
      nombre
      apellido
      email
      telefono
      movil
      provincia
      localidad
      direccion
      entrecalles
      numerocliente
    }
  }
`;

const ACTUALIZAR_CLIENTE_MINORISTA_ID = gql`
  mutation actualizarClienteMinorista($id: ID!, $input: ClienteMinoristaInput) {
    actualizarClienteMinorista(id: $id, input: $input) {
      id
      nombre
      email
    }
  }
`;

const EditarCliente = () => {
  const router = useRouter();
  const {pid} = router.query;

  const {data, loading, error} = useQuery(OBTENER_CLIENTE_MINORISTA_ID, {
    variables: {id: pid},
    skip: !pid,
  });

  const [actualizarClienteMinorista] = useMutation(
      ACTUALIZAR_CLIENTE_MINORISTA_ID,
  );

  if (loading) return 'Cargando...';

  if (error) {
    console.error('Error obteniendo los datos:', error);
    return 'Error';
  }

  if (!data) {
    console.error('Data es undefined');
    return 'Error';
  }

  console.log(data);

  const {obtenerClienteMinoristaId} = data;
  const actualizar = async (valores) => {
    const {
      nombre,
      apellido,
      email,
      telefono,
      movil,
      provincia,
      localidad,
      direccion,
      entrecalles,
      numerocliente,
    } = valores;
    try {
      const actualizarCliente = await actualizarClienteMinorista({
        variables: {
          id: pid,
          input: {
            nombre,
            apellido,
            email,
            telefono,
            movil,
            provincia,
            localidad,
            direccion,
            entrecalles,
            numerocliente,
          },
        },
      });

      Swal.fire('Actualizado', 'Cliente Actualizado', 'success');
      router.push('/ClientesMinoristas');
      return actualizarCliente;
    } catch (error) {
      console.log('El Cliente no se encuentra');
      router.push('/ClientesMinoristas');
    }
  };

  const validacionSchema = Yup.object({
    nombre: Yup.string().required('El Nombre es obligatorio'),
    apellido: Yup.string().required('El Apellido es obligatorio'),
    email: Yup.string().required('El Email es obligatorio'),
    telefono: Yup.string().required('El Telefono es obligatorio'),
    movil: Yup.string().required('El Movil es obligatorio'),
    numerocliente: Yup.string().required('El numero de cliente es obligatorio'),
    provincia: Yup.string().required('La Provincia es obligatoria'),
    localidad: Yup.string().required('La Localidad es obligatoria'),
    direccion: Yup.string().required('La Direccion es obligatoria'),
    entrecalles: Yup.string().required('Las EntreCalles son obligatorias'),
  });

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">
        Editar Cliente Minorista
      </h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            validationSchema={validacionSchema}
            enableReinitialize
            initialValues={obtenerClienteMinoristaId}
            onSubmit={(valores) => {
              actualizar(valores);
            }}
          >
            {(props) => {
              return (
                <form
                  className="bg-white shadow-sm px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  <div className="mb-4 flex items-center">
                    <FaUser className="mr-2" />
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                      htmlFor="numerocliente"
                    >
                      N° Cliente
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                      id="numerocliente"
                      type="text"
                      placeholder="N° de Cliente"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.numerocliente}
                    />
                  </div>
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.apellido}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.telefono}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.movil}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.provincia}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.localidad}
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
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.direccion}
                    />
                  </div>
                  <div className="mb-4 flex items-center">
                    <FaBuilding className="mr-2" />
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2 mr-3 w-24"
                      htmlFor="entrecalles"
                    >
                      Entre Calles
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
                      id="entrecalles"
                      type="text"
                      placeholder="Entre Calles"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.entrecalles}
                    />
                  </div>
                  <input
                    type="submit"
                    className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
                    value="Editar"
                  />
                </form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
};

export default EditarCliente;
