import { ShieldAlert } from 'lucide-react';
export function RestrictedAccess({ title, message }) {
    return (<div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-warning/10 text-warning">
        <ShieldAlert className="h-6 w-6"/>
      </div>
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{message}</p>
    </div>);
}
