/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable linebreak-style */
import React from 'react';
import Layout from '../../components/Layout';
import {useRouter} from 'next/router';
import {gql, useMutation} from '@apollo/client';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const ACTUALIZAR_OBSERVACION = gql`
mutation actualizarObservacion($id: ID!, $input: actualizarObservacionInput) {
  actualizarObservacion(id: $id, input: $input) {
    observaciones
  }
}
`;

const EditarPlacaCliente = () => {
  const router = useRouter();
  const {pid} = router.query;
  const [actualizarObservacion] = useMutation(ACTUALIZAR_OBSERVACION, {
    fetchPolicy: 'no-cache',
  });

  const formik = useFormik({
    initialValues: {
      observaciones: '',
    },
    validationSchema: Yup.object({
      observaciones: Yup.string().required('El campo observaciones es obligatorio'),
    }),
    onSubmit: async (valores) => {
      const {observaciones} = valores;
      try {
        await actualizarObservacion({
          variables: {
            id: pid,
            input: {
              observaciones,
            },
          },
        });
        Swal.fire({
          icon: 'success',
          title: '¡Observación Actualizada!',
          text: 'La observación fue actualizada correctamente.',
          confirmButtonText: 'OK',
        }).then(() => {
          router.push('/Placas');
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message.replace('ApolloError: ', '').replace('GraphQL error: ', ''),
        });
      }
    },
  });

  return (
    <div>
      <Layout>
        <div>
          <form onSubmit={formik.handleSubmit}>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="observaciones">
                Detalle
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="observaciones"
              placeholder="Ingresar Observación"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.observaciones}
            ></textarea>
            <input
              type="submit"
              className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
              value="Registrar Observacion"
            />
          </form>
        </div>
      </Layout>
    </div>
  );
};

export default EditarPlacaCliente;
