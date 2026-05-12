import apiClient from './apiClient';

/**
 * Register a new vendor
 * @param {FormData} formData - Must include businessName, slug, description, address, phone, email, logo, banner
 */
export const registerVendor = async (formData) => {
  try {
    const response = await apiClient.post('/vendor', formData);
    return response.data;
  } catch (error) {
    console.error('Vendor registration error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to register vendor.',
      statusCode: 500
    };
  }
};

/**
 * Get vendor details
 */
export const getVendorDetails = async () => {
  try {
    const response = await apiClient.get('/vendor/vendor-details');
    return response.data;
  } catch (error) {
    console.error('Fetch vendor details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch vendor details.',
      statusCode: 500
    };
  }
};

/**
 * Get vendor products
 */
export const getVendorProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/product/fetch-products', { params });
    return response.data;
  } catch (error) {
    console.error('Fetch vendor products error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch vendor products.',
      statusCode: 500
    };
  }
};

/**
 * Delete a product
 * @param {string} productId
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/product/delete-product/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Delete product error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete product.',
      statusCode: 500
    };
  }
};

/**
 * Get product details
 * @param {string} productId
 */
export const getProductDetails = async (productId) => {
  try {
    const response = await apiClient.get(`/product/product-details/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Fetch product details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch product details.',
      statusCode: 500
    };
  }
};

/**
 * Delete a product variant
 * @param {string} variantId
 */
export const deleteProductVariant = async (variantId) => {
  try {
    const response = await apiClient.delete(`/product/delete-product-variant/${variantId}`);
    return response.data;
  } catch (error) {
    console.error('Delete product variant error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete product variant.',
      statusCode: 500
    };
  }
};

/**
 * Create a new product
 * @param {Object} data - Product and variants data
 */
export const createProduct = async (data) => {
  try {
    const formData = new FormData();
    
    // Core Product Data
    formData.append('name', data.name);
    formData.append('slug', data.slug || data.name.toLowerCase().replace(/\s+/g, '-'));
    formData.append('description', data.description || '');
    formData.append('categoryId', data.categoryId);
    formData.append('metaTitle', data.metaTitle || '');
    formData.append('metaDescription', data.metaDescription || '');
    formData.append('status', data.status || 'ACTIVE');
    formData.append('hasVariants', data.hasVariants || false);

    // Variants Handling
    if (data.variants && data.variants.length > 0) {
      data.variants.forEach((variant, vIdx) => {
        formData.append(`variants[${vIdx}].sku`, variant.sku);
        formData.append(`variants[${vIdx}].price`, variant.price);
        formData.append(`variants[${vIdx}].salesPrice`, variant.salesPrice);
        formData.append(`variants[${vIdx}].stock`, variant.stock);
        
        // Variant Attributes
        if (variant.attributes) {
          Object.keys(variant.attributes).forEach(key => {
            formData.append(`variants[${vIdx}].attributes.${key}`, variant.attributes[key]);
          });
        }

        // Variant Files
        if (variant.thumbnail) {
          formData.append(`variant_${vIdx}_thumbnail`, variant.thumbnail);
        }
        
        if (variant.images && variant.images.length > 0) {
          variant.images.forEach(img => {
            formData.append(`variant_${vIdx}_images`, img);
          });
        }
      });
    }

    const response = await apiClient.post('/product/create-product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Create product error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to create product.',
      statusCode: 500
    };
  }
};

/**
 * Update an existing product
 * @param {string} id - Product ID
 * @param {Object} data - Updated product data
 */
export const updateProduct = async (id, data) => {
  try {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('description', data.description || '');
    formData.append('categoryId', data.categoryId);
    formData.append('metaTitle', data.metaTitle || '');
    formData.append('metaDescription', data.metaDescription || '');
    formData.append('status', data.status || 'ACTIVE');

    if (data.variants && data.variants.length > 0) {
      data.variants.forEach((variant, vIdx) => {
        // Send variant ID for identification during update
        if (variant._id) {
          formData.append(`variants[${vIdx}]._id`, variant._id);
        }
        
        formData.append(`variants[${vIdx}].sku`, variant.sku);
        formData.append(`variants[${vIdx}].price`, variant.price);
        formData.append(`variants[${vIdx}].salesPrice`, variant.salesPrice);
        formData.append(`variants[${vIdx}].stock`, variant.stock);
        
        if (variant.attributes) {
          Object.keys(variant.attributes).forEach(key => {
            formData.append(`variants[${vIdx}].attributes.${key}`, variant.attributes[key]);
          });
        }

        // Only upload if it's a new file
        if (variant.thumbnail && variant.thumbnail instanceof File) {
          formData.append(`variant_${vIdx}_thumbnail`, variant.thumbnail);
        }
        
        if (variant.images && variant.images.length > 0) {
          variant.images.forEach((img) => {
            if (img instanceof File) {
              formData.append(`variant_${vIdx}_images`, img);
            }
          });
        }
      });
    }

    const response = await apiClient.put(`/product/update-product/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Update product error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to update product.',
      statusCode: 500
    };
  }
};

/**
 * Create a new vendor category
 * @param {Object} data - Includes name, slug, description, attributes, image
 */
export const createCategory = async (data) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug || data.name.toLowerCase().replace(/\s+/g, '-'));
    formData.append('description', data.description || '');
    
    if (data.image && data.image instanceof File) {
      formData.append('file', data.image);
    }

    if (data.attributes && data.attributes.length > 0) {
      formData.append('attributes', JSON.stringify(data.attributes));
    }

    // Debug log
    console.log('Sending Category Data:', Object.fromEntries(formData.entries()));

    const response = await apiClient.post('/product/create-category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Create category error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to create category.',
      statusCode: 500
    };
  }
};
/**
 * Update an existing vendor category
 * @param {string} id - Category ID
 * @param {Object} data - Updated category data
 */
export const updateCategory = async (id, data) => {
  try {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('slug', data.slug);
    formData.append('description', data.description || '');
    
    if (data.image && data.image instanceof File) {
      formData.append('file', data.image);
    }

    if (data.attributes && data.attributes.length > 0) {
      formData.append('attributes', JSON.stringify(data.attributes));
    }

    // Debug log
    console.log('Updating Category Data:', Object.fromEntries(formData.entries()));

    const response = await apiClient.put(`/product/update-category/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    console.error('Update category error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to update category.',
      statusCode: 500
    };
  }
};


/**
 * Delete a vendor category
 * @param {string} categoryId
 */
export const deleteCategory = async (categoryId) => {
  try {
    const response = await apiClient.delete(`/product/delete-category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Delete category error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to delete category.',
      statusCode: 500
    };
  }
};

/**
 * Edit vendor details
 * @param {FormData} formData - Updated vendor data
 */
export const editVendorDetails = async (formData) => {
  try {
    const response = await apiClient.put('/vendor', formData);
    return response.data;
  } catch (error) {
    console.error('Edit vendor details error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to update vendor details.',
      statusCode: 500
    };
  }
};

/**
 * Get vendor categories
 */
export const getVendorCategories = async () => {
  try {
    const response = await apiClient.get('/vendor/vendor-categories');
    return response.data;
  } catch (error) {
    console.error('Fetch vendor categories error:', error);
    return error.response?.data || {
      success: false,
      message: 'Failed to fetch vendor categories.',
      statusCode: 500
    };
  }
};
