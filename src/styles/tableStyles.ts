
// Este archivo define los estilos personalizados para una tabla de datos en las dos  pages con tabla.
export const getTableStyles = () => ({
  table: {
    style: {
      background: "#00",
      borderRadius: "0.75rem",
      color: "#1f364a",
      minHeight: "400px",
    },
  },
  headRow: {
    style: {
      background: "#f3f6fa",
      color: "#1f364a",
      fontWeight: "bold",
      fontSize: "1rem",
    },
  },
  headCells: {
    style: {
      color: "#1f364a",
      fontWeight: "bold",
      fontSize: "1rem",
    },
  },
  rows: {
    style: {
      backgroundColor: "#fff",
      color: "#1f364a",
      fontSize: "0.95rem",
      borderBottom: "1px solid #e5e7eb",
      '&:nth-of-type(odd)': {
        backgroundColor: "#f3f6fa",
      },
      '&:hover': {
        backgroundColor: "#e0e7ef",
      },
    },
  },
  pagination: {
    style: {
      background: "#f3f6fa",
      color: "#1f364a",
      borderBottomLeftRadius: "0.75rem",
      borderBottomRightRadius: "0.75rem",
    },
    pageButtonsStyle: {
      fill: "#1f364a",
      '&:disabled': {
        fill: "#a3a3a3",
      },
    },
  },
});