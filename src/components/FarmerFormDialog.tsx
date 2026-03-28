import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Language, LiteracyLevel } from "@/types/api";
import type { FarmerRequest, FarmerResponse } from "@/types/api";
import { useCreateFarmer, useUpdateFarmer } from "@/hooks/useApi";
import { Loader2 } from "lucide-react";

interface Props {
  trigger: React.ReactNode;
  farmer?: FarmerResponse;
}

export function FarmerFormDialog({ trigger, farmer }: Props) {
  const [open, setOpen] = useState(false);
  const createMut = useCreateFarmer();
  const updateMut = useUpdateFarmer();
  const isEdit = !!farmer;

  const [form, setForm] = useState<FarmerRequest>({
    name: farmer?.name || "",
    language: farmer?.language || Language.ENGLISH,
    literacyLevel: farmer?.literacyLevel,
    contactNumber: farmer?.contactNumber || "",
    location: farmer?.location || "",
  });

  const isPending = createMut.isPending || updateMut.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && farmer) {
      await updateMut.mutateAsync({ id: farmer.farmerId, data: form });
    } else {
      await createMut.mutateAsync(form);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">{isEdit ? "Edit Farmer" : "Add Farmer"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="font-body text-sm">Name *</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={255} className="font-body" />
          </div>
          <div>
            <Label className="font-body text-sm">Language *</Label>
            <Select value={form.language} onValueChange={(v) => setForm({ ...form, language: v as Language })}>
              <SelectTrigger className="font-body"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.values(Language).map((l) => <SelectItem key={l} value={l} className="font-body">{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-body text-sm">Literacy Level</Label>
            <Select value={form.literacyLevel || ""} onValueChange={(v) => setForm({ ...form, literacyLevel: v as LiteracyLevel || undefined })}>
              <SelectTrigger className="font-body"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {Object.values(LiteracyLevel).map((l) => <SelectItem key={l} value={l} className="font-body">{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="font-body text-sm">Contact Number</Label>
            <Input value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} maxLength={30} className="font-body" placeholder="+27..." />
          </div>
          <div>
            <Label className="font-body text-sm">Location *</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required maxLength={255} className="font-body" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="font-body">Cancel</Button>
            <Button type="submit" disabled={isPending} className="font-body">
              {isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
              {isEdit ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
