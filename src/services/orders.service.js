class OrdersService {
  constructor(orderDAO, userDAO, businessDAO) {
    this.orderDAO = orderDAO;
    this.userDAO = userDAO;
    this.businessDAO = businessDAO;
  }

  async createOrder(orderData) {
    const { user, business, products } = orderData;

    const businessObject = await this.businessDAO.getBusinessById(business);

    if (!businessObject) {
      throw new Error("Business not found");
    }

    const productsInBusiness = businessObject.products.filter((p) =>
      products.includes(p.id)
    );

    if (productsInBusiness.length === 0) {
      throw new Error("No valid products found");
    }

    const totalPrice = productsInBusiness.reduce((acc, p) => acc + p.price, 0);

    const order = await this.orderDAO.createOrder({
      number: Date.now(),
      totalPrice,
      products: productsInBusiness,
      status: "pending",
      business,
      user,
    });

    if (!order) {
      throw new Error("Failed to create order");
    }

    await this.userDAO.addOrderToUser(user, order._id);

    return order;
  }

  async resolveOrder(orderId, status) {
    if (!status) {
      throw new Error("Invalid status");
    }

    const result = await this.orderDAO.resolveOrder(orderId, status);
    if (!result) {
      throw new Error("Failed to resolve order");
    }
    return result;
  }
}

module.exports = { OrdersService };
