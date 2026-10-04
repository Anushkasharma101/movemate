import { useEffect, useState } from "react";
import { Home, ClipboardList, Users, Truck, ShieldCheck, Settings, MessageSquare, CalendarDays, UserRound, Bell, LogOut, ArrowRight, MapPin, Package, Clock, CheckCircle2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest, uploadFile } from "../services/backendApi";
import { homeFor, useAuth } from "./authState";
import { Badge, Card, Empty, Field, Notice, State } from "./ui";
import { displayId, useAction, useLoad } from "./hooks";
export function Shell({ mode, children }) {
  const { user, logout } = useAuth(),
    nav = useNavigate(),
    location = useLocation();
  const pending =
    mode === "coordinator" &&
    user.role === "coordinator" &&
    user.approval !== "approved";
  const links =
    mode === "admin"
      ? [
        ["dashboard", "Overview"],
        ["moves", "Move requests"],
        ["applications", "Coordinators"],
        ["providers", "Vehicles & workers"],
        ["incidents", "Incidents & claims"],
        ["settings", "Settings & access"],
      ]
      : pending
        ? [["application", "Application status"]]
        : [
          ["dashboard", mode === "customer" ? "Overview" : "Jobs"],
          ["moves", mode === "customer" ? "My moves" : "Schedule"],
          ["messages", "Messages"],
          ["profile", "Account & support"],
        ];
  const action = useAction();
  const icons = { dashboard: Home, moves: ClipboardList, applications: Users, providers: Truck, incidents: ShieldCheck, settings: Settings, messages: MessageSquare, profile: UserRound, application: ShieldCheck };
  const currentTitle = links.find(([url]) => location.pathname.startsWith(`/${mode}/${url}`))?.[1] || "Moving details";
  return (
    <div className={`mm-app mm-portal-${mode}`}>
      <aside className="mm-sidebar">
        <Link className="mm-brand" to="/">
          <img src="/images/app_logo.png" alt="" />
          MoveMate
        </Link>
        <p>{mode} portal</p>
        <nav>
          {links.map(([url, name]) => (
            <Link
              className={
                location.pathname === `/${mode}/${url}` ? "active" : ""
              }
              key={url}
              to={`/${mode}/${url}`}
            >
              {(() => { const Icon = icons[url] || CalendarDays; return <Icon size={18} aria-hidden="true" />; })()}
              <span>{name}</span>
            </Link>
          ))}
        </nav>
        {user.role === "admin" && (
          <section>
            <p>Admin portal access</p>
            {["admin", "customer", "coordinator"]
              .filter((x) => x !== mode)
              .map((x) => (
                <Link key={x} to={`/${x}/dashboard`}>
                  {x} dashboard
                </Link>
              ))}
          </section>
        )}
        <div className="mm-sidebar-bottom">
          <span className="mm-avatar" aria-hidden="true">{user.name?.charAt(0)}</span>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
          <button
            className="secondary"
            disabled={action.busy}
            onClick={() =>
              action.run(async () => {
                await logout();
                nav("/login");
              }, "Signed out")
            }
          >
            <LogOut size={15} aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>
      <div className="mm-body">
        <header className="mm-topbar">
          <div className="mm-topbar-context"><span className="mm-eyebrow">{mode === "admin" ? "MOVEMATE OPERATIONS" : "YOUR MOVE. MANAGED."}</span><strong>{currentTitle}</strong></div>
          <div className="mm-topbar-account"><Link className="mm-notification-link" to={`/${mode}/notifications`}><Bell size={18} aria-hidden="true" /><span>Notifications</span></Link><span className="mm-avatar">{user.name?.charAt(0)}</span><div><strong>{user.name}</strong><small>{mode} portal</small></div></div>
        </header>
        <main>
          <Notice action={action} />
          {pending && !location.pathname.endsWith("/application") ? (
            <Application />
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
export function Dashboard({
  mode = "customer",
  messages = false,
  schedule = false,
}) {
  const resource = useLoad(
    mode === "customer" ? "/moves" : "/coordinator/jobs",
  );
  const list = resource.data?.moves || resource.data?.jobs || [];
  const { user } = useAuth();
  const featured = list.find((m) => !["completed", "cancelled"].includes(m.status)) || list[0];
  const completed = list.filter((m) => m.status === "completed").length;
  return (
    <>
      <div className="mm-title">
        <h1>
          {messages
            ? "Conversations"
            : schedule
              ? "Move schedule"
              : mode === "customer"
                ? `Hello ${user.name?.split(" ")[0] || "there"}`
                : `Good day, ${user.name?.split(" ")[0] || "coordinator"}`}
        </h1>
        {mode === "customer" && !messages && (
          <Link className="mm-button" to="/customer/booking">
            Plan my move
          </Link>
        )}
      </div>
      {!messages && !schedule && <p className="mm-page-intro">{mode === "customer" ? "Your moving day, with everything in one place." : "Your assigned moves, crew and customer commitments."}</p>}
      <State resource={resource}>
        {!messages && !schedule && <>
          <div className="mm-dashboard-columns">
            <section className="mm-featured-move">
              <div><span className="mm-eyebrow">{featured && ["completed", "cancelled"].includes(featured.status) ? "MOST RECENT MOVE" : mode === "customer" ? "YOUR NEXT CHAPTER" : "YOUR NEXT ASSIGNMENT"}</span>
                <h2>{featured ? `${featured.details?.homeSize || "Home"} move` : "A smoother moving day"}</h2>
                <p><MapPin size={16} />{featured?.details?.pickupAddress || "Local moves. New cities. One trusted plan."}</p>
                {featured && <p><CalendarDays size={16} />{featured.details?.moveDate} · {displayId(featured._id)}</p>}
                {featured ? <Link className="mm-button" to={`/${mode}/moves/${featured._id}`}>View move <ArrowRight size={16} /></Link> : <span className="mm-muted">{mode === "customer" ? "Create a request to get started." : "New jobs appear here after assignment."}</span>}
              </div><img src="/images/move-city.png" alt="Moving truck beside a new home" />
            </section>
            <section className="mm-dashboard-summary">
              <div><Package /><strong>{list.length}</strong><span>{mode === "customer" ? "Move requests" : "Assigned jobs"}</span></div>
              <div><CheckCircle2 /><strong>{completed}</strong><span>Completed</span></div>
              <div><Clock /><strong>{featured?.unavailableHours || "Not specified"}</strong><span>Customer quiet hours</span></div>
            </section>
          </div>
          <div className="mm-section-heading"><h2>{mode === "customer" ? "Your moves" : "Jobs & schedule"}</h2><span>Live booking records</span></div>
        </>}
        {list.length === 0 ? (
          <Card>
            <Empty>
              {mode === "customer"
                ? "No moves yet. Plan your first move to get started."
                : "No assigned jobs yet. Your admin will assign jobs after approval."}
            </Empty>
          </Card>
        ) : (
          <div className="mm-grid mm-move-list">
            {list.map((m) => (
              <Card key={m._id} title={`Move ${displayId(m._id)}`}>
                <Badge value={m.status} />
                <p>
                  {m.details?.moveDate} · {m.details?.homeSize}
                </p>
                <p>
                  {m.details?.pickupAddress} → {m.details?.destAddress}
                </p>
                {m.assignment?.start && (
                  <p>{new Date(m.assignment.start).toLocaleString()}</p>
                )}
                <Link
                  className="mm-button"
                  to={`/${mode}/moves/${m._id}${messages ? "?tab=messages" : ""}`}
                >
                  {messages ? "Open messages" : "View move"}
                </Link>
              </Card>
            ))}
          </div>
        )}
      </State>
    </>
  );
}
export function Profile() {
  const { user, setUser } = useAuth(),
    action = useAction();
  const [name, setName] = useState(user.name),
    [phone, setPhone] = useState(user.phone || ""),
    [prefs, setPrefs] = useState(
      user.profile?.notificationPreferences || {
        moveUpdates: true,
        messages: true,
      },
    );
  return (
    <>
      <h1>Account & support</h1>
      <Card title="Your profile">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            action.run(async () => {
              const r = await apiRequest("/auth/me", {
                method: "PATCH",
                body: {
                  name,
                  phone,
                  profile: { notificationPreferences: prefs },
                },
              });
              setUser(r.user);
            }, "Profile saved");
          }}
        >
          <Notice action={action} />
          <Field
            title="Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Field
            title="Phone"
            required
            pattern="[+]?[0-9]{10,15}"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p>
            {user.email} · {user.role}
          </p>
          {Object.keys(prefs).map((k) => (
            <label className="mm-check" key={k}>
              <input
                type="checkbox"
                checked={prefs[k]}
                onChange={(e) =>
                  setPrefs((p) => ({ ...p, [k]: e.target.checked }))
                }
              />
              {k === "moveUpdates" ? "Move updates" : "Messages"}
            </label>
          ))}
          <p className="mm-muted">
            Preferences are stored for your account. Notifications are in-app;
            SMS and push are not enabled.
          </p>
          <button disabled={action.busy}>Save profile</button>
        </form>
      </Card>
      <Card title="Need help?">
        <p>
          Open your move and select Issues to report missing items, damage or a
          service concern. Use Messages to contact the move participants.
        </p>
        <Link to={homeFor(user)}>Open your moves</Link>
      </Card>
    </>
  );
}
export function Application() {
  const resource = useLoad("/coordinator/application"),
    action = useAction(),
    { user } = useAuth();
  const [form, setForm] = useState({
    city: "",
    serviceAreas: "",
    languages: "Hindi, English",
    experienceYears: 0,
    providerType: "individual",
    companyName: "",
    referenceName: "",
    referencePhone: "",
    permission: false,
    verification: false,
    conduct: false,
  }),
    [file, setFile] = useState(null),
    [identity, setIdentity] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const existing = resource.data?.application;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (existing) {
        const w = existing.workProfile || {};
        setIdentity(existing.identityFile);
        setForm((f) => ({
          ...f,
          ...w,
          serviceAreas: w.serviceAreas?.join(", ") || f.serviceAreas,
          languages: w.languages?.join(", ") || f.languages,
          referenceName: existing.reference?.name || "",
          referencePhone: existing.reference?.phone || "",
          permission: !!existing.reference?.permission,
          verification: !!existing.consents?.verification,
          conduct: !!existing.consents?.conduct,
        }));
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [existing]);
  const editable =
    !existing || ["draft", "needs_changes"].includes(existing.status);
  const submit = (e) => {
    e.preventDefault();
    action.run(async () => {
      let fid = identity;
      if (file) fid = (await uploadFile(file, "identity"))._id;
      if (!fid) throw new Error("Upload an identity document");
      await apiRequest("/coordinator/application", {
        method: "PUT",
        body: {
          workProfile: {
            city: form.city,
            serviceAreas: form.serviceAreas
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
            languages: form.languages
              .split(",")
              .map((x) => x.trim())
              .filter(Boolean),
            experienceYears: Number(form.experienceYears),
            providerType: form.providerType,
            ...(form.providerType === "company"
              ? { companyName: form.companyName }
              : {}),
          },
          identityFile: fid,
          reference: {
            name: form.referenceName,
            phone: form.referencePhone,
            permission: form.permission,
          },
          consents: {
            verification: form.verification,
            conduct: form.conduct,
            policyVersion: "1.0",
          },
        },
      });
      await apiRequest("/coordinator/application/submit", {
        method: "POST",
        body: {},
      });
      await resource.load();
    }, "Application submitted for admin review");
  };
  return (
    <>
      <h1>Coordinator application</h1>
      <Notice action={action} />
      <State resource={resource}>
        <Card title="Approval status">
          <Badge value={existing?.status || user.approval} />
          <p>
            {existing?.reviewNotes ||
              "Complete your application. You can receive jobs only after approval."}
          </p>
          {existing?.status === "pending" && (
            <p>
              Identity and reference checks are pending. Refresh or sign in
              again after the admin reviews your application.
            </p>
          )}
          <button className="secondary" onClick={resource.load}>
            Refresh status
          </button>
        </Card>
        {editable && (
          <Card title="Work profile & verification">
            <form onSubmit={submit}>
              <div className="mm-grid">
                {[
                  ["city", "Primary city"],
                  ["serviceAreas", "Service areas (comma-separated)"],
                  ["languages", "Languages (comma-separated)"],
                  ["referenceName", "Reference name"],
                  ["referencePhone", "Reference phone"],
                ].map(([k, t]) => (
                  <Field
                    key={k}
                    title={t}
                    required
                    placeholder={k === "city" ? "e.g. Jaipur" : k === "serviceAreas" ? "e.g. Mansarovar, Vaishali Nagar" : undefined}
                    value={form[k]}
                    onChange={(e) => set(k, e.target.value)}
                  />
                ))}
                <Field
                  title="Experience (years)"
                  type="number"
                  min={0}
                  max={60}
                  required
                  value={form.experienceYears}
                  onChange={(e) => set("experienceYears", e.target.value)}
                />
                <Field title="Provider type">
                  <select
                    value={form.providerType}
                    onChange={(e) => set("providerType", e.target.value)}
                  >
                    <option value="individual">Individual</option>
                    <option value="company">Company</option>
                  </select>
                </Field>
                {form.providerType === "company" && (
                  <Field
                    title="Company name"
                    required
                    value={form.companyName}
                    onChange={(e) => set("companyName", e.target.value)}
                  />
                )}
              </div>
              <Field
                title="Identity document (PNG, JPEG or PDF; max 5 MB)"
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                required={!identity}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <p className="mm-muted">
                Use a demo document for the hackathon. Choose an accepted
                alternative ID; Aadhaar is not mandatory. Document access is
                restricted to you and administrators. Identity documents are not
                sent to AI.
              </p>
              {[
                [
                  "permission",
                  "My reference has permitted their contact details to be shared for verification.",
                ],
                [
                  "verification",
                  "I consent to identity and reference checks for coordinator approval.",
                ],
                [
                  "conduct",
                  "I agree to the coordinator conduct policy and to report issues and seek approval for extra charges.",
                ],
              ].map(([k, t]) => (
                <label className="mm-check" key={k}>
                  <input
                    type="checkbox"
                    required
                    checked={form[k]}
                    onChange={(e) => set(k, e.target.checked)}
                  />
                  {t}
                </label>
              ))}
              <Link to="/terms">Read policy and privacy notice</Link>
              <div className="mm-actions">
                <button disabled={action.busy}>Submit application</button>
              </div>
            </form>
          </Card>
        )}
      </State>
    </>
  );
}
export function Notifications() {
  const resource = useLoad("/notifications"),
    action = useAction();
  return (
    <>
      <h1>Notifications</h1>
      <Notice action={action} />
      <State resource={resource}>
        <Card>
          {resource.data?.notifications.length === 0 && (
            <Empty>No notifications yet.</Empty>
          )}
          {resource.data?.notifications.map((n) => (
            <article key={n._id} className="mm-row">
              <p>{n.text}</p>
              <Badge value={n.read ? "read" : "unread"} />
              {!n.read && (
                <button
                  disabled={action.busy}
                  onClick={() =>
                    action.run(async () => {
                      await apiRequest(`/notifications/${n._id}/read`, {
                        method: "PATCH",
                        body: {},
                      });
                      await resource.load();
                    }, "Marked as read")
                  }
                >
                  Mark read
                </button>
              )}
            </article>
          ))}
        </Card>
      </State>
    </>
  );
}
