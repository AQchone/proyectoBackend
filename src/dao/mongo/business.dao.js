const BusinessModel = require("./models/business.model");
const { logger } = require("../../utils/logger");

class BusinessDAO {
  async getBusinesses() {
    try {
      logger.debug("Attempting to fetch all businesses");
      const businesses = await BusinessModel.find();
      logger.info(`Retrieved ${businesses.length} businesses`);
      return businesses.map((b) => b.toObject());
    } catch (err) {
      logger.error("Error fetching businesses:", err);
      return null;
    }
  }

  async getBusinessById(id) {
    try {
      logger.debug(`Attempting to fetch business with id: ${id}`);
      const business = await BusinessModel.findById(id);
      if (business) {
        logger.info(`Retrieved business with id: ${id}`);
      } else {
        logger.warn(`No business found with id: ${id}`);
      }
      return business?.toObject() ?? null;
    } catch (err) {
      logger.error(`Error fetching business with id ${id}:`, err);
      return null;
    }
  }

  async saveBusiness(business) {
    try {
      logger.debug("Attempting to save new business", business);
      const savedBusiness = await BusinessModel.create(business);
      logger.info(`Business saved successfully with id: ${savedBusiness._id}`);
      return savedBusiness.toObject();
    } catch (err) {
      logger.error("Error saving business:", err);
      return null;
    }
  }

  async updateBusiness(id, update) {
    try {
      logger.debug(`Attempting to update business with id: ${id}`, update);
      const result = await BusinessModel.findByIdAndUpdate(id, update, {
        new: true,
      });
      if (result) {
        logger.info(`Business updated successfully: ${id}`);
      } else {
        logger.warn(`No business found to update with id: ${id}`);
      }
      return result?.toObject() ?? null;
    } catch (err) {
      logger.error(`Error updating business with id ${id}:`, err);
      return null;
    }
  }

  async addProduct(id, product) {
    try {
      logger.debug(
        `Attempting to add product to business with id: ${id}`,
        product
      );
      const result = await BusinessModel.findByIdAndUpdate(
        id,
        { $push: { products: product } },
        { new: true }
      );
      if (result) {
        logger.info(`Product added successfully to business: ${id}`);
      } else {
        logger.warn(`No business found to add product with id: ${id}`);
      }
      return result?.toObject() ?? null;
    } catch (err) {
      logger.error(`Error adding product to business with id ${id}:`, err);
      return null;
    }
  }
}

module.exports = { BusinessDAO };
