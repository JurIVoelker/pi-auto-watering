import { z, ZodIssue } from "zod";

type RequestOptions = { query?: object; headers?: object } | undefined;
type Method = "GET" | "POST" | "PUT" | "DELETE";

const makeRequest = async (
  method: Method,
  path: string,
  body?: object,
  options: RequestOptions = {}
): Promise<{ data?: unknown; error?: ZodIssue[] }> => {
  const { headers } = options || {};

  const response = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: JSON.stringify(body),
  });

  console.info(`[${method}] -> ${path}`);

  let json;
  try {
    json = await response.text();
    json = JSON.parse(json);
  } catch {
    json = null;
  }

  if (!response.ok) {
    console.info(`[ERROR-${response.status}] <- ${path}`);
    const zodIssueSchema = z.array(
      z.object({
        message: z.string(),
        path: z.array(z.string()).optional(),
        code: z.string(),
      })
    );

    const parseResult = zodIssueSchema.safeParse(json?.error);
    if (parseResult.success) {
      // @ts-expect-error - This is a valid ZodIssue array
      return { error: parseResult.data };
    } else {
      console.error("Error not of type ZodIssue");
      return {
        // @ts-expect-error - This is a valid ZodIssue array
        error: [{ message: `Unknown error: ${JSON.stringify(json?.error)}` }],
      };
    }
  }
  console.info(`[${method}] <- ${path}`);

  return { data: json };
};

export const getRequest = async (path: string, options?: RequestOptions) => {
  return await makeRequest("GET", path, undefined, options);
};

export const postRequest = async (
  path: string,
  body: object,
  options?: RequestOptions
) => {
  return await makeRequest("POST", path, body, options);
};

export const putRequest = async (
  path: string,
  body: object,
  options?: RequestOptions
) => {
  return await makeRequest("PUT", path, body, options);
};

export const deleteRequest = async (
  path: string,
  body: object,
  options?: RequestOptions
) => {
  return await makeRequest("DELETE", path, body, options);
};
