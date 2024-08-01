fetch("http://localhost:8080/api/orders")
  .then((res) => res.json())
  .then((data) => {
    try {
      console.log("Received data:", data);
      const orders = Array.isArray(data.payload) ? data.payload : [];
      const fragment = document.createDocumentFragment();

      if (orders.length === 0) {
        const noOrdersMessage = document.createElement("p");
        noOrdersMessage.textContent =
          "No hay órdenes disponibles en este momento.";
        fragment.appendChild(noOrdersMessage);
      } else {
        orders.forEach((order) => {
          console.log("Processing order:", order);
          const div = document.createElement("div");

          const numberParagraph = document.createElement("p");
          numberParagraph.textContent = `Orden número: ${
            order.number || "N/A"
          }`;

          const priceParagraph = document.createElement("p");
          priceParagraph.textContent = `Total de la orden: ${
            order.price || "N/A"
          }`;

          const statusParagraph = document.createElement("p");
          statusParagraph.textContent = `Estado: ${order.status || "N/A"}`;

          div.appendChild(numberParagraph);
          div.appendChild(priceParagraph);
          div.appendChild(statusParagraph);
          fragment.appendChild(div);
        });
      }

      const container = document.getElementById("orders");
      if (container) {
        container.appendChild(fragment);
      } else {
        console.error("Container element 'orders' not found");
      }
    } catch (error) {
      console.error("Error processing orders:", error);
    }
  })
  .catch((error) => console.error("Fetch error:", error));
