import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { apiRequest, uploadFile, downloadFile } from "../services/backendApi";
import { useAuth } from "./authState";
import { Badge, Card, Empty, Field, Notice, State } from "./ui";
import { displayId, label, money, objectId, useAction, useLoad } from "./hooks";
const order = [
  "confirmed",
  "packing",
  "loading",
  "in_transit",
  "unloading",
  "awaiting_confirmation",
  "completed",
];
export default function Move() {
  const { id } = useParams(),
    { user } = useAuth(),
    [search] = useSearchParams();
  const resource = useLoad(`/moves/${id}`, { poll: 15000 }),
    updates = useLoad(`/moves/${id}/updates`, { poll: 15000 }),
    changes = useLoad(`/moves/${id}/change-requests`, { poll: 15000 }),
    messages = useLoad(`/moves/${id}/messages`, { poll: 15000 }),
    incidents = useLoad(`/moves/${id}/incidents`),
    action = useAction();
  const [tab, setTab] = useState(
      search.get("tab") === "messages" ? "messages" : "overview",
    ),
    [text, setText] = useState(""),
    [reason, setReason] = useState(""),
    [amount, setAmount] = useState(0),
    [file, setFile] = useState(null),
    [files, setFiles] = useState([]),
    [category, setCategory] = useState("damage"),
    [rating, setRating] = useState(5),
    [feedback, setFeedback] = useState(""),
    [received, setReceived] = useState(false),
    [discrepancies, setDiscrepancies] = useState("");
  const customer = user.role === "customer" || user.role === "admin",
    coordinator = user.role === "coordinator" || user.role === "admin";
  const m = resource.data?.move;
  const perform = (endpoint, method, body, msg) =>
    action.run(async () => {
      const r = await apiRequest(endpoint, { method, body });
      await Promise.all([
        resource.load(),
        updates.load(),
        changes.load(),
        messages.load(),
        incidents.load(),
      ]);
      if (
        endpoint.endsWith("/updates") ||
        endpoint.endsWith("/incidents") ||
        endpoint.endsWith("/change-requests")
      )
        setFiles([]);
      return r;
    }, msg);
  const attachment = () =>
    action.run(async () => {
      if (!file) throw new Error("Choose a photo first");
      const f = await uploadFile(file, "evidence", id);
      setFiles((a) => [...a, f._id]);
      setFile(null);
      return f;
    }, "Photo uploaded");
  return (
    <State resource={resource}>
      {m && (
        <div className="mm-move-detail">
          <div className="mm-title">
            <div>
              <h1>Move {displayId(m._id)}</h1>
              <p>
                {m.details?.moveDate} · {m.details?.homeSize}
              </p>
            </div>
            <Badge value={m.status} />
          </div>
          {search.has("submitted") && m.status === "submitted" && (
            <p className="mm-success">
              Request submitted. Your team and quote are awaiting review.
            </p>
          )}
          <Notice action={action} />
          <div className="mm-tabs">
            {["overview", "progress", "messages", "issues"].map((x) => (
              <button
                key={x}
                className={tab === x ? "" : "secondary"}
                onClick={() => setTab(x)}
              >
                {label(x)}
              </button>
            ))}
          </div>
          <div className="mm-route-banner"><span>Pickup</span><strong>{m.details?.pickupAddress}</strong><span className="mm-route-arrow">→</span><span>Destination</span><strong>{m.details?.destAddress}</strong></div>
          {tab === "overview" && (
            <>
              <div className="mm-grid">
                <Card title="Addresses & access">
                  <strong>Pickup</strong>
                  <p>{m.details?.pickupAddress}</p>
                  <p>
                    Floor {m.details?.pickupFloor} · Lift{" "}
                    {m.details?.pickupLift}
                  </p>
                  <p>{m.details?.accessPersonPickup}</p>
                  <strong>Destination</strong>
                  <p>{m.details?.destAddress}</p>
                  <p>
                    Floor {m.details?.destFloor} · Lift {m.details?.destLift}
                  </p>
                  <p>{m.details?.accessPersonDelivery}</p>
                  <p>{m.details?.accessNotes}</p>
                  <div className="mm-warning">
                    Unavailable hours: {m.unavailableHours || "None specified"}
                  </div>
                </Card>
                <Card title="Your moving team">
                  {m.assignment?.coordinator ? (
                    <>
                      <p>Coordinator: {m.assignment.coordinator.name}</p>
                      <p>
                        Contact:{" "}
                        {m.assignment.coordinator.phone || "Not supplied"}
                      </p>
                      <p>
                        Vehicle: {m.assignment.vehicle?.label} · Driver{" "}
                        {m.assignment.vehicle?.driverName}
                      </p>
                      <ul>
                        {m.assignment.workers?.map((w) => (
                          <li key={w._id}>
                            {w.name} — {w.skills?.join(", ")}
                          </li>
                        ))}
                      </ul>
                      <p>
                        {new Date(m.assignment.start).toLocaleString()} –{" "}
                        {new Date(m.assignment.end).toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <Empty>Awaiting team assignment.</Empty>
                  )}
                </Card>
              </div>
              <Card title="Inventory & confirmed plan">
                <ul>
                  {m.inventory?.map((x, i) => (
                    <li key={i}>
                      {x.qty} × {x.name}{" "}
                      {x.fragile && <Badge value="fragile" />} {x.notes}
                    </li>
                  ))}
                </ul>
                <p>{m.specialInstructions}</p>
                {m.plan?.handlingInstructions?.map((x, i) => (
                  <p key={i}>{x}</p>
                ))}
                {m.status === "draft" && customer && (
                  <Link className="mm-button" to={`/customer/booking/${m._id}`}>
                    Continue draft
                  </Link>
                )}
              </Card>
              <Card title="Quote">
                {m.quote ? (
                  <>
                    <table>
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {m.quote.items.map((x, i) => (
                          <tr key={i}>
                            <td>{x.label}</td>
                            <td>{money(x.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p>
                      <strong>
                        Version {m.quote.version} · {money(m.quote.total)}
                      </strong>{" "}
                      <Badge value={m.quote.status} />
                    </p>
                    <p>{m.quote.notes}</p>
                    {customer &&
                      m.status === "quoted" &&
                      m.quote.status === "sent" && (
                        <>
                          <button
                            disabled={action.busy}
                            onClick={() =>
                              perform(
                                `/moves/${id}/quote/accept`,
                                "POST",
                                { quoteId: m.quote._id },
                                "Quote accepted",
                              )
                            }
                          >
                            Accept quote
                          </button>
                          <Field
                            title="Requested quote changes"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                          />
                          <button
                            className="secondary"
                            disabled={action.busy || !reason.trim()}
                            onClick={() =>
                              perform(
                                `/moves/${id}/quote/request-changes`,
                                "POST",
                                { reason },
                                "Changes requested",
                              )
                            }
                          >
                            Request changes
                          </button>
                        </>
                      )}
                    <p>
                      Approved additional costs:{" "}
                      {money(
                        changes.data?.changes
                          .filter((c) => c.status === "approved")
                          .reduce((n, c) => n + c.amount, 0),
                      )}
                    </p>
                  </>
                ) : (
                  <Empty>
                    Awaiting quote. No amount will be charged automatically.
                  </Empty>
                )}
              </Card>
              {customer &&
                ["draft", "submitted", "quoted", "confirmed"].includes(
                  m.status,
                ) && (
                  <Card title="Cancel request">
                    <Field
                      title="Reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <button
                      className="danger"
                      disabled={action.busy || !reason.trim()}
                      onClick={() =>
                        perform(
                          `/moves/${id}/cancel`,
                          "POST",
                          { reason },
                          "Request cancelled",
                        )
                      }
                    >
                      Confirm cancellation
                    </button>
                  </Card>
                )}
              {m.status === "awaiting_confirmation" && customer && (
                <Card title="Confirm delivery">
                  <label className="mm-check">
                    <input
                      type="checkbox"
                      checked={received}
                      onChange={(e) => setReceived(e.target.checked)}
                    />
                    I have checked the received belongings.
                  </label>
                  <Field title="Missing or damaged items (one per line)">
                    <textarea
                      value={discrepancies}
                      onChange={(e) => setDiscrepancies(e.target.value)}
                    />
                  </Field>
                  <button
                    disabled={action.busy || !received}
                    onClick={() =>
                      perform(
                        `/moves/${id}/confirm-delivery`,
                        "POST",
                        {
                          received: true,
                          notes: "Customer checked delivery",
                          discrepancies: discrepancies
                            .split("\n")
                            .filter(Boolean),
                        },
                        "Delivery recorded",
                      )
                    }
                  >
                    Confirm delivery
                  </button>
                  <p>
                    Discrepancies remain recorded. You can also open an incident
                    below.
                  </p>
                </Card>
              )}
              {m.status === "completed" && (
                <Card title="Move completed">
                  <p>
                    Delivered and confirmed on{" "}
                    {new Date(m.delivery?.confirmedAt).toLocaleString()}.
                  </p>
                  {m.delivery?.discrepancies?.map((x, i) => (
                    <p key={i}>Recorded discrepancy: {x}</p>
                  ))}
                  {customer && !m.review ? (
                    <>
                      <Field title="Rating">
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                        >
                          {[5, 4, 3, 2, 1].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </Field>
                      <Field title="Feedback">
                        <textarea
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                      </Field>
                      <button
                        disabled={action.busy}
                        onClick={() =>
                          perform(
                            `/moves/${id}/review`,
                            "POST",
                            { rating, feedback },
                            "Thank you for your feedback",
                          )
                        }
                      >
                        Submit review
                      </button>
                    </>
                  ) : (
                    m.review && (
                      <p>
                        Rating: {m.review.rating}/5 · {m.review.feedback}
                      </p>
                    )
                  )}
                </Card>
              )}
            </>
          )}
          {tab === "progress" && <div className="mm-progress-rail" aria-label="Move progress">{["packing", "loading", "in_transit", "unloading", "completed"].map((stage) => <div key={stage} className={order.indexOf(m.status) >= order.indexOf(stage) ? "done" : ""}><span /><strong>{label(stage)}</strong></div>)}</div>}
          {tab === "progress" && (
            <>
              <Card title="Moving progress">
                <div className="mm-stepper">
                  {order.map((x) => (
                    <span
                      key={x}
                      className={
                        order.indexOf(m.status) >= order.indexOf(x)
                          ? "active"
                          : ""
                      }
                    >
                      {label(x)}
                    </span>
                  ))}
                </div>
                {coordinator && m.status === "confirmed" && (
                  <button
                    disabled={action.busy}
                    onClick={() =>
                      perform(
                        `/coordinator/jobs/${id}/start`,
                        "POST",
                        {},
                        "Job started",
                      )
                    }
                  >
                    Start job
                  </button>
                )}
                <h3>Checklist</h3>
                {m.checklist?.map((x, i) => (
                  <label key={i} className="mm-check">
                    <input
                      type="checkbox"
                      checked={x.completed}
                      disabled={
                        !coordinator ||
                        action.busy ||
                        ![
                          "packing",
                          "loading",
                          "in_transit",
                          "unloading",
                          "awaiting_confirmation",
                        ].includes(m.status)
                      }
                      onChange={(e) =>
                        perform(
                          `/coordinator/jobs/${id}/checklist`,
                          "PATCH",
                          { index: i, completed: e.target.checked },
                          "Checklist updated",
                        )
                      }
                    />
                    {x.task}
                  </label>
                ))}
                {coordinator &&
                  ["packing", "loading", "in_transit", "unloading"].includes(
                    m.status,
                  ) && (
                    <>
                      <Field title="Progress note">
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </Field>
                      <Field
                        title="Evidence photo"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                      <button
                        type="button"
                        className="secondary"
                        disabled={action.busy || !file}
                        onClick={attachment}
                      >
                        Upload photo
                      </button>
                      <p>
                        {files.length} photo(s) attached to your next update.
                      </p>
                      <div className="mm-actions">
                        <button
                          disabled={action.busy || !text.trim()}
                          onClick={() =>
                            perform(
                              `/coordinator/jobs/${id}/updates`,
                              "POST",
                              { status: m.status, note: text, files },
                              "Update shared",
                            )
                          }
                        >
                          Share update
                        </button>
                        {m.status !== "unloading" && (
                          <button
                            disabled={action.busy || !text.trim()}
                            onClick={() =>
                              perform(
                                `/coordinator/jobs/${id}/updates`,
                                "POST",
                                {
                                  status: order[order.indexOf(m.status) + 1],
                                  note: text,
                                  files,
                                },
                                "Progress advanced",
                              )
                            }
                          >
                            Advance to{" "}
                            {label(order[order.indexOf(m.status) + 1])}
                          </button>
                        )}
                        {m.status === "unloading" && (
                          <button
                            disabled={action.busy}
                            onClick={() =>
                              perform(
                                `/coordinator/jobs/${id}/ready-for-confirmation`,
                                "POST",
                                {},
                                "Customer confirmation requested",
                              )
                            }
                          >
                            Request delivery confirmation
                          </button>
                        )}
                      </div>
                    </>
                  )}
              </Card>
              <Card title="Updates">
                <State resource={updates}>
                  {updates.data?.updates.length === 0 && (
                    <Empty>No updates yet.</Empty>
                  )}
                  {updates.data?.updates.map((u) => (
                    <article className="mm-row" key={u._id}>
                      <Badge value={u.status} />
                      <p>{u.note}</p>
                      <small>{new Date(u.createdAt).toLocaleString()}</small>
                      {u.files.map((f) => (
                        <button
                          key={f}
                          className="secondary"
                          onClick={() =>
                            action.run(
                              () => downloadFile(f, "moving-photo"),
                              "Photo downloaded",
                            )
                          }
                        >
                          Download photo
                        </button>
                      ))}
                    </article>
                  ))}
                </State>
              </Card>
              <Card title="Additional-cost approvals">
                <State resource={changes}>
                  {changes.data?.changes.length === 0 && (
                    <Empty>No change requests.</Empty>
                  )}
                  {changes.data?.changes.map((c) => (
                    <article className="mm-row" key={c._id}>
                      <p>
                        {c.reason} · {money(c.amount)}{" "}
                        <Badge value={c.status} />
                      </p>
                      {c.files?.map((f) => (
                        <button
                          className="secondary"
                          key={f}
                          onClick={() =>
                            action.run(
                              () => downloadFile(f, "change-evidence"),
                              "Evidence downloaded",
                            )
                          }
                        >
                          View evidence
                        </button>
                      ))}
                      {customer && c.status === "pending" && (
                        <div className="mm-actions">
                          {["approved", "declined"].map((decision) => (
                            <button
                              className={
                                decision === "declined" ? "secondary" : ""
                              }
                              key={decision}
                              disabled={action.busy}
                              onClick={() =>
                                perform(
                                  `/moves/${id}/change-requests/${c._id}/decision`,
                                  "POST",
                                  { decision },
                                  `Change ${decision}`,
                                )
                              }
                            >
                              {label(decision)}
                            </button>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </State>
                {coordinator && order.slice(0, 6).includes(m.status) && (
                  <>
                    <Field
                      title="Reason for additional cost"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                    <Field
                      title="Amount (INR)"
                      type="number"
                      min={0}
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <button
                      disabled={action.busy || !reason.trim()}
                      onClick={() =>
                        perform(
                          `/coordinator/jobs/${id}/change-requests`,
                          "POST",
                          { reason, amount, files },
                          "Sent for approval",
                        )
                      }
                    >
                      Request approval
                    </button>
                  </>
                )}
              </Card>
            </>
          )}
          {tab === "messages" && (
            <Card title="Messages">
              <State resource={messages}>
                {messages.data?.messages.length === 0 && (
                  <Empty>No messages yet.</Empty>
                )}
                {messages.data?.messages
                  .slice()
                  .reverse()
                  .map((x) => (
                    <article className="mm-row" key={x._id}>
                      <small>
                        {objectId(x.author) === user.id
                          ? "You"
                          : x.author?.name || "Move participant"}{" "}
                        · {new Date(x.createdAt).toLocaleString()}
                      </small>
                      <p>{x.text}</p>
                    </article>
                  ))}
              </State>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  perform(
                    `/moves/${id}/messages`,
                    "POST",
                    { text },
                    "Message sent",
                  ).then((r) => {
                    if (r) setText("");
                  });
                }}
              >
                <Field title="Message">
                  <textarea
                    required
                    maxLength={4000}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </Field>
                <button disabled={action.busy}>Send message</button>
              </form>
            </Card>
          )}
          {tab === "issues" && (
            <Card title="Report an issue">
              <State resource={incidents}>
                {incidents.data?.incidents.map((x) => (
                  <article className="mm-row" key={x._id}>
                    <Badge value={x.status} />
                    <p>{x.description}</p>
                    <p>{x.resolution}</p>
                  </article>
                ))}
              </State>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  perform(
                    `/moves/${id}/incidents`,
                    "POST",
                    { category, description: reason, files },
                    "Incident reported",
                  );
                }}
              >
                <Field title="Issue type">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {["missing", "damage", "conduct", "other"].map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </Field>
                <Field title="Description">
                  <textarea
                    required
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Field>
                <Field
                  title="Evidence photo"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <button
                  type="button"
                  className="secondary"
                  disabled={action.busy || !file}
                  onClick={attachment}
                >
                  Upload evidence
                </button>
                <p>{files.length} attachment(s)</p>
                <button disabled={action.busy}>Submit incident</button>
              </form>
            </Card>
          )}
        </div>
      )}
    </State>
  );
}
