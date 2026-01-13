import {useState, type InputHTMLAttributes, type ChangeEvent} from "react";
import {Field, FieldTitle} from "@/components/ui/field.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Info} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    tooltip?: string;
}

export const FieldColorPicker = ({label, tooltip, value: controlledValue, defaultValue, onChange, ...props}: Props) => {
    const [internalValue, setInternalValue] = useState(defaultValue || "#000000");

    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!isControlled) {
            setInternalValue(e.target.value);
        }
        onChange?.(e);
    };

    return (
        <Field>
            <FieldTitle className={"flex justify-between"}>
                <div>
                    {label}
                </div>
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
            <div className="flex items-center gap-2 mt-2">
                <div className="h-9 w-1/3 rounded-md border border-input overflow-hidden relative">
                    <input
                        type="color"
                        className="absolute -top-2 -left-2 w-[120%] h-[150%] p-0 border-0 cursor-pointer"
                        value={value as string}
                        onChange={handleChange}
                        {...props}
                    />
                </div>
                <Input
                    id="color-picker"
                    type="text"
                    placeholder="#FFFFFF"
                    value={value as string}
                    onChange={handleChange}
                />
            </div>
        </Field>
    )
}
