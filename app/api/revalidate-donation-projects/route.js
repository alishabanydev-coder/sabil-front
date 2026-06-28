import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { DONATION_PROJECTS_TAG } from "@/component/donation/services/donationPublicApi";

export async function POST() {
  revalidateTag(DONATION_PROJECTS_TAG);

  return NextResponse.json({ ok: true });
}
