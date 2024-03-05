/* eslint-disable linebreak-style */
/* eslint-disable semi */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React from "react";
import {useMutation, gql} from "@apollo/client";
import Swal from "sweetalert2";
import Router from "next/router";

const ACTUALIZAR_ESTADO = gql`
  mutation actualizarReparacion($id: ID!, $input: actualizarReparacionesInput) {
    actualizarReparacion(id: $id, input: $input) {
      estado
    }
  }
`;

const PlacasClientes = ({reparacion}) => {
  const [actualizarReparacion, {loading}] = useMutation(ACTUALIZAR_ESTADO, {
    fetchPolicy: "no-cache",
  });

  const {id, numerocliente, detalle, tecnico, fecha, componente, estado, observaciones} =
    reparacion;

  const confirmarCambioEstado = (newEstado) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Confirmar que la reparación ha sido reparada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar estado",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        actualizarReparacion({
          variables: {
            id: id,
            input: {estado: newEstado},
          },
        })
            .then(() => {
              Swal.fire(
                  "¡Actualizado!",
                  "El estado de la reparación ha sido actualizado.",
                  "success",
                  Router.reload('/Placas')
              );
            })
            .catch((error) => {
              console.error("Error al actualizar reparación:", error);
              Swal.fire(
                  "Error",
                  "No se pudo actualizar el estado de la reparación, VERIFICA LOS PERMISOS",
                  "error",
              );
            });
      }
    });
  };

  const handleEstadoChange = (e) => {
    const newEstado = e.target.value;
    if (newEstado !== estado) {
      confirmarCambioEstado(newEstado);
    }
  };

  const editarplacacliente = () => {
    Router.push({
      pathname: '/editarPlacaCliente/[id]',
      query: {id}
    })
  }
  const isReparada = estado === "REPARADA";

  return (
    <tr key={id}>
      <td className="border px-5 py-2 text-center">{tecnico}</td>
      <td className="border px-5 py-2 text-center">{numerocliente}</td>
      <td className="border px-5 py-2 text-center">{componente}</td>
      <td className="border px-5 py-2 text-center">{detalle}</td>
      <td className="border px-5 py-2 text-center">{observaciones}</td>
      <td className="border px-5 py-2 text-center">{fecha}</td>
      <td className="border px-5 py-2 text-center">
        <select
          value={estado}
          onChange={handleEstadoChange}
          disabled={loading || isReparada}
        >
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="REPARADA">REPARADA</option>
        </select>
        <button disabled={loading || isReparada} className="mt-4" value="OBSERVACION" onClick={editarplacacliente}>Observacion</button>
      </td>
    </tr>
  );
};

export default PlacasClientes;
