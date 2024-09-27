import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const url = `${process.env.NEXT_ENDPOINT}/insert`;
  console.log(body)

  const token = request.cookies.get('token');
  console.log("tokennnn------------ ", token?.value)

  axios.defaults.headers.common['Authorization'] = `Bearer ${token?.value}`;



  const data = await axios.post(url, {
    body,
    token: token,
  }, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.data)
    .catch(error => {
      console.log(error)
      return {status: error.response.status, message: error.response.data.message }
    })


  if(data.status) {
  const responseErro = NextResponse.json(
    { success: false, message: data.message },
    { status: 400, headers: { "content-type": "application/json" } }
);
  return responseErro
  }else{


  const response = NextResponse.json(
    { success: true },
    { status: 200, headers: { "content-type": "application/json" } }
  );

  response.cookies.set({
    name: "token",
    value: data.token,
    path: "/",
    maxAge: 604800,
  });

  response.cookies.set({
    name: "id",
    value: data.id,
    path: "/",
    maxAge: 604800,
  });

  return response;
  }
}
