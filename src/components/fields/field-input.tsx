import type {InputHTMLAttributes} from "react";
import {Field, FieldTitle} from "@/components/ui/field.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Info} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    tooltip?: string;
}

export const FieldInput = ({label, tooltip, ...props}: Props) => {
    return (
        <Field>
            <FieldTitle className={"flex justify-between"}>
                {label}
                {tooltip &&
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info size={14}/>
                        </TooltipTrigger>
                        <TooltipContent side={"right"} align={"start"} className="text-wrap max-w-1/2">
                            <p>{tooltip}</p>
                        </TooltipContent>
                    </Tooltip>
                }
            </FieldTitle>
            <Input id={label} type="text" {...props}/>
        </Field>
    );
};