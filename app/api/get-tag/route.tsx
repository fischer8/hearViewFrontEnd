import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const url = `${process.env.NEXT_ENDPOINT}/get-tag`;

  const { data } = await axios.get(url);

  const response = NextResponse.json(
    { success: true, data },
    { status: 200, headers: { "content-type": "application/json" } }
  );
  return response

}
