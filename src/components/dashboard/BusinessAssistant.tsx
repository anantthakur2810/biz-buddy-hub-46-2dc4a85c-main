import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { assistantRecommendations } from '@/lib/businessInsights';

export function BusinessAssistant() {
  const [activeId, setActiveId] = useState(assistantRecommendations[0]?.id ?? '');
  const activeRecommendation = assistantRecommendations.find((item) => item.id === activeId) ?? assistantRecommendations[0];

  return (
    <div className="stat-card animate-fade-in">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-primary/10 p-2 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Business Assistant</h3>
          <p className="text-sm text-muted-foreground">Ask the dashboard practical questions and get recommendation-style answers.</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {assistantRecommendations.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveId(item.id)}
            className={`rounded-full border px-3 py-2 text-sm transition-colors ${
              activeId === item.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-muted/40 text-foreground hover:border-primary/40'
            }`}
          >
            {item.question}
          </button>
        ))}
      </div>

      {activeRecommendation && (
        <div className="rounded-xl border border-border bg-muted/40 p-4">
          <p className="text-sm font-medium text-foreground">{activeRecommendation.question}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeRecommendation.answer}</p>
        </div>
      )}
    </div>
  );
}
