import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const username = user.username;
    if (username === null) {
      return new NextResponse("Username is required", { status: 400 });
    }

    const role = "USER";

    const existingUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!existingUser) {
      await db.user.create({
        data: {
          id: user.id,
          username: username,
          role,
        },
      });
      return new NextResponse("User created in database", { status: 200 });
    }
    return new NextResponse("Usuario existente.", { status: 200 });
  } catch (error) {
    console.log("[USERS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
