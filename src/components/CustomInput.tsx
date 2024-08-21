import React, { Dispatch, InputHTMLAttributes, SetStateAction } from "react";
import { FormControl, FormField, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Control, FieldPath, FieldValue, Form } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
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
  showPassword?:boolean,
  setShowPassword?: Dispatch<SetStateAction<boolean>>
};
function CustomInput({
  control,
  label,
  name,
  placeholder,
  type = "text",
  inputmode = "text",
  className = "",
  showPassword = false,
  setShowPassword 
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
          <div className="relative flex w-full flex-col">
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
            {showPassword && setShowPassword && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={()=>setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <Eye className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                )}
              </button>
            )}
          </div>
          <FormMessage className="mt-2  text-xs text-red-500" />
        </div>
      )}
    />
  );
}

export default CustomInput;
