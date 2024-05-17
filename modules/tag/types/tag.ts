import { z } from "zod";

export type FormData = {
  name: string;
};

export const TagSchema = z
  .object({
    name: z.string()
      .min(1, { message: "You must enter a name" })
  })

export type TTagSchema = z.infer<typeof TagSchema>;

export type ValidFieldNames =
  | "name";