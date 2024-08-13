class BusinessService {
  constructor(dao) {
    this.dao = dao;
  }

  async createBusiness(businessData) {
    const { name } = businessData;
    if (!name || typeof name !== "string") {
      throw new Error("Invalid business name");
    }

    const business = await this.dao.saveBusiness(businessData);
    return business;
  }

  async addProduct(businessId, product) {
    if (!product || !product.id || !product.name || !product.price) {
      throw new Error("Invalid product data");
    }

    const business = await this.dao.getBusinessById(businessId);
    if (!business) {
      throw new Error("Business not found");
    }

    const result = await this.dao.addProduct(businessId, product);
    return result;
  }
}

module.exports = { BusinessService };
