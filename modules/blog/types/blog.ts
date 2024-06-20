import { z } from "zod";

export type FormData = {
  title: string;
  date: Date;
  image: string,
  image_alt: string;
  summary: string;
};

export const BlogSchema = z
  .object({
    title: z.string({ required_error: "Title is required" })
      .min(1, { message: "You must enter a title" })
      .max(50, { message: "Title is too long" }),
    date: z.string().pipe(z.coerce.date()),
    image: z.string()
      // .url("Image must be link url")
      .refine(value => value && (['i.pinimg.com', 'pbs.twimg.com', 'res.cloudinary.com'].includes(new URL(value).hostname) || value.startsWith('blob:')), {
        message: "Image URL must be from hostnames i.pinimg.com or pbs.twimg.com or res.cloudinary.com or upload file", // replace with your domain
      })
      .refine(value => value && (value.startsWith('blob:') || /\.(jpe?g|png|gif|webp)$/i.test(value)), {
        message: "Image URL must end with .jpg, .jpeg, .png, .gif, or webp",
      }).optional()
    ,
    image_alt: z.string().max(50, { message: "Image Alt is too long" }).optional(),
    summary: z.string().max(200, { message: "Summaryy is too long" }).optional()
  })

export type TBlogSchema = z.infer<typeof BlogSchema>;

export type ValidFieldNames =
  | "title"
  | "date"
  | "image"
  | "image_alt"
  | "summary";