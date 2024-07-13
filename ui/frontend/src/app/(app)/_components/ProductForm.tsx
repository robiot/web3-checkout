import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import React, { FC, ReactNode } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { ImageDrop } from "./ImageDrop";

// Define Zod schema
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be a positive number"),
  mediaHashes: z.array(z.object({ value: z.string() })),
  requireRealHuman: z.boolean(),
  purchaseLimitPerHuman: z
    .number()
    .int()
    .min(1, "Purchase limit must be at least 1"),
});

// Define form data type based on the schema
type FormData = z.infer<typeof formSchema>;

const Label: FC<{ children: ReactNode }> = ({ children }) => {
  return <p className="text-foreground/80 mb-2 mt-8 text-sm">{children}</p>;
};

const Ero: FC<{ children: ReactNode }> = ({ children }) => {
  return <p className="text-red-600 my-2 text-sm">{children}</p>;
};

type MyValues = {
  mediaHashes: { value: number }[];
};

export const ProductForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  const imagesFieldArray = useFieldArray({
    control,
    name: "mediaHashes" as never,
    keyName: "value",
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label>ID</Label>
        <Input {...register("id")} disabled />
      </div>

      <div>
        <Label>Name</Label>
        <Input {...register("name")} />
        {errors.name && <Ero>{errors.name.message}</Ero>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register("description")} />
        {errors.description && <Ero>{errors.description.message}</Ero>}
      </div>

      <div>
        <Label>Price in $USDC</Label>
        <Input type="number" {...register("price", { valueAsNumber: true })} />
        {errors.price && <Ero>{errors.price.message}</Ero>}
      </div>

      <div>
        <Label>Media</Label>

        <ImageDrop />

        {imagesFieldArray.fields.length > 0 && (
          <>
            <p className="mt-6 text-sm mb-2 text-foreground/60">Uploads:</p>
            <div className="flex flex-col gap-2">
              {imagesFieldArray.fields.map((field, index) => (
                <div
                  key={`agreement_field_${index}`}
                  className="flex gap-2 h-fit"
                >
                  <Input
                    {...register(`agreements.${index}.value` as any, {
                      required: true,
                    })}
                    placeholder="Agreement"
                    disabled
                  />
                  <Button
                    className="w-fit h-12 flex-1"
                    tabIndex={-1}
                    onClick={() => {
                      imagesFieldArray.remove(index);
                    }}
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {errors.mediaHashes && <Ero>{errors.mediaHashes.message}</Ero>}
      </div>

      <div>
        <Label>Worldcoin</Label>
        <div className="flex gap-4 items-center mt-4">
          <Controller
            render={({ field }) => (
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
            control={control}
            name="requireRealHuman"
          />

          <div className="text-foreground/80">
            Requires real human verification
          </div>
        </div>

        {errors.requireRealHuman && (
          <Ero>{errors.requireRealHuman.message}</Ero>
        )}
      </div>

      <div>
        <Label>Purchase Limit Per Human (0 for none)</Label>
        <Input
          type="number"
          {...register("purchaseLimitPerHuman", { valueAsNumber: true })}
        />
        {errors.purchaseLimitPerHuman && (
          <Ero>{errors.purchaseLimitPerHuman.message}</Ero>
        )}
      </div>

      <div className="my-8 flex gap-4">
        <Button variant="secondary">Cancel</Button>
        <Button className="flex-1">Save changes</Button>
      </div>
    </form>
  );
};
