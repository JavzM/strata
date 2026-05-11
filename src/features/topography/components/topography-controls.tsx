import {FieldSlider} from "@/components/fields/field-slider.tsx";
import {FieldColorPicker} from "@/components/fields/field-color-picker.tsx";
import {FieldSelect} from "@/components/fields/field-select.tsx";
import {SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu} from "@/components/ui/sidebar.tsx";
import {FieldSeparator} from "@/components/ui/field.tsx";
import {RESOLUTIONS} from "@/features/topography/types/resolution.ts";
import type {Configuration} from "@/features/topography/types/configuration.ts";
import {Button} from "@/components/ui/button.tsx";
import {Dices} from "lucide-react";
import {Spinner} from "@/components/ui/spinner.tsx";
import {FieldInput} from "@/components/fields/field-input.tsx";
import {useState} from "react";

interface Props {
    config: Configuration;
    onConfigChange: (newConfig: Configuration) => void;
    onRandomize: () => void;
    onDownload: () => void;
    isGenerating: boolean;
}

const TopographyControls = (
    {
        config,
        onConfigChange,
        onRandomize,
        onDownload,
        isGenerating
    }: Props) => {
    const updateConfig = (key: keyof Configuration, value: any) => {
        onConfigChange({...config, [key]: value});
    };

    const [seedDraft, setSeedDraft] = useState(String(config.seed));
    const [prevSeed, setPrevSeed] = useState(config.seed);

    if (config.seed !== prevSeed) {
        setPrevSeed(config.seed);
        setSeedDraft(String(config.seed));
    }

    const commitSeed = () => {
        const parsed = parseInt(seedDraft, 10);
        if (!isNaN(parsed)) {
            updateConfig('seed', parsed);
        } else {
            setSeedDraft(String(config.seed));
        }
    };

    return (
        <SidebarGroup>
            <SidebarGroupLabel className={"p-0 my-4"}>Customization controls</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="gap-4">
                    <Button
                        disabled={isGenerating}
                        onClick={onRandomize}
                    >
                        {isGenerating ? <Spinner/> :
                            <>
                                <Dices/> Randomize
                            </>
                        }
                    </Button>
                    <Button variant={"secondary"} onClick={onDownload}>Download</Button>
                    <FieldSeparator/>
                    <FieldSelect
                        defaultValue={`${config.resolution.width}x${config.resolution.height}`}
                        value={`${config.resolution.width}x${config.resolution.height}`}
                        onValueChange={(value) => {
                            const res = RESOLUTIONS.flatMap(g => g.options).find(r => `${r.width}x${r.height}` === value);
                            if (res) updateConfig('resolution', res);
                        }}
                        label="Resolution"
                        placeholder="Select resolution"
                        options={RESOLUTIONS.map((group) => ({
                            label: group.label,
                            options: group.options.map((res) => ({
                                value: `${res.width}x${res.height}`,
                                label: res.label,
                            }))
                        }))}
                    />
                    <FieldSeparator/>
                    <FieldColorPicker
                        value={config.bgColor}
                        onChange={(e) => updateConfig('bgColor', e.target.value)}
                        label={"Background Color"}
                        defaultValue={"#ffffff"}
                    />
                    <FieldColorPicker
                        value={config.strokeColor}
                        onChange={(e) => updateConfig('strokeColor', e.target.value)}
                        label={"Line Color"}
                        defaultValue={"#000000"}
                    />
                    <FieldSeparator/>
                    <div className={"flex flex-col gap-8"}>

                        <FieldSlider
                            label={"Scale"}
                            tooltip={"Controls the zoom level of the noise field. Higher values look more 'zoomed in'"}
                            min={"0.001"}
                            max={"0.01"}
                            step={"0.0005"}
                            value={config.scale}
                            valueDisplay={config.scale.toFixed(4)}
                            onChange={(e) => updateConfig('scale', Number(e.target.value))}
                        />
                        <FieldSlider
                            label={"Step"}
                            tooltip={"Sets the vertical distance between contour lines. Lower values create a denser, more detailed map."}
                            min={"0.05"}
                            max={"0.5"}
                            step={"0.01"}
                            value={config.step}
                            valueDisplay={config.step.toFixed(2)}
                            onChange={(e) => updateConfig('step', Number(e.target.value))}
                        />
                        <FieldSlider
                            label={"Roughness"}
                            tooltip={"Determines the terrain's ruggedness. Higher values create more chaotic and jagged mountain ranges."}
                            min={"0.1"}
                            max={"0.9"}
                            step={"0.05"}
                            valueDisplay={config.roughness.toFixed(2)}
                            value={config.roughness}
                            onChange={(e) => updateConfig('roughness', Number(e.target.value))}
                        />
                        <FieldSlider
                            label={"Detail"}
                            tooltip={"Controls the number of noise layers. More octaves add finer details, creating more complex terrain."}
                            min={"1"}
                            max={"8"}
                            step={"1"}
                            valueDisplay={config.octaves}
                            value={config.octaves}
                            onChange={(e) => updateConfig('octaves', Number(e.target.value))}
                        />
                        <FieldSlider
                            label={"Line Width"}
                            tooltip={"Adjusts the thickness of the contour lines."}
                            min={"0.5"}
                            max={"5"}
                            step={"0.5"}
                            valueDisplay={`${config.lineWidth}px`}
                            value={config.lineWidth}
                            onChange={(e) => updateConfig('lineWidth', Number(e.target.value))}
                        />
                    </div>
                    <FieldSeparator/>
                    <FieldInput
                        label={"Seed"}
                        tooltip={"Deterministic seed for terrain generation. The same seed always produces the same result."}
                        value={seedDraft}
                        onChange={(e) => setSeedDraft(e.target.value)}
                        onBlur={commitSeed}
                        onKeyDown={(e) => e.key === 'Enter' && commitSeed()}
                        placeholder={"e.g. 372847561"}
                    />

                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}

export default TopographyControls
