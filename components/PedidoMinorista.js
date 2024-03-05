/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import {Button, Dropdown} from 'semantic-ui-react';
import {useMutation, gql} from '@apollo/client';
import Swal from 'sweetalert2';
import {useRouter} from 'next/router';

const ELIMINAR_PEDIDO_ALARMA = gql`
  mutation eliminarPedidoMinorista($id: ID!) {
    eliminarPedidoMinorista(id: $id) {
      id
    }
  }
`;

const ELIMINAR_PRODUCTO_PEDIDO_MINORISTA = gql`
  mutation EliminarProductoPedidoMinorista($idPedido: ID!, $idProducto: ID!) {
    eliminarProductoPedidoMinorista(
      idPedido: $idPedido
      idProducto: $idProducto
    ) {
      id
      productos {
        id
        nombre
        cantidad
      }
    }
  }
`;

const ACTUALIZAR_ESTADO_MINORISTA = gql `
mutation actualizarEstadoMinorista($id: ID! $input: PedidoMinoristaInput){
  actualizarEstadoMinorista(id: $id, input: $input) {
    id
    estado
    fecha
    fechaModificacion
  }
}
`;

const PedidoMinorista = ({pedidoMinorista, dataUsuario}) => {
  const [eliminarPedidoAlarma] = useMutation(ELIMINAR_PEDIDO_ALARMA, {
    fetchPolicy: 'no-cache',
  });

  const [eliminarProductoPedidoMinorista] = useMutation(
      ELIMINAR_PRODUCTO_PEDIDO_MINORISTA,
      {
        fetchPolicy: 'no-cache',
      },
  );

  const [actualizarEstadoMinorista] = useMutation(ACTUALIZAR_ESTADO_MINORISTA, {fetchPolicy: 'no-cache'});

  const router = useRouter();
  const {
    id,
    fecha,
    fechaModificacion,
    productos,
    nombreCliente,
    numeroCliente,
    alarmas,
    estado: estadoBD,
    comentario,
  } = pedidoMinorista;
  const {nombre: tecnico} = dataUsuario.obtenerUsuario;
  const renderListaProductos = () => {
    if (alarmas.length === 0) {
      return <p>No hay productos</p>;
    }

    return (
      <ul>
        {alarmas.map((alarma) => (
          <li key={alarma.idAlarma}>
            {alarma.nombreAlarma} [{alarma.cantidadAlarmas}]
          </li>
        ))}
      </ul>
    );
  };


  const [accion, setAccion] = useState(null);

  useEffect(() => {
    if (accion === 'agregar') {
      agregarProductosAlarma();
    } else if (accion === 'editar') {
      editarPedidoAlarma();
    } else if (accion === 'eliminar') {
      eliminarInstalacion();
    } else if (accion === 'comentario') {
      agregarComentario();
    }
  }, [accion]);

  const options = [
    {
      key: 'edit',
      icon: 'add',
      text: 'Asignar Productos',
      value: 'agregar',
    },
    {key: 'hide', icon: 'edit', text: 'Editar Alarma', value: 'editar'},
    {key: 'hide', icon: 'delete', text: 'Eliminar Pedido', value: 'eliminar'},
    {key: 'hide', icon: 'comment', text: 'Agregar Comentario', value: 'comentario'},
  ];


  const handleSelectChange = async (e) => {
    const nuevoEstado = e.target.value;

    Swal.fire({
      title: `¿Estás seguro de cambiar el estado a ${nuevoEstado}?`,
      showDenyButton: true,
      confirmButtonText: 'Sí, cambiar',
      denyButtonText: `No cambiar`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const nuevaFecha = new Date().toISOString();

        try {
          await actualizarEstadoMinorista({
            variables: {
              id: id,
              input: {
                estado: nuevoEstado,
                fecha: nuevaFecha,
                fechaModificacion: nuevaFecha,
              },
            },
          });

          router.reload();
        } catch (error) {
          console.error('Error al intentar actualizar el estado:', error);
        }
      } else if (result.isDenied) {

      }
    });
  };
  const eliminarProductoPedido = async (idProducto, nombreProducto) => {
    Swal.fire({
      title: `Deseas eliminar "${nombreProducto}" del Pedido?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarProductoPedidoMinorista({
            variables: {
              idPedido: id,
              idProducto,
            },
          });

          Swal.fire(
              'Producto Eliminado',
              'El producto ha sido eliminado del pedido',
              'success',
          );

          router.reload();
        } catch (error) {
          console.error(error);
          Swal.fire(
              'Error!',
              'Hubo un error al eliminar el producto del pedido.',
              'error',
          );
        }
      }
    });
  };

  const eliminarInstalacion = async () => {
    Swal.fire({
      title: '¿Desea Eliminar la instalacion?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarPedidoAlarma({
            variables: {
              id,
            },
          });

          Swal.fire('Instalacion Eliminada', 'Eliminado', 'success');
          setTimeout(() => {
            router.reload();
          }, 3000);
        } catch (error) {
          console.log(error);
          Swal.fire(
              'Error!',
              'There was an error deleting your file.',
              'error',
          );
        }
      }
    });
  };

  const agregarProductosAlarma = () => {
    router.push({
      pathname: 'editarPedidoMinorista/[id]/Agregarproductosalarma',
      query: {id},
    });
  };

  const agregarComentario = () => {
    router.push({
      pathname: 'editarPedidoMinorista/[id]/Agregarcomentario',
      query: {id},
    });
  };

  const editarPedidoAlarma = () => {
    router.push({
      pathname: 'editarPedidoMinorista/[id]/Editarpedidoalarma',
      query: {id},
    });
  };

  const handleAcciones = (e, {value}) => {
    setAccion(value);
  };

  return (
    <div className="mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg">
      <div>
        <p className="font-bold text-gray-800">
          Cliente: {nombreCliente} - [{numeroCliente}]{' '}
        </p>
        <div>
          <Button.Group className="mb-4" color="teal">
            <Button className="mt-4">Acciones</Button>
            <Dropdown
              className="button icon"
              floating
              options={options}
              onChange={handleAcciones}
              trigger={<></>}
              disabled={estadoBD === 'FINALIZADA' || estadoBD === 'INSTALADA'}
            />
          </Button.Group>
          <h2 className="text-gray-800 font-bold mt-10">Estado Pedido</h2>
          <select onChange={handleSelectChange}
            value={estadoBD}
            className="mt-2 appearance-none bg-blue-600 border border-blue text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
          >
            <option disabled={estadoBD === 'INSTALADA'} value="PENDIENTE">PENDIENTE</option>
            <option value="FINALIZADA" disabled={estadoBD === 'INSTALADA'}>FINALIZADA</option>
            <option value="INSTALADA">INSTALADA</option>
          </select>
        </div>
        <h2 className="mt-4 font-bold text-lg">Fecha Creacion:</h2>
        {fecha}
        <h2 className="mt-4 font-bold text-lg">Modificado / Finalizado</h2>
        <p hidden={estadoBD === 'INSTALADA'}>{fechaModificacion}</p>
        <h2 className="mt-4 font-bold text-lg">Hora de Instalación:</h2>
        <p hidden={estadoBD !== 'INSTALADA'}>{fechaModificacion}</p>
      </div>

      <div>
        <div>

        </div>

        <h2 className="font-bold text-lg">Resumen del Pedido:</h2>
        <span className="uppercase mt-2">
          {renderListaProductos()}
        </span>
        <h2 className="uppercase">Accesorios</h2>
        {productos.length > 0 ? (
          <div>
            {productos.map((producto) => (
              <div
                className="flex justify-between items-center"
                key={producto.id}
              >
                <span className="uppercase text-gray-800">
                  {producto.nombre}[{producto.cantidad}]
                </span>
                <button
                  onClick={() =>
                    eliminarProductoPedido(producto.id, producto.nombre)
                  }
                  className="text-red hover:text-red-700 rounded inline-block text-lg px-2 "
                  style={{cursor: 'pointer'}}
                  disabled={estadoBD === 'INSTALADA'}
                >
                  &#10005;
                </button>
              </div>
            ))}
          </div>
        ) : (
          'No hay Accesorios'
        )}
        <div className='mt-4'>
          <h1>Detalle:</h1>
          <span className='mt-4'>{comentario}</span>
        </div>

        <div>
        </div>
      </div>
    </div>
  );
};

export default PedidoMinorista;
