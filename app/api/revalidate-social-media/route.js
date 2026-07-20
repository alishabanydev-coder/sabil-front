import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { SOCIAL_MEDIA_TAG } from "@/component/admin/services/socialMediaApi";

export async function POST() {
  revalidateTag(SOCIAL_MEDIA_TAG);

  return NextResponse.json({ ok: true });
}
