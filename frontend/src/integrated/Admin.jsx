import { ClipboardList, Users, AlertTriangle, Truck } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest, downloadFile } from "../services/backendApi";
import Move from "./Move";
import { Badge, Card, Empty, Field, Notice, State } from "./ui";
import { displayId, label, money, objectId, useAction, useLoad } from "./hooks";
export function Overview() {
  const r = useLoad("/admin/overview");
  const moves = useLoad("/admin/moves");
  return (
    <>
      <div className="mm-title"><div><span className="mm-eyebrow">ADMIN OVERVIEW</span><h1>Your operations, at a glance</h1><p className="mm-page-intro">Review requests, manage your people and keep moves on track across cities.</p></div></div>
      <State resource={r}>
        <div className="mm-stats-grid">
          {Object.entries(r.data || {}).map(([k, v]) => (
            <Card key={k} title={k.replace(/([A-Z])/g, " $1")}>
              <span className="mm-stat-icon">{k.toLowerCase().includes("incident") ? <AlertTriangle /> : k.toLowerCase().includes("application") ? <Users /> : k.toLowerCase().includes("vehicle") ? <Truck /> : <ClipboardList />}</span>
              <strong className="mm-number">{v}</strong>
            </Card>
          ))}
        </div>
      </State>
      <Card title="Recent moving requests">
        <State resource={moves}>
          {moves.data?.moves?.length ? <table><thead><tr><th>Move ID</th><th>Customer</th><th>Move date</th><th>Status</th><th>Action</th></tr></thead><tbody>{moves.data.moves.slice(0, 6).map((m) => <tr key={m._id}><td>{displayId(m._id)}</td><td>{m.customer?.name}</td><td>{m.details?.moveDate}</td><td><Badge value={m.status} /></td><td><Link to={`/admin/moves/${m._id}`}>Review move →</Link></td></tr>)}</tbody></table> : <Empty>No moving requests yet.</Empty>}
        </State>
      </Card>
      <Link className="mm-button" to="/admin/moves">
        Review moving requests
      </Link>
    </>
  );
}
export function Requests() {
  const [filter, setFilter] = useState("");
  const r = useLoad(`/admin/moves${filter ? `?status=${filter}` : ""}`);
  return (
    <>
      <h1>Move requests</h1><p className="mm-page-intro">Review customer requirements, assign an available team and share a quote.</p>
      <Field title="Status filter">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          {[
            "draft",
            "submitted",
            "quoted",
            "confirmed",
            "packing",
            "loading",
            "in_transit",
            "unloading",
            "awaiting_confirmation",
            "completed",
            "cancelled",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </Field>
      <State resource={r}>
        <Card>
          <table>
            <thead>
              <tr>
                <th>Move</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {r.data?.moves.map((m) => (
                <tr key={m._id}>
                  <td>{displayId(m._id)}</td>
                  <td>{m.customer?.name}</td>
                  <td>{m.details?.moveDate}</td>
                  <td>
                    <Badge value={m.status} />
                  </td>
                  <td>
                    <Link to={`/admin/moves/${m._id}`}>
                      Review / assign / quote
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {r.data?.moves.length === 0 && <Empty>No matching requests.</Empty>}
        </Card>
      </State>
    </>
  );
}
export function AdminMove() {
  const { id } = useParams(),
    r = useLoad(`/moves/${id}`),
    action = useAction();
  const [start, setStart] = useState(""),
    [end, setEnd] = useState(""),
    [available, setAvailable] = useState(null),
    [coord, setCoord] = useState(""),
    [vehicle, setVehicle] = useState(""),
    [workers, setWorkers] = useState([]),
    [items, setItems] = useState([
      { label: "Transport", amount: 0 },
      { label: "Labour", amount: 0 },
      { label: "Packing materials", amount: 0 },
    ]),
    [notes, setNotes] = useState(""),
    [version, setVersion] = useState(0);
  const m = r.data?.move;
  const editable = m && ["submitted", "quoted"].includes(m.status);
  return (
    <>
      <h1>Assignment & quote · {displayId(id)}</h1>
      <Notice action={action} />
      <State resource={r}>
        {editable && (
          <div className="mm-assignment-grid">
            <Card title="Find available team">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  action.run(async () => {
                    if (new Date(end) <= new Date(start))
                      throw new Error("End must be after start");
                    const p = new URLSearchParams({
                      start: new Date(start).toISOString(),
                      end: new Date(end).toISOString(),
                    });
                    setAvailable(
                      await apiRequest(`/admin/resources/availability?${p}`),
                    );
                    setCoord("");
                    setVehicle("");
                    setWorkers([]);
                  }, "Availability loaded");
                }}
              >
                <div className="mm-grid">
                  <Field
                    title="Start (your local time)"
                    type="datetime-local"
                    required
                    value={start}
                    onChange={(e) => {
                      setStart(e.target.value);
                      setAvailable(null);
                    }}
                  />
                  <Field
                    title="End (your local time)"
                    type="datetime-local"
                    required
                    value={end}
                    onChange={(e) => {
                      setEnd(e.target.value);
                      setAvailable(null);
                    }}
                  />
                </div>
                <button disabled={action.busy}>Check availability</button>
              </form>
              {available && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    action.run(async () => {
                      await apiRequest(`/admin/moves/${id}/assignment`, {
                        method: "PUT",
                        body: {
                          coordinator: coord,
                          vehicle,
                          workers,
                          start: new Date(start).toISOString(),
                          end: new Date(end).toISOString(),
                        },
                      });
                      await r.load();
                      setVersion((x) => x + 1);
                    }, "Team assigned");
                  }}
                >
                  <Field title="Coordinator">
                    <select
                      required
                      value={coord}
                      onChange={(e) => setCoord(e.target.value)}
                    >
                      <option value="">Choose coordinator</option>
                      {available.coordinators.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field title="Vehicle">
                    <select
                      required
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                    >
                      <option value="">Choose vehicle</option>
                      {available.vehicles.map((v) => (
                        <option key={v._id} value={v._id}>
                          {v.label} — {v.capacityKg} kg / {v.capacityM3} m³
                        </option>
                      ))}
                    </select>
                  </Field>
                  <h3>Workers</h3>
                  {available.workers.length === 0 && (
                    <Empty>No available workers in this time window.</Empty>
                  )}
                  {available.workers.map((w) => (
                    <label key={w._id} className="mm-check">
                      <input
                        type="checkbox"
                        checked={workers.includes(w._id)}
                        onChange={(e) =>
                          setWorkers((a) =>
                            e.target.checked
                              ? [...a, w._id]
                              : a.filter((x) => x !== w._id),
                          )
                        }
                      />
                      {w.name} · {w.skills.join(", ")}
                    </label>
                  ))}
                  <p className="mm-warning">
                    Verify service areas, full item dimensions and safe crew
                    size manually. A 1BHK label alone cannot determine vehicle
                    capacity.
                  </p>
                  <button disabled={action.busy || workers.length === 0}>
                    Confirm assignment
                  </button>
                </form>
              )}
            </Card>
            <Card title="Prepare itemized quote">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  action.run(async () => {
                    await apiRequest(`/admin/moves/${id}/quotes`, {
                      method: "POST",
                      body: {
                        items: items.map((x) => ({
                          ...x,
                          amount: Number(x.amount),
                        })),
                        notes,
                      },
                    });
                    await r.load();
                    setVersion((x) => x + 1);
                  }, "Quote sent to customer");
                }}
              >
                {items.map((x, i) => (
                  <div className="mm-item" key={i}>
                    <Field
                      title="Description"
                      required
                      value={x.label}
                      onChange={(e) =>
                        setItems((a) =>
                          a.map((v, n) =>
                            i === n ? { ...v, label: e.target.value } : v,
                          ),
                        )
                      }
                    />
                    <Field
                      title="Amount (INR)"
                      type="number"
                      min={0}
                      step="0.01"
                      required
                      value={x.amount}
                      onChange={(e) =>
                        setItems((a) =>
                          a.map((v, n) =>
                            i === n ? { ...v, amount: e.target.value } : v,
                          ),
                        )
                      }
                    />
                    <button
                      type="button"
                      className="secondary"
                      disabled={items.length === 1}
                      onClick={() =>
                        setItems((a) => a.filter((_, n) => n !== i))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="secondary"
                  onClick={() =>
                    setItems((a) => [...a, { label: "", amount: 0 }])
                  }
                >
                  Add line
                </button>
                <Field title="Notes">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Field>
                <p>
                  Total:{" "}
                  {money(items.reduce((n, x) => n + Number(x.amount || 0), 0))}
                </p>
                <button disabled={action.busy || !m.assignment?.coordinator}>
                  Send quote
                </button>
              </form>
            </Card>
          </div>
        )}
      </State>
      <Move key={version} />
    </>
  );
}
export function Applications() {
  const r = useLoad("/admin/coordinator-applications"),
    action = useAction();
  const [selected, setSelected] = useState(null),
    [notes, setNotes] = useState(""),
    [identity, setIdentity] = useState(false),
    [reference, setReference] = useState(false);
  const review = (status) =>
    action.run(
      async () => {
        await apiRequest(
          `/admin/coordinator-applications/${selected._id}/status`,
          {
            method: "PATCH",
            body: {
              status,
              reviewNotes: notes,
              identityChecked: identity,
              referenceChecked: reference,
            },
          },
        );
        setSelected(null);
        await r.load();
      },
      `Application ${label(status)}`,
    );
  return (
    <>
      <h1>Coordinator applications</h1>
      <Notice action={action} />
      <State resource={r}>
        <div className="mm-grid">
          <Card title="Applications">
            {r.data?.applications.length === 0 && (
              <Empty>No applications yet.</Empty>
            )}
            {r.data?.applications.map((a) => (
              <div className="mm-row" key={a._id}>
                <strong>{a.user?.name}</strong> <Badge value={a.status} />
                <button
                  className="secondary"
                  onClick={() => {
                    setSelected(a);
                    setNotes(a.reviewNotes || "");
                    setIdentity(false);
                    setReference(false);
                  }}
                >
                  Review
                </button>
              </div>
            ))}
          </Card>
          {selected && (
            <Card title={selected.user?.name}>
              <p>
                {selected.user?.email} · {selected.user?.phone}
              </p>
              <p>
                {selected.workProfile?.city} ·{" "}
                {selected.workProfile?.experienceYears} years
              </p>
              <p>{selected.workProfile?.languages?.join(", ")}</p>
              <p>
                Service areas: {selected.workProfile?.serviceAreas?.join(", ")}
              </p>
              <p>
                Reference: {selected.reference?.name} ·{" "}
                {selected.reference?.phone}
              </p>
              <p>
                Consent recorded:{" "}
                {selected.consents?.acceptedAt
                  ? new Date(selected.consents.acceptedAt).toLocaleString()
                  : "Not recorded"}
              </p>
              <button
                className="secondary"
                onClick={() =>
                  action.run(
                    () =>
                      downloadFile(
                        objectId(selected.identityFile),
                        "identity-document",
                      ),
                    "Document downloaded",
                  )
                }
              >
                View identity document
              </button>
              <p>
                Perform actual checks before approving. Consent alone is not
                verification.
              </p>
              <label className="mm-check">
                <input
                  type="checkbox"
                  checked={identity}
                  onChange={(e) => setIdentity(e.target.checked)}
                />
                I completed the identity check.
              </label>
              <label className="mm-check">
                <input
                  type="checkbox"
                  checked={reference}
                  onChange={(e) => setReference(e.target.checked)}
                />
                I completed the reference check.
              </label>
              <Field title="Review notes">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
              <div className="mm-actions">
                {["approved", "needs_changes", "rejected", "suspended"].map(
                  (status) => (
                    <button
                      className={status === "approved" ? "" : "secondary"}
                      key={status}
                      disabled={
                        action.busy ||
                        !notes.trim() ||
                        (status === "approved" && (!identity || !reference))
                      }
                      onClick={() => review(status)}
                    >
                      {label(status)}
                    </button>
                  ),
                )}
              </div>
            </Card>
          )}
        </div>
      </State>
    </>
  );
}
const emptyVehicle = {
  label: "",
  registration: "",
  type: "Van",
  capacityKg: 0,
  capacityM3: 0,
  driverName: "",
  driverPhone: "",
  city: "",
  rate: 0,
};
const emptyWorker = {
  name: "",
  phone: "",
  city: "",
  skills: "packing",
  rate: 0,
};
export function Providers() {
  const [kind, setKind] = useState("vehicles"),
    [form, setForm] = useState(emptyVehicle),
    [editing, setEditing] = useState(null);
  const r = useLoad(`/admin/${kind}`),
    action = useAction();
  const change = (k) => {
    setEditing(null);
    setKind(k);
    setForm(k === "vehicles" ? emptyVehicle : emptyWorker);
  };
  const submit = (e) => {
    e.preventDefault();
    action.run(async () => {
      const body =
        kind === "vehicles"
          ? {
              ...form,
              capacityKg: Number(form.capacityKg),
              capacityM3: Number(form.capacityM3),
              rate: Number(form.rate),
            }
          : {
              ...form,
              skills: form.skills
                .split(",")
                .map((x) => x.trim())
                .filter(Boolean),
              rate: Number(form.rate),
            };
      await apiRequest(
        editing ? `/admin/${kind}/${editing}` : `/admin/${kind}`,
        { method: editing ? "PATCH" : "POST", body },
      );
      setEditing(null);
      setForm(kind === "vehicles" ? emptyVehicle : emptyWorker);
      await r.load();
    }, "Provider added");
  };
  return (
    <>
      <h1>Vehicles & workers</h1><p className="mm-page-intro">Manage your local fleet and crew. Set each provider’s city and service details.</p>
      <Notice action={action} />
      <div className="mm-tabs">
        {["vehicles", "workers"].map((k) => (
          <button
            key={k}
            className={kind === k ? "" : "secondary"}
            onClick={() => change(k)}
          >
            {label(k)}
          </button>
        ))}
      </div>
      <State resource={r}>
        <Card>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Area / capacity / skills</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {r.data?.[kind]?.map((x) => (
                <tr key={x._id}>
                  <td>{x.label || x.name}</td>
                  <td>
                    {x.city} ·{" "}
                    {kind === "vehicles"
                      ? `${x.capacityKg} kg / ${x.capacityM3} m³`
                      : x.skills.join(", ")}
                  </td>
                  <td>{x.active ? "Active" : "Inactive"}</td>
                  <td>
                    <button
                      className="secondary"
                      disabled={action.busy}
                      onClick={() => {
                        setEditing(x._id);
                        setForm(
                          Object.fromEntries(
                            Object.keys(
                              kind === "vehicles" ? emptyVehicle : emptyWorker,
                            ).map((key) => [
                              key,
                              key === "skills"
                                ? x.skills.join(", ")
                                : (x[key] ?? ""),
                            ]),
                          ),
                        );
                      }}
                    >
                      Edit
                    </button>{" "}
                    <button
                      className="secondary"
                      disabled={action.busy}
                      onClick={() =>
                        action.run(async () => {
                          await apiRequest(`/admin/${kind}/${x._id}`, {
                            method: "PATCH",
                            body: { active: !x.active },
                          });
                          await r.load();
                        }, "Provider updated")
                      }
                    >
                      {x.active ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {r.data?.[kind]?.length === 0 && (
            <Empty>No providers yet. Add your first provider below.</Empty>
          )}
        </Card>
      </State>
      <Card
        title={`${editing ? "Edit" : "Add"} ${kind === "vehicles" ? "vehicle" : "worker"}`}
      >
        <form onSubmit={submit}>
          <div className="mm-grid">
            {Object.keys(form).map((k) => (
              <Field
                key={k}
                title={k.replace(/([A-Z])/g, " $1")}
                required
                placeholder={k === "city" ? "e.g. Jaipur, Pune or Bengaluru" : undefined}
                type={
                  ["rate", "capacityKg", "capacityM3"].includes(k)
                    ? "number"
                    : "text"
                }
                min={k === "rate" ? 0 : 0.01}
                step="any"
                value={form[k]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [k]: e.target.value }))
                }
              />
            ))}
          </div>
          <button disabled={action.busy}>
            {editing ? "Save provider" : "Add provider"}
          </button>
          {editing && (
            <button
              type="button"
              className="secondary"
              onClick={() => change(kind)}
            >
              Cancel edit
            </button>
          )}
        </form>
      </Card>
    </>
  );
}
export function Incidents() {
  const r = useLoad("/admin/incidents"),
    action = useAction(),
    [selected, setSelected] = useState(null),
    [status, setStatus] = useState("under_review"),
    [resolution, setResolution] = useState("");
  return (
    <>
      <h1>Incidents & claims</h1>
      <Notice action={action} />
      <State resource={r}>
        <Card>
          {r.data?.incidents.length === 0 && (
            <Empty>No incidents reported.</Empty>
          )}
          {r.data?.incidents.map((x) => (
            <article className="mm-row" key={x._id}>
              <Badge value={x.status} />
              <p>
                {label(x.category)} · {x.description}
              </p>
              <Link to={`/admin/moves/${objectId(x.move)}`}>
                Open move and custody updates
              </Link>
              <div className="mm-actions">
                {x.files.map((f) => (
                  <button
                    className="secondary"
                    key={f}
                    onClick={() =>
                      action.run(
                        () => downloadFile(f, "evidence"),
                        "Evidence downloaded",
                      )
                    }
                  >
                    Download evidence
                  </button>
                ))}
                <button
                  onClick={() => {
                    setSelected(x);
                    setResolution(x.resolution || "");
                    setStatus(x.status);
                  }}
                >
                  Review incident
                </button>
              </div>
            </article>
          ))}
        </Card>
        {selected && (
          <Card title="Investigation notes">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                action.run(async () => {
                  await apiRequest(`/admin/incidents/${selected._id}`, {
                    method: "PATCH",
                    body: { status, resolution },
                  });
                  await r.load();
                  setSelected(null);
                }, "Incident updated");
              }}
            >
              <Field title="Status">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {["open", "under_review", "resolved"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field title="Resolution / investigation notes">
                <textarea
                  required
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                />
              </Field>
              <p>
                Record evidence and responses. The app does not automatically
                assign liability or deduct compensation.
              </p>
              <button disabled={action.busy}>Save review</button>
            </form>
          </Card>
        )}
      </State>
    </>
  );
}
export function AccessSettings() {
  const r = useLoad("/admin/audit-logs");
  return (
    <>
      <h1>Settings & access</h1>
      <Card title="Role permissions">
        <table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Customer</td>
              <td>Own moves and customer portal</td>
            </tr>
            <tr>
              <td>Coordinator</td>
              <td>Own application; assigned jobs after approval</td>
            </tr>
            <tr>
              <td>Admin</td>
              <td>All three portals and administrative operations</td>
            </tr>
          </tbody>
        </table>
        <p>
          Permissions are enforced on the server and cannot be changed through
          public signup.
        </p>
        <p>
          Identity document downloads by administrators are logged. Service
          terms are available under the policy link.
        </p>
        <Link to="/terms">Policy and privacy notice</Link>
      </Card>
      <Card title="Audit log">
        <State resource={r}>
          {r.data?.logs.length === 0 && (
            <Empty>No administrative changes yet.</Empty>
          )}
          {r.data?.logs.map((x) => (
            <p key={x._id}>
              {new Date(x.createdAt).toLocaleString()} · {x.action} ·{" "}
              {displayId(x.target)}
            </p>
          ))}
        </State>
      </Card>
    </>
  );
}
