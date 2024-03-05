/* eslint-disable linebreak-style */
/* eslint-disable max-len */
import React, {useState} from 'react';
import Layout from '../../../components/Layout';
import {useRouter} from 'next/router';
import {gql, useMutation} from '@apollo/client';
import Swal from 'sweetalert2';

const AGREGAR_COMENTARIO = gql`
mutation agregarComentario($id: ID! $comentario: String) {
  agregarComentario(id: $id, comentario: $comentario) {
    comentario
  }
}
`;

const Agregarcomentario = () => {
  const router = useRouter();
  const {pid} = router.query;
  const [comentario, setComentario] = useState('');
  const [agregarComentario] = useMutation(AGREGAR_COMENTARIO, {
    fetchPolicy: 'no-cache',
  });

  const agregar = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres agregar este comentario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, agregarlo!',
      cancelButtonText: 'No, cancelar',
    });

    if (result.isConfirmed) {
      try {
        const {data} = await agregarComentario({
          variables: {
            id: pid,
            comentario: comentario,
          },
        });
        console.log(data);

        Swal.fire(
            'Agregado!',
            'El comentario ha sido agregado con éxito.',
            'success',
        );
        router.push('/Instalaciones');
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className='font-bold text-xl mb-5'>Agregar Comentario al pedido</h1>
        <textarea
          id='comentario'
          className="shadow-md w-96 h-32 p-2 border border-gray-300 rounded-lg"
          maxLength={75}
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        ></textarea>
        <button
          className="bg-gray-800 w-96 mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
          onClick={agregar}
        >
                    Agregar Comentario
        </button>
      </div>
    </Layout>
  );
};

export default Agregarcomentario;
