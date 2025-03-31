import { NextRequest } from "next/server";
import { ZodIssue, ZodObject } from "zod";
import {
  getZodIssue,
  UNKNOWN_ERROR_ISSUE,
  validateSchema,
} from "./schemaUtils";

type Permission = "user" | "server" | "public";

export const hasServersidePermission = async (
  permissions: Permission[],
  request: NextRequest
) => {
  for (const permission of permissions) {
    if (permission === "user") {
      const { headers, cookies } = request;
      const authHeader = headers.get("api-key");
      const password = cookies.get("password");

      const { USER_SECRET } = process.env;
      if (!USER_SECRET) console.error("USER_SECRET not set");
      if (authHeader === USER_SECRET || password?.value === USER_SECRET) {
        return true;
      }
    }

    if (permission === "server") {
      const { headers } = request;
      const authHeader = headers.get("api-key");
      const { SERVER_SECRET } = process.env;
      if (!SERVER_SECRET) console.error("SERVER_SECRET not set");
      if (authHeader === SERVER_SECRET) {
        return true;
      }
    }

    if (permission === "public") {
      return true;
    }
  }
  return false;
};

export const getBodyFromRequest = async (
  request: NextRequest
): Promise<{
  body?: unknown;
  error?: ZodIssue[];
}> => {
  let body;
  try {
    body = await request.json();
  } catch {
    return {
      error: [getZodIssue("Invalid JSON")],
    };
  }
  return { body };
};

export const validateRequest = async (
  request: NextRequest,
  permissions: Permission[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: ZodObject<any>
): Promise<{ body?: unknown; error?: ZodIssue[] | null }> => {
  const { body, error: bodyError } = await getBodyFromRequest(request);

  if (!body) {
    return { body: {}, error: bodyError || [UNKNOWN_ERROR_ISSUE] };
  }

  const hasPermission = await hasServersidePermission(permissions, request);

  if (!hasPermission)
    return {
      body: {},
      error: [getZodIssue("Unauthorized")],
    };

  const { success: isSchemaSuccess, error: schemaError } = await validateSchema(
    schema,
    body || {}
  );

  if (!isSchemaSuccess) {
    return { body: {}, error: schemaError || [UNKNOWN_ERROR_ISSUE] };
  }

  return { body, error: null };
};

export const UNAUTHORIZED_RESPONSE = new Response(
  JSON.stringify({ error: getZodIssue("Unauthorized", ["header"]) }),
  {
    status: 401,
  }
);

export const getIssueResponse = (
  error: string,
  path?: string[],
  status?: number
) => {
  return new Response(JSON.stringify({ error: [getZodIssue(error, path)] }), {
    status: status || 400,
  });
};
