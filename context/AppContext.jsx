"use client";
import { productsDummyData } from "@/assets/assets";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useRouter } from "next/navigation";
import { stringify } from "postcss";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY;
  const router = useRouter();

  const { user } = useUser();
  const { getToken } = useAuth();

  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [cartItems, setCartItems] = useState({});

  const fetchProductData = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    try {
      if (user?.publicMetadata?.role === "seller") {
        setIsSeller(true);
      }

      const token = await getToken();
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setUserData(data.user);
        setCartItems(data.user.cartItems || {});
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred fetching user data");
    }
  };

  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);

    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success("Item added to cart");
      } catch (error) {
        toast.error("Failed to add item to cart");
      }
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    const updatedCart = { ...cartItems };
    if (quantity === 0) {
      delete updatedCart[itemId];
    } else {
      updatedCart[itemId] = quantity;
    }
    setCartItems(updatedCart);
    if (user) {
      try {
        const token = await getToken();
        await axios.post(
          "/api/cart/update",
          { cartData },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        toast.success("Cart Updated Successfully");
      } catch (error) {
        toast.error("Failed to update cart");
      }
    }
  };

  const saveCartToServer = async (cartData) => {
    try {
      const token = await getToken();
      await axios.post(
        "/api/user/cart",
        { cartItems: cartData },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (error) {
      toast.error("Failed to save cart");
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((acc, qty) => acc + qty, 0);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const item = products.find((product) => product._id === itemId);
      if (item && cartItems[itemId] > 0) {
        totalAmount += item.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const value = {
    user,
    getToken,
    currency,
    router,
    isSeller,
    setIsSeller,
    userData,
    fetchUserData,
    products,
    fetchProductData,
    cartItems,
    setCartItems,
    addToCart,
    updateCartQuantity,
    getCartCount,
    getCartAmount
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
