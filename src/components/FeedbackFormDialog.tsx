import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FarmerFeedbackRequest } from "@/types/api";
import { useCreateFeedback } from "@/hooks/useApi";
import { mockFarms, mockCrops } from "@/lib/mockData";
import { Star, Loader2 } from "lucide-react";

interface Props {
  trigger: React.ReactNode;
}

export function FeedbackFormDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const createMut = useCreateFeedback();

  const [form, setForm] = useState<FarmerFeedbackRequest>({
    farmId: 0,
    cropId: 0,
    actualYieldTons: undefined,
    cropPerformanceRating: 3,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMut.mutateAsync(form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">Submit Feedback</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-body text-sm">Farm *</Label>
            <Select value={form.farmId ? String(form.farmId) : ""} onValueChange={(v) => setForm({ ...form, farmId: Number(v) })}>
              <SelectTrigger className="font-body"><SelectValue placeholder="Select farm..." /></SelectTrigger>
              <SelectContent>
                {mockFarms.map((f) => <SelectItem key={f.farmId} value={String(f.farmId)} className="font-body">{f.location}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-body text-sm">Crop *</Label>
            <Select value={form.cropId ? String(form.cropId) : ""} onValueChange={(v) => setForm({ ...form, cropId: Number(v) })}>
              <SelectTrigger className="font-body"><SelectValue placeholder="Select crop..." /></SelectTrigger>
              <SelectContent>
                {mockCrops.map((c) => <SelectItem key={c.cropId} value={String(c.cropId)} className="font-body">{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-body text-sm">Actual Yield (tons)</Label>
            <Input type="number" min={0} step={0.1} value={form.actualYieldTons ?? ""} onChange={(e) => setForm({ ...form, actualYieldTons: e.target.value ? Number(e.target.value) : undefined })} className="font-body" />
          </div>
          <div>
            <Label className="font-body text-sm">Performance Rating *</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setForm({ ...form, cropPerformanceRating: s })}>
                  <Star className={`h-6 w-6 transition-colors ${s <= form.cropPerformanceRating ? "fill-accent text-accent" : "text-muted"}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="font-body text-sm">Notes</Label>
            <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="font-body" rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="font-body">Cancel</Button>
            <Button type="submit" disabled={createMut.isPending || !form.farmId || !form.cropId} className="font-body">
              {createMut.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
