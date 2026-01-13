import {type InputHTMLAttributes} from "react";
import {Field, FieldTitle} from "@/components/ui/field.tsx";
import {Slider} from "@/components/ui/slider.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Info} from "lucide-react";

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
    label: string;
    tooltip?: string;
    valueDisplay?: string | number;
    value?: number;
    onChange?: (e: { target: { value: string } }) => void;
}

export const FieldSlider = ({label, tooltip, valueDisplay, value, onChange, ...props}: Props) => {
    
    const handleValueChange = (newValue: number[]) => {
        if (onChange) {
            // Create a synthetic event-like object to match the expected interface
            onChange({ target: { value: String(newValue[0]) } });
        }
    };

    return (
        <Field>
            <FieldTitle className={"flex justify-between"}>
                <div>
                    {label}
                    {valueDisplay !== undefined &&
                        <span className={"text-muted-foreground"}> - {valueDisplay}</span>
                    }
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
            <div className="flex items-center gap-4">
                <Slider
                    value={[value || 0]}
                    onValueChange={handleValueChange}
                    max={Number(props.max)}
                    min={Number(props.min)}
                    step={Number(props.step)}
                    className="w-full"
                    aria-label={props["aria-label"]}
                />
            </div>
        </Field>
    )
}
