import { NextRequest } from "next/server";
import { ZodIssue, ZodObject } from "zod";
import {
  getZodIssue,
  UNKNOWN_ERROR_ISSUE,
  validateSchema,
} from "./schemaUtils";

type Permission = "user" | "server";

export const hasServersidePermission = async (
  permissions: Permission[],
  request: NextRequest
) => {
  for (const permission of permissions) {
    if (permission === "user") {
      const { headers } = request;
      const authHeader = headers.get("authorization");
      console.log(authHeader);
      // TODO check auth
      return true;
    }
    if (permission === "server") {
      // TODO check server auth
      return false;
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
): Promise<{ body?: unknown; error: ZodIssue[] | null }> => {
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
