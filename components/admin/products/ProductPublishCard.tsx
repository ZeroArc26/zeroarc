import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductPublishCard() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur">
      <h2 className="text-xl font-bold text-white">
        Publish
      </h2>

      <p className="mt-1 text-sm text-zinc-400">
        Control the visibility and publishing status of this product.
      </p>

      <div className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label>Status</Label>

          <Select defaultValue="draft">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Visibility</Label>

          <Select defaultValue="public">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="mt-4 w-full">
          Save Product
        </Button>
      </div>
    </div>
  );
}