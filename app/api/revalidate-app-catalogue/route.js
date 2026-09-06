import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidateTag("app-catalogue-navigation");
  revalidateTag("app-catalogue-home-videos");
  revalidateTag("app-catalogue-suggested-videos");
  revalidateTag("app-catalogue-featured-videos");
  revalidateTag("app-catalogue-all-videos");

  return NextResponse.json({ ok: true });
}
