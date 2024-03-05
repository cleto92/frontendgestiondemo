/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable padded-blocks */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {gql, useMutation} from '@apollo/client';
import {Button, Dropdown} from 'semantic-ui-react';
import Swal from 'sweetalert2';

const ELIMINAR_PEDIDO_ID = gql`
  mutation eliminarPedido($id: ID!) {
    eliminarPedido(id: $id)
  }
`;

const ACTUALIZAR_ESTADO_MAYORISTA = gql`
  mutation actualizarEstadoMayorista($id: ID!, $input: PedidoInput) {
    actualizarEstadoMayorista(id: $id, input: $input) {
      id
      estado
      fecha
      fechaModificacion
    }
  }
`;

const Pedido = ({pedido}) => {
  const router = useRouter();
  const {id, nombre, apellido, estado: estadoBD, fecha, fechaModificacion: fechaModificacionInicial, productos} = pedido;
  const [estadoPedido, setEstadoPedido] = useState(estadoBD);
  const [fechaModificacion, setFechaModificacion] = useState(fechaModificacionInicial);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const [actualizarEstado] = useMutation(ACTUALIZAR_ESTADO_MAYORISTA, {
    fetchPolicy: 'no-cache',
  });
  const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO_ID, {
    fetchPolicy: 'no-cache',
  });

  const pedidoFinalizado =
    estadoPedido === 'CANCELADO' || estadoPedido === 'ENTREGADO';

  const actualizarFechaModificacion = (estado) => {
    let fechaActualizacion = null;

    if (estado === 'PENDIENTE' || estado === 'ENTREGADO') {
      fechaActualizacion = new Date().toLocaleString('es-AR', {
        timeZone: 'America/Argentina/Buenos_Aires',
      });
    }

    actualizarEstado({
      variables: {
        id: id,
        input: {
          estado: estado,
          fechaModificacion: fechaActualizacion,
        },
      },
    }).then((response) => {
      if (response.data.actualizarEstadoMayorista) {
        setEstadoPedido(estado);
        if (fechaActualizacion) {
          setFechaModificacion(`Pedido actualizado en ${fechaActualizacion}`);
        }
      } else {
        console.error('Error al actualizar el estado del pedido');
      }
    }).catch((error) => {
      console.error('Error en la mutación', error);
    });
  };

  const options = [
    {key: 'edit', icon: 'add', text: 'Agregar Productos', value: 'agregar'},
    {
      key: 'delete',
      icon: 'delete',
      text: 'Eliminar Productos',
      value: 'eliminar',
    },
    {key: 'hide', icon: 'edit', text: 'Editar Pedido', value: 'editar'},
  ];

  const handleDropdownChange = (e, {value}) => {
    if (!pedidoFinalizado) {
      if (value === 'eliminar') {
        eliminarProductos();
      } else if (value === 'agregar') {
        asignarProductos();
      } else if (value === 'editar') {
        editarProductos();
      }
    }
  };

  const confirmarCancelarPedido = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cancelar pedido',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarPedido({
          variables: {id},
        })
            .then(() => {
              Swal.fire('Cancelado!', 'El pedido ha sido cancelado.', 'success');
              setEstadoPedido('CANCELADO');
            })
            .catch((error) => {
              Swal.fire('Error', error.message, 'error');
            });
      }
    });
  };

  const eliminarProductos = () => {
    router.push({
      pathname: '/editarPedidoMayorista/[id]/Borrarproductos',
      query: {id},
    });
  };

  const asignarProductos = () => {
    router.push({
      pathname: '/editarPedidoMayorista/[id]/AsignarProductos',
      query: {id},
    });
    setEstadoPedido('PENDIENTE');
  };

  const editarProductos = () => {
    router.push({
      pathname: '/editarPedidoMayorista/[id]/Editarproductosmayorista',
      query: {id},
    });
  };

  const handleChangeEstado = (e) => {
    const nuevoEstado = e.target.value;

    const confirmarCambioEstado = (estado) => {
      Swal.fire({
        title: `¿Confirmas que este pedido ha sido ${estado.toLowerCase()}?`,
        text: 'Esta acción no se puede deshacer',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          actualizarFechaModificacion(estado);
        } else {
          setEstadoPedido(estadoBD);
        }
      });
    };

    if (nuevoEstado === 'CANCELADO') {
      confirmarCancelarPedido();
    } else if (nuevoEstado === 'FINALIZADO' || nuevoEstado === 'ENTREGADO') {
      confirmarCambioEstado(nuevoEstado);
    } else {
      actualizarFechaModificacion(nuevoEstado);
    }
  };


  return (
    <div className="mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg">
      <div>
        <p className="font-bold text-gray-800">Cliente: {nombre}{apellido}</p>
        <Button.Group color="teal">
          <Button>Acciones</Button>
          <Dropdown
            className="button icon"
            floating
            options={options}
            onChange={handleDropdownChange}
            open={isDropdownOpen && !pedidoFinalizado}
            onOpen={() => setIsDropdownOpen(true)}
            onClose={() => setIsDropdownOpen(false)}
            disabled={
              pedidoFinalizado || estadoPedido === 'FINALIZADO'
            }
          />
        </Button.Group>
        <h2 className="text-gray-800 mt-5">Estado Pedido</h2>
        <select
          value={estadoPedido}
          onChange={handleChangeEstado}
          className="mt-2 appearance-none bg-blue-600 border border-blue text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
          disabled={pedidoFinalizado}
        >
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="FINALIZADO">FINALIZADO</option>
          <option value="CANCELADO">CANCELADO</option>
          <option value="ENTREGADO">ENTREGADO</option>
        </select>
        <h2 className="mt-4 font-bold text-lg">{fechaModificacion}</h2>
      </div>
      <div>
        <h2 className="font-bold text-lg">Resumen Pedido:</h2>
        {productos.map((articulo) => (
          <div key={articulo.id}>
            <p>
              {articulo.nombre}:{' '}
              <span className="font-bold uppercase">{articulo.cantidad}</span>
            </p>
          </div>
        ))}
        <h2 className="mt-4 font-bold text-lg">Fecha Creacion:</h2>
        <p>{fecha}</p>
      </div>
    </div>
  );
};

export default Pedido;
