const productDao = require("../daos/mongoose.dao");

exports.getProducts = async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;
    const skip = (page - 1) * limit;

    const filters = {};
    if (query) {
      filters.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ];
    }

    const totalDocs = await productDao.getProducts().countDocuments(filters);
    const totalPages = Math.ceil(totalDocs / limit);

    const sortOptions = sort ? { price: sort === "asc" ? 1 : -1 } : undefined;

    const products = await productDao
      .getProducts(filters)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      status: "success",
      payload: products,
      totalPages,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink:
        page > 1
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
      nextLink:
        page < totalPages
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productDao.getProductById(pid);
    res.json({ status: "success", payload: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await productDao.createProduct(req.body);
    res.status(201).json({ status: "success", payload: newProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const updatedProduct = await productDao.updateProduct(pid, req.body);
    res.json({ status: "success", payload: updatedProduct });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const deletedProduct = await productDao.deleteProduct(pid);
    res.json({ status: "success", message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getProductsView = async (req, res) => {
  try {
    const products = await productDao.getProducts();
    res.render("products", { products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
