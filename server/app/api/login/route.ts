import { getIssueResponse, validateRequest } from "@/lib/api/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const POST_LOGIN_SCHEMA = z.object({
  password: z.string(),
});

export type POST_LOGIN_TYPE = z.infer<typeof POST_LOGIN_SCHEMA>;

export async function POST(req: NextRequest) {
  const { body, error } = await validateRequest(
    req,
    ["public"],
    POST_LOGIN_SCHEMA
  );

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 400,
    });
  }

  const { password } = body as POST_LOGIN_TYPE;
  const { USER_SECRET } = process.env;

  if (password === USER_SECRET) {
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    response.cookies.set("password", password, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    return response;
  }

  return getIssueResponse("Invalid password", [], 401);
}
