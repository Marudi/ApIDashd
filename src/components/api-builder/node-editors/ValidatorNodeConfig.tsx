
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiNodeData } from "@/lib/api-builder-types";

const validatorNodeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  validationType: z.enum(["json-schema", "regex", "custom"]),
  schema: z.string().optional(),
  pattern: z.string().optional(),
});

interface ValidatorNodeConfigProps {
  data: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
  onCancel: () => void;
}

export function ValidatorNodeConfig({ data, onSave, onCancel }: ValidatorNodeConfigProps) {
  const form = useForm({
    resolver: zodResolver(validatorNodeSchema),
    defaultValues: {
      label: data.label || "Validator",
      validationType: data.validationType || "json-schema",
      schema: data.schema || "",
      pattern: data.pattern || "",
    },
  });

  const watchValidationType = form.watch("validationType");

  const onSubmit = (values: z.infer<typeof validatorNodeSchema>) => {
    onSave({
      ...data,
      ...values,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="validationType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Validation Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select validation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json-schema">JSON Schema</SelectItem>
                  <SelectItem value="regex">Regular Expression</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {watchValidationType === "json-schema" && (
          <FormField
            control={form.control}
            name="schema"
            render={({ field }) => (
              <FormItem>
                <FormLabel>JSON Schema</FormLabel>
                <FormControl>
                  <Textarea 
                    {...field} 
                    className="font-mono h-32"
                    placeholder='{
  "type": "object",
  "properties": {
    "name": { "type": "string" }
  }
}'
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        {watchValidationType === "regex" && (
          <FormField
            control={form.control}
            name="pattern"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Regular Expression Pattern</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="^[a-zA-Z0-9]+$" />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel} type="button">
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
