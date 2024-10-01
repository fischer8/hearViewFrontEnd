import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const url = `${process.env.NEXT_ENDPOINT}/insert`;

  const token = request.cookies.get('token');

  const data = await axios.post(url, {
    data: body,
    token: token?.value,
  }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token?.value}` // Adicionando o token no cabeçalho
    }
  })
    .then(response => response.data)
    .catch(error => {
      console.log(error)
      return { status: error.response.status, message: error.response.data.message }
    })


  if (data.status) {
    const responseErro = NextResponse.json(
      { success: false, message: data.message },
      { status: 400, headers: { "content-type": "application/json" } }
    );
    return responseErro
  } else {


    const response = NextResponse.json(
      { success: true },
      { status: 200, headers: { "content-type": "application/json" } }
    );

    return response;
  }
}
