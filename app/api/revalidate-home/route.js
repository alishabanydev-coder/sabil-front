import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST() {
  revalidatePath("/");
  revalidatePath("/about");
  return NextResponse.json({ ok: true });
}
