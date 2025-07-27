import connectDB from "@/config/db";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { userId } = getAuth(request);

    await connectDB();

    const user = await User.findById(userId);
    const cartItems = user.cartItems || {};

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Cart fetched successfully",
      cartItems
    });
  } catch (error) {
    console.error("Error ufetching cart:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to fetched  cart"
    });
  }
}
