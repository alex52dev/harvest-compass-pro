import { motion } from "framer-motion";
import { Settings, Globe, User, Bell, Server, Eye, Accessibility } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Language } from "@/types/api";
import { useUiStore } from "@/stores/uiStore";
import { toast } from "sonner";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
};

export default function SettingsPage() {
  const { language, setLanguage, highContrastEnabled, toggleHighContrast, simpleLanguageMode, toggleSimpleLanguage } = useUiStore();
  const apiBase = import.meta.env.VITE_API_BASE_URL || "/api/v1";

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <PageHeader title="Settings" description="Manage your profile and preferences" />

      {/* Profile Section */}
      <motion.div custom={0} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-primary" />
          <h3 className="font-heading font-semibold text-card-foreground">Profile</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="font-body text-sm">Farm Name</Label>
            <Input defaultValue="Mokoena Farm" className="font-body" />
          </div>
          <div>
            <Label className="font-body text-sm">Location</Label>
            <Input defaultValue="Mbombela, Mpumalanga" className="font-body" />
          </div>
        </div>
      </motion.div>

      {/* Language */}
      <motion.div custom={1} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="h-5 w-5 text-harvest-sky" />
          <h3 className="font-heading font-semibold text-card-foreground">Language</h3>
        </div>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="font-body max-w-xs"><SelectValue /></SelectTrigger>
          <SelectContent>
            {Object.values(Language).map((l) => (
              <SelectItem key={l} value={l} className="font-body">{l.charAt(0) + l.slice(1).toLowerCase()}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground font-body mt-2">Interface language for labels and recommendations</p>
      </motion.div>

      {/* Accessibility */}
      <motion.div custom={2} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Accessibility className="h-5 w-5 text-accent" />
          <h3 className="font-heading font-semibold text-card-foreground">Accessibility</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-card-foreground">High contrast mode</p>
              <p className="text-xs text-muted-foreground font-body">Increase text contrast for better readability</p>
            </div>
            <Switch checked={highContrastEnabled} onCheckedChange={toggleHighContrast} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-card-foreground">Simple language mode</p>
              <p className="text-xs text-muted-foreground font-body">Use icon-first, minimal text interface</p>
            </div>
            <Switch checked={simpleLanguageMode} onCheckedChange={toggleSimpleLanguage} />
          </div>
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div custom={3} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="h-5 w-5 text-harvest-gold" />
          <h3 className="font-heading font-semibold text-card-foreground">Notification Preferences</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-card-foreground">Weather alerts</p>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-card-foreground">Pest & disease warnings</p>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <p className="font-body text-sm text-card-foreground">Market price changes</p>
            <Switch defaultChecked />
          </div>
        </div>
      </motion.div>

      {/* API Status */}
      <motion.div custom={4} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Server className="h-5 w-5 text-harvest-earth" />
          <h3 className="font-heading font-semibold text-card-foreground">API Connection</h3>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-primary/10 text-primary border-0 font-body text-xs">Connected</Badge>
          <span className="text-sm font-body text-muted-foreground">{apiBase}</span>
        </div>
      </motion.div>

      <motion.div custom={5} initial="hidden" animate="visible" variants={fadeIn} className="flex justify-end">
        <Button onClick={() => toast.success("Settings saved")} className="font-body">Save Changes</Button>
      </motion.div>
    </div>
  );
}
