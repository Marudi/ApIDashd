
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiNodeData } from "@/lib/api-builder-types";

const inputNodeSchema = z.object({
  label: z.string().min(1, "Label is required"),
  method: z.string().min(1, "Method is required"),
  path: z.string().min(1, "Path is required"),
  headers: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
});

interface InputNodeConfigProps {
  data: ApiNodeData;
  onSave: (data: ApiNodeData) => void;
  onCancel: () => void;
}

export function InputNodeConfig({ data, onSave, onCancel }: InputNodeConfigProps) {
  const form = useForm({
    resolver: zodResolver(inputNodeSchema),
    defaultValues: {
      label: data.label || "",
      method: data.method || "GET",
      path: data.path || "/api/v1",
      headers: data.headers || [],
    },
  });

  const headers = form.watch("headers") || [];

  const addHeader = () => {
    form.setValue("headers", [...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    form.setValue("headers", newHeaders);
  };

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
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HTTP Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="PATCH">PATCH</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Path</FormLabel>
              <FormControl>
                <Input {...field} placeholder="/api/v1/resource" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <FormLabel>Headers</FormLabel>
            <Button type="button" variant="outline" size="sm" onClick={addHeader}>
              Add Header
            </Button>
          </div>
          
          {headers.map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormField
                control={form.control}
                name={`headers.${index}.key`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Header name" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`headers.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Header value" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removeHeader(index)}
              >
                ×
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  );
}
