import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Smart Irrigation System",
      version: "2.1.0",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "X-Frame-Options": "ALLOWALL",
        "Content-Security-Policy":
          "frame-ancestors 'self' http://localhost:3000 https://localhost:3000;",
      },
    }
  );
}