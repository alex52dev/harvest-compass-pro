import { motion } from "framer-motion";
import { MessageSquare, Plus, Star } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { mockFeedback, mockFarms, mockCrops } from "@/lib/mockData";
import { Button } from "@/components/ui/button";

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.35 } }),
};

const getFarmName = (farmId: number) => mockFarms.find((f) => f.farmId === farmId)?.location.split(",")[0] || `Farm ${farmId}`;
const getCropName = (cropId: number) => mockCrops.find((c) => c.cropId === cropId)?.name || `Crop ${cropId}`;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`h-4 w-4 ${star <= rating ? "fill-accent text-accent" : "text-muted"}`} />
      ))}
    </div>
  );
}

export default function FeedbackPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <PageHeader title="Farmer Feedback" description="Season reviews and performance ratings">
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Submit Feedback</Button>
      </PageHeader>

      <div className="space-y-4">
        {mockFeedback.map((fb, i) => (
          <motion.div key={fb.feedbackId} custom={i} initial="hidden" animate="visible" variants={fadeIn} className="bg-card rounded-lg shadow-card border border-border p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-heading font-semibold text-card-foreground">{getFarmName(fb.farmId)} — {getCropName(fb.cropId)}</h3>
                <p className="text-xs text-muted-foreground font-body mt-0.5">Submitted: {new Date(fb.submittedAt).toLocaleDateString()}</p>
              </div>
              <StarRating rating={fb.cropPerformanceRating} />
            </div>
            <div className="flex items-center gap-6 mb-3">
              {fb.actualYieldTons != null && (
                <div>
                  <p className="text-xs text-muted-foreground font-body">Actual Yield</p>
                  <p className="font-body font-semibold text-card-foreground">{fb.actualYieldTons.toLocaleString()} tons</p>
                </div>
              )}
            </div>
            {fb.notes && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted">
                <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm font-body text-card-foreground italic">{fb.notes}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
