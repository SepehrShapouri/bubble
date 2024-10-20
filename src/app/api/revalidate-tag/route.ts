// app/api/revalidate/route.ts

import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body from the request
    const body = await request.json();
    const { tag } = body;

    if (!tag) {
      return NextResponse.json(
        { message: "Tag is required in the request body" },
        { status: 400 },
      );
    }

    // Call revalidateTag with the received tag
    revalidateTag(tag);

    return NextResponse.json({
      message: `Tag ${tag} revalidated successfully`,
    });
  } catch (error) {
    console.error("Error revalidating tag:", error);
    return NextResponse.json(
      { message: "Error revalidating tag", error: String(error) },
      { status: 500 },
    );
  }
}
