import { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const addToOrder = (item) => {
    // Calculate the total price including extras
    const extrasTotal = item.extras.reduce((total, extra) => total + extra.totalPrice, 0);
    const itemTotalPrice = parseFloat(item.basePrice) + extrasTotal;

    // Update the orders
    setOrders(prevOrders => {
      const newOrders = [...prevOrders, { ...item, totalPrice: itemTotalPrice }];
      // Calculate the new total amount
      const newTotalAmount = newOrders.reduce((total, order) => total + order.totalPrice, 0);
      setTotalAmount(parseFloat(newTotalAmount.toFixed(2)));
      return newOrders;
    });
  };

  const removeFromOrder = (itemId) => {
    setOrders(prevOrders => {
      const newOrders = prevOrders.filter(item => item.id !== itemId);
      // Calculate the new total amount
      const newTotalAmount = newOrders.reduce((total, order) => total + order.totalPrice, 0);
      setTotalAmount(parseFloat(newTotalAmount.toFixed(2)));
      return newOrders;
    });
  };

  const clearOrders = () => {
    setOrders([]);
    setTotalAmount(0);
  };

  return (
    <OrderContext.Provider value={{ orders, totalAmount, addToOrder, removeFromOrder, clearOrders }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext);
