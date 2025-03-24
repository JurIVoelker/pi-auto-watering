import { z, ZodIssue } from "zod";

export const validateSchema = async (
  schema: z.ZodSchema,
  value: object
): Promise<{ success: boolean; error?: ZodIssue[] }> => {
  const result = await schema.safeParseAsync(value);

  if (!result.success) {
    return {
      success: false,
      error: result.error.errors,
    };
  }
  return { success: true };
};

export const getZodIssues = (error: string[]): ZodIssue[] => {
  return error.map((err) => ({ message: err, code: "custom", path: [] }));
};

export const getZodIssue = (error: string, path?: string[]): ZodIssue => {
  return { message: error, code: "custom", path: path || [] };
};

export const UNKNOWN_ERROR_ISSUE = getZodIssue("Unknown error");
