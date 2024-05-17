import { FieldError, UseFormRegister } from "react-hook-form";
import { z } from "zod";

export type FormData = {
    email: string;
    password: string;
  };

  export const UserSchema = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(20, { message: "Password is too long" }),
  })

export type TUserSchema = z.infer<typeof UserSchema>;


  export type FormFieldProps = {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<FormData>;
    error: FieldError | undefined;
    valueAsNumber?: boolean;
  };

  export type ValidFieldNames =
  | "email"
  | "password";