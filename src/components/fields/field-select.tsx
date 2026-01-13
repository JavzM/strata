import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Field, FieldDescription, FieldTitle} from "@/components/ui/field.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Info} from "lucide-react";

export type Option = {
    value: string;
    label: string;
}

export type OptionGroup = {
    label: string;
    options: Option[];
}

interface Props {
    label: string;
    description?: string;
    tooltip?: string;
    options: Option[] | OptionGroup[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
}

function isOptionGroupArray(options: Option[] | OptionGroup[]): options is OptionGroup[] {
    return options.length > 0 && 'options' in options[0];
}

export function FieldSelect({
                                label,
                                description,
                                tooltip,
                                options,
                                value,
                                defaultValue,
                                onValueChange,
                                placeholder
                            }: Props) {
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
            {description &&
                <FieldDescription>
                    {description}
                </FieldDescription>
            }
            <div className="mt-2">
                <Select value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={placeholder}/>
                    </SelectTrigger>
                    <SelectContent>
                        {isOptionGroupArray(options) ? (
                            options.map((group) => (
                                <SelectGroup key={group.label}>
                                    <SelectLabel>{group.label}</SelectLabel>
                                    {group.options.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            ))
                        ) : (
                            (options as Option[]).map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </div>
        </Field>
    )
}
