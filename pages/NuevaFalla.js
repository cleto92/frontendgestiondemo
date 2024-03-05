/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable quotes */
/* eslint-disable object-curly-spacing */
import React, { useContext, useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useMutation, gql } from "@apollo/client";
import AsignarProductos from "../components/Pedidos/AsignarProductos";
import PedidoContext from "../context/pedidosMayoristas/PedidoMayoristaContext";
import { useRouter } from "next/router";
import Resumen from "../components/Pedidos/Resumen";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const NUEVA_FALLA = gql`
  mutation nuevaFalla($input: FallasInput) {
    nuevaFalla(input: $input) {
      id
      detalle
      fecha
      productos {
        id
        nombre
        cantidad
      }
    }
  }
`;

const NuevaFalla = () => {
  const [mensaje, guardarMensaje] = useState(null);
  const [formularioValido, setFormularioValido] = useState(false);
  const router = useRouter();
  const pedidoContext = useContext(PedidoContext);
  const { productos } = pedidoContext;

  useEffect(() => {
    const todosLosProductosValidos = productos.every((p) => p.cantidad > 0);
    setFormularioValido(todosLosProductosValidos);
  }, [productos]);

  const [nuevaFalla] = useMutation(NUEVA_FALLA, {
    fetchPolicy: "no-cache",
  });

  const formik = useFormik({
    initialValues: {
      detalle: "",
      productos: productos,
    },
    validationSchema: Yup.object({
      detalle: Yup.string().required("El campo detalle es obligatorio"),
      productos: Yup.array()
          .of(
              Yup.object().shape({
                cantidad: Yup.number()
                    .moreThan(0, "Debe ser mayor a 0")
                    .required("La cantidad es requerida"),
              }),
          )
          .required("Debe asignar al menos un producto"),
    }),
    onSubmit: async (valores) => {
      const { detalle } = valores;
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres registrar esta falla?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, registrar!',
        cancelButtonText: 'No, cancelar',
      });

      if (result.isConfirmed) {
        try {
          const productosFormateados = productos.map((p) => ({
            id: p.id,
            nombre: p.nombre,
            cantidad: p.cantidad,
          }));
          const { data } = await nuevaFalla({
            variables: {
              input: {
                detalle,
                productos: productosFormateados,
              },
            },
          });
          Swal.fire({
            title: 'Falla Registrada',
            text: 'Click en OK, para ser redireccionado',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then(() => {
            setTimeout(() => {
              router.push("/Fallas");
            }, 3000);
          });
        } catch (error) {
          guardarMensaje(
              error.message
                  .replace("ApolloError: ", "")
                  .replace("GraphQL error: ", ""),
          );
          setTimeout(() => {
            guardarMensaje(null);
          }, 5000);
        }
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
        <form onSubmit={formik.handleSubmit}>
          <p className="mt-10 my-2 bg-white border-l-4 text-red-600 p-2 text-sm font-bold border-gray-800">
            Ingresar Detalle
          </p>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray leading-tight focus:outline-none focus:shadow-outline"
            id="detalle"
            type="text"
            placeholder="Detalle"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.detalle}
          />
          <AsignarProductos />
          <Resumen />
          <input
            type="submit"
            className="bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900"
            value="Registrar"
            disabled={!formik.isValid || !formik.dirty || !formularioValido}
          />
        </form>
      </Layout>
    </>
  );
};

export default NuevaFalla;

