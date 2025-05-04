import { Card } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";

export const TextareasSection = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Textareas</h2>

      {/* Basic Examples */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-medium">Basic Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Textarea placeholder="Default textarea" label="Default" />
          <Textarea placeholder="With helper text" label="With Helper" helperText="This is a helper text" />
        </div>
      </Card>

      {/* Sizes */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-medium">Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Textarea size="sm" placeholder="Small textarea" label="Small" />
          <Textarea size="md" placeholder="Medium textarea" label="Medium" />
          <Textarea size="lg" placeholder="Large textarea" label="Large" />
        </div>
      </Card>

      {/* States */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-medium">States</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Textarea status="default" placeholder="Default state" label="Default" />
          <Textarea status="error" placeholder="Error state" label="Error" helperText="This field has an error" />
          <Textarea status="success" placeholder="Success state" label="Success" helperText="This field is valid" />
        </div>
      </Card>

      {/* Features */}
      <Card className="p-6 space-y-6">
        <h3 className="text-lg font-medium">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Textarea
            placeholder="With character count and limit"
            label="Character Count"
            maxLength={100}
            showCharCount
            helperText="Maximum 100 characters"
          />
          <Textarea
            placeholder="With clear button"
            label="Clear Button"
            showClearButton
            helperText="Click the X to clear"
          />
          <Textarea
            placeholder="Auto-resize as you type"
            label="Auto Resize"
            autoResize
            helperText="This textarea will grow with content"
          />
          <Textarea placeholder="Disabled state" label="Disabled" disabled helperText="This textarea is disabled" />
        </div>
      </Card>
    </div>
  );
};
