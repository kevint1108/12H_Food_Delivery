import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setData(response.data.data || []);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("FETCH ORDERS ERROR:", error);
      setData([]);
    }
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;

    const loadOrders = async () => {
      try {
        const response = await axios.post(
          url + "/api/order/userorders",
          {},
          { headers: { token } }
        );

        if (!cancelled) {
          setData(
            response.data.success
              ? response.data.data || []
              : []
          );
        }
      } catch (error) {
        console.error("FETCH ORDERS ERROR:", error);

        if (!cancelled) {
          setData([]);
        }
      }
    };

    loadOrders();

    return () => {
      cancelled = true;
    };
  }, [token, url]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>

      <div className="container">
        {data.map((order, index) => (
          <div
            key={order._id || index}
            className="my-orders-order"
          >
            <img src={assets.parcel_icon} alt="Parcel" />

            <p>
              {order.items.map((item, itemIndex) => {
                const text = `${item.name} x ${item.quantity}`;

                return itemIndex === order.items.length - 1
                  ? text
                  : `${text}, `;
              })}
            </p>

            <p>${Number(order.amount).toFixed(2)}</p>
            <p>Items: {order.items.length}</p>

            <p>
              <span>&#x25cf;</span>{" "}
              <b>{order.status || "Food Processing"}</b>
            </p>

            <button type="button" onClick={fetchOrders}>
              Track Order
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
