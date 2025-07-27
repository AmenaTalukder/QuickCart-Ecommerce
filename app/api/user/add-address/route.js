import connectDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = await getAuth(request); // await is important

    const address = await request.json(); // expect flat body now

    if (!userId || !address) {
      return NextResponse.json(
        { success: false, message: "User ID and address are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const newAddress = await Address.create({ ...address, userId });

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      address: newAddress
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
