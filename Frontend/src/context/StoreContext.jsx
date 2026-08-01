import { createContext, useEffect, useState } from "react";

import axios from "axios";

import { API_URL } from "../config";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {
  
  const url = API_URL;

  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [search, setSearch] = useState("");

  const [foodLoading, setFoodLoading] =
    useState(true);

  const [foodError, setFoodError] =
    useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const addToCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1
    }));

    if (!token) return;

    try {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        {
          headers: { token }
        }
      );
    } catch (error) {
      console.error(
        "ADD TO CART ERROR:",
        error.response?.data || error.message
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const nextCart = { ...prev };
      const quantity = Number(nextCart[itemId]) || 0;

      if (quantity <= 1) {
        delete nextCart[itemId];
      } else {
        nextCart[itemId] = quantity - 1;
      }

      return nextCart;
    });

    if (!token) return;

    try {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        {
          headers: { token }
        }
      );
    } catch (error) {
      console.error(
        "REMOVE FROM CART ERROR:",
        error.response?.data || error.message
      );
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;

    for (const itemId in cartItems) {
      const quantity = Number(cartItems[itemId]) || 0;

      if (quantity <= 0) continue;

      const itemInfo = food_list.find(
        (food) => food._id === itemId
      );

      if (!itemInfo) continue;

      totalAmount +=
        Number(itemInfo.price) * quantity;
    }

    return totalAmount;
  };

  const fetchFoodList = async () => {
  try {
    setFoodLoading(true);
    setFoodError("");

    const endpoint = `${url}/api/food/list`;

    console.log(
      "FRONTEND FOOD API:",
      endpoint
    );

    const response = await axios.get(
      endpoint,
      {
        timeout: 20000
      }
    );

    console.log(
      "FOOD RESPONSE:",
      response.data
    );

    if (
      response.data.success &&
      Array.isArray(response.data.data)
    ) {
      setFoodList(response.data.data);
    } else {
      setFoodList([]);

      setFoodError(
        response.data.message ||
          "Backend returned an invalid food list."
      );
    }
  } catch (error) {
    console.error(
      "FRONTEND FOOD ERROR:",
      {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        status: error.response?.status,
        response: error.response?.data
      }
    );

    setFoodList([]);

    setFoodError(
      error.response?.data?.message ||
        `Unable to connect to backend: ${url}`
    );
  } finally {
    setFoodLoading(false);
  }
};

  const loadCartData = async (currentToken) => {
    if (!currentToken) return;

    try {
      const response = await axios.post(
        `${url}/api/cart/get`,
        {},
        {
          headers: {
            token: currentToken
          }
        }
      );

      if (response.data.success) {
        setCartItems(
          response.data.cartData || {}
        );
      } else {
        setCartItems({});
      }
    } catch (error) {
      setCartItems({});

      console.error(
        "LOAD CART ERROR:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFoodList();

      const savedToken =
        localStorage.getItem("token");

      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    };

    loadData();
  }, []);

  const contextValue = {
    food_list,
    foodLoading,
    foodError,
    fetchFoodList,

    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,

    url,

    token,
    setToken,

    search,
    setSearch
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;