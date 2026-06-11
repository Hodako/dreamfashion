import { NextResponse } from "next/server";
import { requireSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    try {
      await requireSession();
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "IMGBB_API_KEY is not configured" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("image");
    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    const blob = file as Blob;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    const imgbbForm = new FormData();
    imgbbForm.append("image", base64);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbForm,
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }

    const json = await res.json();
    if (!json.success) {
      return NextResponse.json({ error: json.error?.message || "Upload failed" }, { status: 400 });
    }

    return NextResponse.json({ url: json.data.url as string });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
