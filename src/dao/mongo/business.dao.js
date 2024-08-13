const BusinessModel = require("./models/business.model");

class BusinessDAO {
  async getBusinesses() {
    try {
      const businesses = await BusinessModel.find();
      return businesses.map((b) => b.toObject());
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async getBusinessById(id) {
    try {
      const business = await BusinessModel.findById(id);
      return business?.toObject() ?? null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async saveBusiness(business) {
    try {
      const savedBusiness = await BusinessModel.create(business);
      return savedBusiness.toObject();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async updateBusiness(id, update) {
    try {
      const result = await BusinessModel.findByIdAndUpdate(id, update, {
        new: true,
      });
      return result?.toObject() ?? null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async addProduct(id, product) {
    try {
      const result = await BusinessModel.findByIdAndUpdate(
        id,
        { $push: { products: product } },
        { new: true }
      );
      return result?.toObject() ?? null;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = { BusinessDAO };
