
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ApiNodeData } from "@/lib/api-builder-types";

const transformNodeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  transformType: z.string().min(1, "Transform type is required"),
  transformScript: z.string(),
});

interface TransformNodeConfigProps {
  data: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
  onCancel: () => void;
}

export function TransformNodeConfig({ data, onSave, onCancel }: TransformNodeConfigProps) {
  const form = useForm({
    resolver: zodResolver(transformNodeSchema),
    defaultValues: {
      label: data.label || "",
      transformType: data.transformType || "json",
      transformScript: data.transformScript || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
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
          name="transformType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transform Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transformScript"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transform Script</FormLabel>
              <FormControl>
                <Textarea {...field} className="h-32 font-mono" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
