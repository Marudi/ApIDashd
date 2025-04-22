import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiNodeData } from "@/lib/api-builder-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const cacheConfigSchema = z.object({
  label: z.string().min(1, "Label is required"),
  ttl: z.coerce.number().min(0, "TTL must be a positive number"),
  keyTemplate: z.string().min(1, "Cache key template is required")
});

type CacheConfigFormData = z.infer<typeof cacheConfigSchema>;

interface CacheNodeConfigProps {
  data: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
  onCancel: () => void;
}

export function CacheNodeConfig({ data, onSave, onCancel }: CacheNodeConfigProps) {
  const form = useForm<CacheConfigFormData>({
    resolver: zodResolver(cacheConfigSchema),
    defaultValues: {
      label: data.label || "Cache",
      ttl: data.ttl?.toString() || "300",
      keyTemplate: data.keyTemplate || "{{method}}-{{path}}"
    }
  });

  const onSubmit = (values: CacheConfigFormData) => {
    onSave({
      ...data,
      label: values.label,
      ttl: values.ttl,
      keyTemplate: values.keyTemplate
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
                <Input {...field} placeholder="Cache Node" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ttl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time To Live (seconds)</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  min="0"
                  placeholder="300"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keyTemplate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cache Key Template</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  placeholder="{{method}}-{{path}}"
                />
              </FormControl>
            </FormItem>
          )}
        />

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
