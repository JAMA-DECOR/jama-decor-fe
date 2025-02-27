import BaseApi from ".";

const resource = "Order";

const getAllOrders = async (search, pageIndex, pageSize) => {
  try {
    if (search) {
      return await searchOrders(search, pageIndex, pageSize);
    } else {
      var params = {};
      if (pageIndex) {
        params = { ...params, pageIndex };
      }
      if (pageSize) {
        params = { ...params, pageSize };
      }
      const response = await BaseApi.get(`/${resource}/GetAllWithPaging`, {
        params: params,
      });
      return response.data;
    }
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const searchOrders = async (search, pageIndex, pageSize = 1000) => {
  try {
    var params = {};
    if (search) {
      params = { ...params, search };
    }
    if (pageIndex) {
      params = { ...params, pageIndex };
    }
    if (pageSize) {
      params = { ...params, pageSize };
    }

    const response = await BaseApi.get(`/${resource}/GetAllWithPaging`, {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.log("Error search item: ", error);
    return [];
  }
};

const getOrderById = async (orderId) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetOrderById`, {
      params: {
        id: orderId,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const getQuoteMaterialByOrderId = async (orderId) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetQuoteMaterialByOrderId/${orderId}`);
    return response.data;
  } catch (error) {
    console.log("Error get quote material by order id: ", error);
    return undefined;
  }
};

const createOrder = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/CreateOrder`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error create item: ", error);
    return false;
  }
};

const updateOrder = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateOrder`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const updateStatus = async (id, status) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateStatus/${status}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const updateOrderStatus = async (status, id) => {
  try {
    const response = await BaseApi.put(`/${resource}/UpdateOrderStatus/${status}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const updateQuote = async (id) => {
  try {
    const response = await BaseApi.put(`/${resource}/SyncItem/${id}`);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const deleteOrder = async (id) => {
  try {
    // const success = await updateOrder(id, 5);
    const success = await updateOrderStatus(5, id);
    return success;
  } catch (error) {
    console.log("Error delete item: ", error);
    return false;
  }
};

const exportOrder = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/ExportQuoteAsPDF/${id}`, {
      responseType: "blob",
    });
    return response.data;
  } catch (error) {
    console.log("Error export order: ", error);
    return undefined;
  }
};

const getByForemanId = async (id, search, pageIndex, pageSize) => {
  try {
    if (search) {
      return await searchGetByForemanId(id, search, pageIndex, pageSize);
    } else {
      var params = {};
      if (pageIndex) {
        params = { ...params, pageIndex };
      }
      if (pageSize) {
        params = { ...params, pageSize };
      }
      const response = await BaseApi.get(`/${resource}/GetByForemanId/${id}`, {
        params: params,
      });
      return response.data;
    }
  } catch (error) {
    console.log("Error get items: ", error);
    return false;
  }
};

const searchGetByForemanId = async (id, search, pageIndex, pageSize = 1000) => {
  try {
    var params = {};
    if (search) {
      params = { ...params, search };
    }
    if (pageIndex) {
      params = { ...params, pageIndex };
    }
    if (pageSize) {
      params = { ...params, pageSize };
    }

    const response = await BaseApi.get(`/${resource}/GetByForemanId/${id}`, {
      params: params,
    });

    return response.data;
  } catch (error) {
    console.log("Error search item: ", error);
    return [];
  }
};

const syncItems = async (id) => {
  try {
    const response = await BaseApi.put(`/${resource}/SyncItem/${id}`);
    return response.status === 200 ? response.data : response.status === 200;
  } catch (error) {
    console.log("Error sync item: ", error);
    return false;
  }
};

const OrderApi = {
  getAllOrders,
  searchOrders,
  getOrderById,
  createOrder,
  updateOrder,
  updateStatus,
  updateOrderStatus,
  updateQuote,
  deleteOrder,
  getQuoteMaterialByOrderId,
  exportOrder,
  getByForemanId,
  syncItems,
};

export default OrderApi;
