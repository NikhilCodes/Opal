import {cn} from "~/utils/styles";
import React from "react";

export function PrimaryButton({
                                children,
                                className = '',
                                ...props
                              }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        `flex items-center justify-center gap-1 bg-[#ffee13] text-black border-solid border-black border-[1.5pt] py-1 px-2 text-base font-medium cursor-pointer shadow-[5px_5px_0_1px_#000000] transition-all duration-150 ease-in-out`,
        `hover:text-[#383838] hover:shadow-[10px_10px_0_1px_#000000]`,
        `active:shadow-[0px_0px_0_1px_#000000] active:translate-1`,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}