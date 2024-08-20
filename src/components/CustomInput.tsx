import React, { InputHTMLAttributes } from "react";
import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Control, FieldPath, FieldValue, Form } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
type CustomInputTypes = {
  control: FieldValue<any>;
  label: string;
  name: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute | undefined;
  inputmode?:
    | "text"
    | "search"
    | "email"
    | "tel"
    | "url"
    | "none"
    | "numeric"
    | "decimal"
    | undefined;
  className?: string;
};
function CustomInput({
  control,
  label,
  name,
  placeholder,
  type = "text",
  inputmode = "text",
  className = "",
}: CustomInputTypes) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="space-y-1 text-start">
          <FormLabel className="text-14 w-full max-w-[280px] font-medium">
            {label}
          </FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className={cn(
                  "text-16 placeholder:text-16 rounded-lg border placeholder:text-gray-500",
                  className,
                )}
                {...field}
                type={type}
                inputMode={inputmode}
              />
            </FormControl>
            <FormMessage className="mt-2 text-xs text-red-500" />
          </div>
        </div>
      )}
    />
  );
}

export default CustomInput;
