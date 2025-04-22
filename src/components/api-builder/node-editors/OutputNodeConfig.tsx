
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ApiNodeData } from "@/lib/api-builder-types";

const formSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  statusCode: z.number().min(100).max(599).default(200),
  headers: z.array(z.object({
    key: z.string(),
    value: z.string()
  })).default([]),
});

interface OutputNodeConfigProps {
  data: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
  onCancel: () => void;
}

export function OutputNodeConfig({ data, onSave, onCancel }: OutputNodeConfigProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name || "",
      description: data.description || "",
      statusCode: data.statusCode || 200,
      headers: data.headers || [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onSave({
      ...data,
      ...values,
    });
  };

  const addHeader = () => {
    const currentHeaders = form.getValues("headers");
    form.setValue("headers", [...currentHeaders, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    const currentHeaders = form.getValues("headers");
    form.setValue("headers", currentHeaders.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Output Node" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Configure the API response" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="statusCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status Code</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(Number(e.target.value))} 
                />
              </FormControl>
              <FormDescription>
                HTTP status code for the response (100-599)
              </FormDescription>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <FormLabel>Response Headers</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={addHeader}>
              Add Header
            </Button>
          </div>
          
          {form.watch("headers").map((header, index) => (
            <div key={index} className="flex gap-2 items-start">
              <Input
                placeholder="Header name"
                value={header.key}
                onChange={(e) => {
                  const headers = form.getValues("headers");
                  headers[index].key = e.target.value;
                  form.setValue("headers", headers);
                }}
              />
              <Input
                placeholder="Header value"
                value={header.value}
                onChange={(e) => {
                  const headers = form.getValues("headers");
                  headers[index].value = e.target.value;
                  form.setValue("headers", headers);
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => removeHeader(index)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

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
