import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { generateBookFunction, generateBookFailureFunction } from "@/inngest/functions/generate-book";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [generateBookFunction, generateBookFailureFunction],
});
