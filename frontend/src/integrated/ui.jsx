import { cloneElement, isValidElement } from "react";
import { PackageOpen } from "lucide-react";
import { label } from "./hooks";
export function Notice({ action }) {
  return (
    <>
      {action.error && (
        <p role="alert" className="mm-error">
          {action.error}
        </p>
      )}
      {action.success && (
        <p role="status" className="mm-success">
          {action.success}
        </p>
      )}
    </>
  );
}
export function Field({ title, children, ...props }) {
  return (
    <label className="mm-field">
      <span>{title}</span>
      {children ? (
        isValidElement(children) ? (
          cloneElement(children, { "aria-label": title })
        ) : (
          children
        )
      ) : (
        <input aria-label={title} {...props} />
      )}
    </label>
  );
}
export function Card({ title, children }) {
  return (
    <section className="mm-card" data-card={title || undefined}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}
export function State({ resource, children }) {
  if (resource.loading && !resource.data) return <p role="status">Loading…</p>;
  if (resource.error)
    return (
      <div className="mm-error" role="alert">
        {resource.error} <button onClick={resource.load}>Retry</button>
      </div>
    );
  return children;
}
export function Badge({ value }) {
  return <span className={`mm-badge mm-status-${String(value || "unknown").replace(/[^a-z_]/gi, "")}`}>{label(value)}</span>;
}
export function Empty({ children }) {
  return <div className="mm-empty"><PackageOpen size={34} aria-hidden="true" /><p>{children}</p></div>;
}
