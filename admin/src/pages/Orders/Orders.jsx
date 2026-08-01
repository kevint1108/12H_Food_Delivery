import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(
        url + "/api/order/list"
      );

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.log("FETCH ORDERS ERROR:", error);
      toast.error("Cannot load orders");
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        url + "/api/order/status",
        {
          orderId,
          status: event.target.value
        }
      );

      if (response.data.success) {
        await fetchAllOrders();
        toast.success(response.data.message);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.log("UPDATE STATUS ERROR:", error);
      toast.error("Cannot update status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>

      <div className="order-list">
        {orders.map((order, index) => (
          <div
            key={order._id || index}
            className="order-item"
          >
            <img
              src={assets.parcel_icon}
              alt="Parcel"
            />

            <div>
              <p className="order-item-food">
                {order.items.map((item, itemIndex) => {
                  if (
                    itemIndex ===
                    order.items.length - 1
                  ) {
                    return (
                      item.name +
                      " x " +
                      item.quantity
                    );
                  }

                  return (
                    item.name +
                    " x " +
                    item.quantity +
                    ", "
                  );
                })}
              </p>

              <p className="order-item-name">
                {order.address.firstName}{" "}
                {order.address.lastName}
              </p>

              <div className="order-item-address">
                <p>
                  {order.address.street},
                </p>

                <p>
                  {order.address.city},{" "}
                  {order.address.state},{" "}
                  {order.address.country},{" "}
                  {order.address.zipcode}
                </p>
              </div>

              <p className="order-item-phone">
                {order.address.phone}
              </p>
            </div>

            <p>
              Items: {order.items.length}
            </p>

            <p>
              ${Number(order.amount).toFixed(2)}
            </p>

            <select
              value={order.status}
              onChange={(event) =>
                statusHandler(event, order._id)
              }
            >
              <option value="Food Processing">
                Food Processing
              </option>

              <option value="Out for delivery">
                Out for delivery
              </option>

              <option value="Delivered">
                Delivered
              </option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;