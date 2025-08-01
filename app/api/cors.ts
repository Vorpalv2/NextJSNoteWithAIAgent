import { NextRequest, NextResponse } from "next/server";

export function cors(request: NextRequest) {
  const origin = request.headers.get("origin") || "";
  const allowedOrigins = ["http://localhost:4000", "http://localhost:3000"];

  const isAllowedOrigin = allowedOrigins.includes(origin);

  const headers = {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };

  return headers;
}

export function handleCORS(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: cors(request),
    });
  }

  return null;
}
