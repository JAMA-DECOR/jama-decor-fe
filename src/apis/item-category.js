import BaseApi from ".";

const resource = "ItemCategory";

const getAllItem = async (search, pageIndex, pageSize) => {
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
    const response = await BaseApi.get(`/${resource}/GetAll`, {
      params: params,
    });
    return response;
  } catch (error) {
    console.log("Error get item: ", error);
    return false;
  }
};

const getItemById = async (id) => {
  try {
    const response = await BaseApi.get(`/${resource}/GetById/${id}`);
    return response.data;
  } catch (error) {
    console.log("Error get item by id: ", error);
    return undefined;
  }
};

const createItem = async (data) => {
  try {
    const response = await BaseApi.post(`/${resource}/Create`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error create item: ", error);
    return false;
  }
};

const updateItem = async (data) => {
  try {
    const response = await BaseApi.put(`/${resource}/Update`, data);
    return response.status === 200;
  } catch (error) {
    console.log("Error update item: ", error);
    return false;
  }
};

const deleteItem = async (id) => {
  try {
    const response = await BaseApi.delete(`/${resource}/Delete/${id}`);
    return response.status === 200;
  } catch (error) {
    console.log("Error delete item: ", error);
    return false;
  }
};

const ItemCategoryApi = {
  getAllItem,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};

export default ItemCategoryApi;
