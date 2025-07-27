import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POSt(request) {
  try {
    const { userId } = getAuth;

    const { address, items } = await request.json();
    if (!address || items.length === 0) {
      return (
        NextResponse.json({ succecc: false, message: "Invalid data" }),
        {
          status: 400
        }
      );
    }

    // calculate amount using items
    const amount = items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return acc + product.offerprice * item.quantity;
    }, 0);

    await inngest.send({
      name: "order/created",
      data: {
        userId,
        address,
        items,
        amount: amount + Math.floor(amount * 0.02),
        date: Date.now()
      }
    });

    //clear user cart
    const user = await User.findById(userId);
    user.cartItems = {};
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Order created successfully"
    });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    });
  }
}
