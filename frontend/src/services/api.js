import axios from "axios";

/*export const listarConsumoService = async () => {
  const res = await axios.get("http://localhost:3000/consumo/list", { withCredentials: true });
  return res.data;
};

export const listarSuscripcionService = async () => {
  const res = await axios.get("http://localhost:3000/suscripcion/list", { withCredentials: true });
  return res.data;
};

export const editarSuscripcionService = async (id, datos, timezone) => {
  const res = await axios.put( `http://localhost:3000/suscripcion/update/${id}`, datos, { 
    withCredentials: true,
      headers: {
        'X-Timezone': timezone
      }
  });
  return res.data;
};
export const eliminarSuscripcionService = async (id) => {
  const res = await axios.delete(`http://localhost:3000/suscripcion/delete/${id}`, {
    withCredentials: true,
  });
  return res.data;
};*/

export const listarConsumoService = async () => {
  const res = await axios.get("/consumo/list", { withCredentials: true });
  return res.data;
};

export const listarSuscripcionService = async () => {
  const res = await axios.get("/suscripcion/list", { withCredentials: true });
  return res.data;
};

export const editarSuscripcionService = async (id, datos, timezone) => {
  const res = await axios.put( `/suscripcion/update/${id}`, datos, { 
    withCredentials: true,
      headers: {
        'X-Timezone': timezone
      }
  });
  return res.data;
};
export const eliminarSuscripcionService = async (id) => {
  const res = await axios.delete(`/suscripcion/delete/${id}`, {
    withCredentials: true,
  });
  return res.data;
};