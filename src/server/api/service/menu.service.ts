import { PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { putObjectPresignedUrl } from "../../s3";

export const menuType = ["APPETIZER", "MAIN", "DESSERT", "DRINK"] as const;

export const createMenuSchema = z.object({
  menu_name_en: z.string(),
  menu_name_th: z.string(),
  menu_type: z.enum(menuType),
  price: z.number().nonnegative(),
  hasImage: z.boolean(),
  priority: z.number().nullable(),
});
export type CreateMenuInput = z.TypeOf<typeof createMenuSchema>;

export async function addMenu(
  prisma: PrismaClient,
  input: CreateMenuInput,
  corporation_id: string
) {
  const { menu_name_en, menu_name_th, menu_type, price, priority, hasImage } =
    input;
  try {
    const menu = await prisma.menu.create({
      data: {
        menu_name_en,
        menu_name_th,
        menu_type,
        price,
        priority,
        corporation: {
          connect: {
            id: corporation_id,
          },
        },
        hasImage,
      },
    });
    return menu;
  } catch (error) {
    console.log(error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Error adding menu",
    });
  }
}

export async function uploadMenuImage(corporation_id: string, menu_id: number) {
  return await putObjectPresignedUrl(corporation_id, menu_id);
}
