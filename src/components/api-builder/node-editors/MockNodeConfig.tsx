
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ApiNodeData } from "@/lib/api-builder-types";

const mockNodeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  mockResponse: z.object({
    statusCode: z.number().min(100).max(599),
    body: z.string(),
    headers: z.record(z.string()).optional(),
  }),
});

interface MockNodeConfigProps {
  data: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
  onCancel: () => void;
}

export function MockNodeConfig({ data, onSave, onCancel }: MockNodeConfigProps) {
  const form = useForm({
    resolver: zodResolver(mockNodeSchema),
    defaultValues: {
      label: data.label || "Mock",
      mockResponse: {
        statusCode: data.mockResponse?.statusCode || 200,
        body: data.mockResponse?.body || '{"message": "Mock response"}',
        headers: data.mockResponse?.headers || {},
      },
    },
  });

  const onSubmit = (values: z.infer<typeof mockNodeSchema>) => {
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
          name="mockResponse.statusCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Code</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value))}
                  min={100}
                  max={599}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mockResponse.body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Response Body (JSON)</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  className="font-mono h-32"
                  placeholder='{
  "message": "Mock response",
  "data": {
    "id": 1,
    "name": "Example"
  }
}'
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
