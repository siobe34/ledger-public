import { z } from "zod";

export const accountEnumErrorMap: z.ZodErrorMap = (error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.invalid_enum_value:
      if (error.path[1] === "account") {
        return {
          message: `Account must be set to either "Credit" or "Debit". You inputted: "${error.received}".`,
        };
      }
  }

  return { message: ctx.defaultError };
};
