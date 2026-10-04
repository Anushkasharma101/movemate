import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../services/backendApi";
import { Notice, Card, Field } from "./ui";
import { useAction } from "./hooks";
const tomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const fresh = () => ({
  details: {
    pickupAddress: "",
    destAddress: "",
    pickupFloor: "",
    destFloor: "",
    pickupLift: "No",
    destLift: "No",
    moveDate: tomorrow(),
    homeSize: "1 BHK",
    accessPersonPickup: "",
    accessPersonDelivery: "",
    accessNotes: "",
  },
  inventory: [{ id: 1, name: "", qty: 1, fragile: false, notes: "" }],
  specialInstructions: "",
  unavailableHours: "",
  accessAuthorized: false,
});
export default function Booking() {
  const params = useParams(),
    nav = useNavigate(),
    action = useAction();
  const [draft, setDraft] = useState(fresh),
    [id, setId] = useState(params.id || null),
    [step, setStep] = useState(1),
    [plan, setPlan] = useState(null),
    [initial, setInitial] = useState(!!params.id);
  const run = action.run;
  useEffect(() => {
    if (params.id)
      apiRequest(`/moves/${params.id}`)
        .then(({ move }) => {
          if (move.status !== "draft") {
            nav(`/customer/moves/${move._id}`, { replace: true });
            return;
          }
          setDraft({
            details: move.details,
            inventory: move.inventory,
            specialInstructions: move.specialInstructions || "",
            unavailableHours: move.unavailableHours || "",
            accessAuthorized: !!move.accessAuthorized,
          });
          setPlan(move.plan || move.aiDraft?.plan || null);
        })
        .catch((e) => run(() => Promise.reject(e)))
        .finally(() => setInitial(false));
  }, [params.id, nav, run]);
  const detail = (key, value) =>
    setDraft((d) => ({ ...d, details: { ...d.details, [key]: value } }));
  const item = (index, key, value) =>
    setDraft((d) => ({
      ...d,
      inventory: d.inventory.map((x, i) =>
        i === index ? { ...x, [key]: value } : x,
      ),
    }));
  const save = async () => {
    const { move } = await apiRequest(id ? `/moves/${id}` : "/moves", {
      method: id ? "PATCH" : "POST",
      body: draft,
    });
    setId(move._id);
    return move._id;
  };
  const manual = () => ({
    inventory: draft.inventory,
    handlingInstructions: [],
    accessRestrictions: [],
    unavailableHours: draft.unavailableHours,
    missingQuestions: [],
    checklist: draft.inventory.map((x) => ({
      task: `Pack and check ${x.name}`,
      completed: false,
    })),
  });
  const generate = () =>
    action.run(async () => {
      const mid = await save();
      const { aiDraft } = await apiRequest(`/moves/${mid}/ai-plan`, {
        method: "POST",
        body: {},
      });
      setPlan(aiDraft.plan);
      setStep(3);
    }, "AI draft ready. Review all details before confirming.");
  const next = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }
    if (step === 2) {
      action.run(async () => {
        await save();
        setPlan(manual());
        setStep(3);
      }, "Draft saved; edit your manual plan or generate one with AI.");
      return;
    }
    if (step === 3) {
      action.run(async () => {
        await apiRequest(`/moves/${id}/plan`, {
          method: "PUT",
          body: {
            ...plan,
            inventory: draft.inventory,
            unavailableHours: draft.unavailableHours,
          },
        });
        setStep(4);
      }, "Plan confirmed");
      return;
    }
    action.run(async () => {
      await apiRequest(`/moves/${id}/submit`, { method: "POST", body: {} });
      nav(`/customer/moves/${id}?submitted=1`);
    }, "Request submitted");
  };
  if (initial) return <p>Loading your draft…</p>;
  return (
    <>
      <h1>Plan your move</h1>
      <div className="mm-stepper">
        {["Move details", "Inventory", "Review plan", "Confirm request"].map(
          (x, i) => (
            <span key={x} className={step === i + 1 ? "active" : step > i + 1 ? "complete" : ""}>
              <b>{step > i + 1 ? "✓" : i + 1}</b> {x}
            </span>
          ),
        )}
      </div>
      <Notice action={action} />
      <form onSubmit={next}>
        {step === 1 && (
          <Card title="Tell us about your move">
            <div className="mm-grid">
              {[
                ["pickupAddress", "Pickup address"],
                ["destAddress", "Destination address"],
                ["pickupFloor", "Pickup floor"],
                ["destFloor", "Destination floor"],
              ].map(([key, title]) => (
                <Field
                  key={key}
                  title={title}
                  required
                  value={draft.details[key]}
                  onChange={(e) => detail(key, e.target.value)}
                />
              ))}
              {["pickupLift", "destLift"].map((key) => (
                <Field
                  key={key}
                  title={
                    key === "pickupLift"
                      ? "Lift at pickup?"
                      : "Lift at destination?"
                  }
                >
                  <select
                    value={draft.details[key]}
                    onChange={(e) => detail(key, e.target.value)}
                  >
                    <option>No</option>
                    <option>Yes</option>
                  </select>
                </Field>
              ))}
              <Field
                title="Moving date"
                type="date"
                required
                min={new Date().toLocaleDateString("en-CA")}
                value={draft.details.moveDate}
                onChange={(e) => detail("moveDate", e.target.value)}
              />
              <Field title="Home size">
                <select
                  value={draft.details.homeSize}
                  onChange={(e) => detail("homeSize", e.target.value)}
                >
                  {["Studio", "1 BHK", "2 BHK", "3 BHK", "Other"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </Field>
              <Field
                title="Person providing pickup access"
                required
                value={draft.details.accessPersonPickup}
                onChange={(e) => detail("accessPersonPickup", e.target.value)}
              />
              <Field
                title="Person receiving at destination"
                required
                value={draft.details.accessPersonDelivery}
                onChange={(e) => detail("accessPersonDelivery", e.target.value)}
              />
            </div>
            <Field title="Access restrictions">
              <textarea
                value={draft.details.accessNotes}
                onChange={(e) => detail("accessNotes", e.target.value)}
              />
            </Field>
            <label className="mm-check">
              <input
                type="checkbox"
                required
                checked={draft.accessAuthorized}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    accessAuthorized: e.target.checked,
                  }))
                }
              />
              I have arranged authorized access at both homes.
            </label>
          </Card>
        )}
        {step === 2 && (
          <Card title="Inventory & work schedule">
            {draft.inventory.map((x, i) => (
              <div className="mm-item" key={x.id}>
                <Field
                  title="Item"
                  required
                  maxLength={100}
                  value={x.name}
                  onChange={(e) => item(i, "name", e.target.value)}
                />
                <Field
                  title="Quantity"
                  type="number"
                  min={1}
                  max={10000}
                  required
                  value={x.qty}
                  onChange={(e) => item(i, "qty", Number(e.target.value))}
                />
                <Field
                  title="Handling notes"
                  value={x.notes || ""}
                  onChange={(e) => item(i, "notes", e.target.value)}
                />
                <label className="mm-check">
                  <input
                    type="checkbox"
                    checked={x.fragile}
                    onChange={(e) => item(i, "fragile", e.target.checked)}
                  />
                  Fragile
                </label>
                <button
                  type="button"
                  className="secondary"
                  disabled={draft.inventory.length === 1}
                  onClick={() =>
                    setDraft((d) => ({
                      ...d,
                      inventory: d.inventory.filter((_, n) => n !== i),
                    }))
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
                setDraft((d) => ({
                  ...d,
                  inventory: [
                    ...d.inventory,
                    {
                      id: crypto.randomUUID(),
                      name: "",
                      qty: 1,
                      fragile: false,
                      notes: "",
                    },
                  ],
                }))
              }
            >
              Add item
            </button>
            <Field title="Special instructions">
              <textarea
                value={draft.specialInstructions}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    specialInstructions: e.target.value,
                  }))
                }
              />
            </Field>
            <Field
              title="Unavailable hours"
              placeholder="For example: 11 AM–1 PM"
              value={draft.unavailableHours}
              onChange={(e) =>
                setDraft((d) => ({ ...d, unavailableHours: e.target.value }))
              }
            />
            <p className="mm-muted">
              Confirm dimensions and capacity with your coordinator before
              transport.
            </p>
          </Card>
        )}
        {step === 3 && plan && (
          <Card title="Review your moving plan">
            <button type="button" disabled={action.busy} onClick={generate}>
              Generate / regenerate with AI
            </button>
            <p className="mm-muted">
              The hosted AI receives your moving requirements. Avoid including
              passwords, document numbers or unnecessary personal details. If AI
              is unavailable, edit this manual plan.
            </p>
            <div className="mm-grid">
              {[
                ["handlingInstructions", "Handling instructions"],
                ["accessRestrictions", "Access restrictions"],
              ].map(([key, title]) => (
                <Field key={key} title={`${title} (one per line)`}>
                  <textarea
                    value={plan[key].join("\n")}
                    onChange={(e) =>
                      setPlan((p) => ({
                        ...p,
                        [key]: e.target.value.split("\n").filter(Boolean),
                      }))
                    }
                  />
                </Field>
              ))}
            </div>
            {plan.missingQuestions.length > 0 && (
              <div className="mm-warning">
                <strong>Questions to resolve</strong>
                <ul>
                  {plan.missingQuestions.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <label className="mm-check">
                  <input type="checkbox" required />I have resolved these
                  questions and updated the plan.
                </label>
              </div>
            )}
            <Field title="Checklist (one task per line)">
              <textarea
                required
                value={plan.checklist.map((x) => x.task).join("\n")}
                onChange={(e) =>
                  setPlan((p) => ({
                    ...p,
                    checklist: e.target.value
                      .split("\n")
                      .filter(Boolean)
                      .map((task) => ({ task, completed: false })),
                  }))
                }
              />
            </Field>
            <p>
              Work commitments: {draft.unavailableHours || "None specified"}
            </p>
          </Card>
        )}
        {step === 4 && (
          <Card title="Request summary">
            <div className="mm-grid">
              <div>
                <h3>Pickup</h3>
                <p>{draft.details.pickupAddress}</p>
                <p>Access: {draft.details.accessPersonPickup}</p>
              </div>
              <div>
                <h3>Destination</h3>
                <p>{draft.details.destAddress}</p>
                <p>Receiver: {draft.details.accessPersonDelivery}</p>
              </div>
            </div>
            <p>
              {draft.details.moveDate} · {draft.details.homeSize}
            </p>
            <ul>
              {draft.inventory.map((x) => (
                <li key={x.id}>
                  {x.qty} × {x.name}
                  {x.fragile ? " — fragile" : ""}
                </li>
              ))}
            </ul>
            <p>Coordinator, crew and vehicle: awaiting assignment.</p>
            <p>Quote: pending admin review. No automatic payment.</p>
          </Card>
        )}
        <div className="mm-actions">
          {step > 1 && (
            <button
              type="button"
              className="secondary"
              disabled={action.busy}
              onClick={() => {
                setStep(step - 1);
                if (step <= 3) setPlan(null);
              }}
            >
              Back
            </button>
          )}
          <button disabled={action.busy}>
            {action.busy
              ? "Saving…"
              : step === 4
                ? "Submit request"
                : step === 3
                  ? "Confirm plan"
                  : step === 2
                    ? "Save inventory & review"
                    : "Continue"}
          </button>
        </div>
      </form>
    </>
  );
}
