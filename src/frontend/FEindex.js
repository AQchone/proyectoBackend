console.log("FEindex.js started");

window.onload = function () {
  console.log("Window loaded in FEindex.js");

  fetch("http://localhost:8080/api/orders")
    .then((res) => {
      console.log("Fetch response received", res);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("Parsed data:", data);
      const orders = Array.isArray(data.payload) ? data.payload : [];
      const container = document.getElementById("orders");

      if (!container) {
        console.error("Container element 'orders' not found");
        return;
      }

      if (orders.length === 0) {
        container.innerHTML =
          "<p>No hay órdenes disponibles en este momento.</p>";
        return;
      }

      const ordersHTML = orders
        .map(
          (order) => `
        <div>
          <p>Orden número: ${order.number || "N/A"}</p>
          <p>Total de la orden: ${order.totalPrice || "N/A"}</p>
          <p>Estado: ${order.status || "N/A"}</p>
        </div>
      `
        )
        .join("");

      container.innerHTML = ordersHTML;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      const container = document.getElementById("orders");
      if (container) {
        container.innerHTML =
          "<p>Error al cargar las órdenes. Por favor, intente de nuevo más tarde.</p>";
      }
    });
};

console.log("FEindex.js ended");
