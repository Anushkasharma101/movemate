import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, Guard } from "./Auth";
import { homeFor, useAuth } from "./authState";
import Login from "./Login";
import Booking from "./Booking";
import Move from "./Move";
import {
  Application,
  Dashboard,
  Notifications,
  Profile,
  Shell,
} from "./Portals";
import {
  AccessSettings,
  AdminMove,
  Applications,
  Incidents,
  Overview,
  Providers,
  Requests,
} from "./Admin";
import Hero from "../components/Hero";
import ServiceCards from "../components/ServiceCards";
import HowItWorks from "../components/HowItWorks";
import "../App.css";
import "./integrated.css";
import "./portal-design.css";
function Home() {
  const { user, logout } = useAuth(),
    nav = useNavigate();
  const plan = () =>
    nav(
      user
        ? user.role === "coordinator"
          ? homeFor(user)
          : "/customer/booking"
        : "/login",
    );
  return (
    <>
      <header className="mm-public-header">
        <Link className="mm-brand" to="/">
          <img src="/images/app_logo.png" alt="" />
          MoveMate
        </Link>
        <nav>
          <a href="#how-it-works">How it works</a>
          {user ? (
            <>
              <Link to={homeFor(user)}>Dashboard</Link>
              <button onClick={() => logout().catch(() => {})}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign in</Link>
              <Link className="mm-button" to="/register">
                Create account
              </Link>
            </>
          )}
        </nav>
      </header>
      <Hero onPlanMoveClick={plan} activeCity="your city" onCitySelectClick={plan} />
      <section className="mm-city-strip"><span className="mm-eyebrow">A NEW HOME. A FAMILIAR FEELING.</span><h2>Moving plans for wherever life takes you.</h2><p>Jaipur · Pune · Bengaluru · Mumbai · Delhi NCR · Hyderabad · Chennai</p><small>Team availability and coverage are confirmed for each request.</small></section>
      <ServiceCards onSelectService={plan} />
      <HowItWorks onPlanMoveClick={plan} />
      <footer className="mm-footer">
        MoveMate · Your move. Managed. <Link to="/terms">Policy & privacy</Link>
      </footer>
    </>
  );
}
function Policy() {
  return (
    <main className="mm-policy">
      <Link to="/">MoveMate home</Link>
      <h1>Service terms & privacy notice</h1>
      <p>
        Prototype policy version 1.0. This project is for demonstration;
        production moving services require reviewed agreements, insurance
        arrangements and operational verification.
      </p>
      <h2>Moving instructions and approvals</h2>
      <p>
        Customers provide accurate inventory and arrange authorized access at
        pickup and delivery. Coordinators use the confirmed checklist, document
        condition, report incidents, protect customer information and seek
        approval before extra charges. No automatic payment or compensation
        deduction is enabled.
      </p>
      <h2>Coordinator checks</h2>
      <p>
        Identity documents and reference information are collected for
        administrator review. Reference contact requires permission. Consent
        alone does not verify identity or reliability. Alternative
        identification is accepted; Aadhaar is not mandatory. Use demo documents
        for the hackathon.
      </p>
      <h2>Privacy</h2>
      <p>
        Account and move data are stored in the project database. Identity
        document access is restricted to the owner and admin and is not sent to
        AI. Moving requirements, special instructions and access notes may be
        sent to Backboard/Qwen when you request an AI plan. Avoid unnecessary
        personal information. Hosted AI is not offline. Administrators can
        access the operational records and identity document access is audited.
        Ask the service administrator to handle data access/deletion requests.
      </p>
      <h2>Claims</h2>
      <p>
        Report missing items, damage or misconduct through the move’s Issues
        tab. Keep condition photos and handover records. Investigation and any
        compensation depend on evidence and the applicable agreement; the app
        does not automatically determine liability.
      </p>
      <Link to="/register">Back to registration</Link>
    </main>
  );
}
const portal = (mode, node) => (
  <Guard roles={mode === "admin" ? ["admin"] : [mode, "admin"]}>
    <Shell mode={mode}>{node}</Shell>
  </Guard>
);
function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Login register />} />
      <Route path="/forgot-password" element={<Login forgot />} />
      <Route path="/reset-password" element={<Login reset />} />
      <Route path="/terms" element={<Policy />} />
      {["customer", "coordinator"].map((mode) => (
        <Route key={mode} path={`/${mode}`}>
          <Route
            path="dashboard"
            element={portal(mode, <Dashboard mode={mode} />)}
          />
          <Route
            path="moves"
            element={portal(
              mode,
              <Dashboard mode={mode} schedule={mode === "coordinator"} />,
            )}
          />
          <Route path="moves/:id" element={portal(mode, <Move />)} />
          <Route
            path="messages"
            element={portal(mode, <Dashboard mode={mode} messages />)}
          />
          <Route path="profile" element={portal(mode, <Profile />)} />
          <Route
            path="notifications"
            element={portal(mode, <Notifications />)}
          />
        </Route>
      ))}
      <Route
        path="/customer/booking"
        element={portal("customer", <Booking />)}
      />
      <Route
        path="/customer/booking/:id"
        element={portal("customer", <Booking />)}
      />
      <Route
        path="/coordinator/application"
        element={portal("coordinator", <Application />)}
      />
      <Route path="/admin/dashboard" element={portal("admin", <Overview />)} />
      <Route path="/admin/moves" element={portal("admin", <Requests />)} />
      <Route path="/admin/moves/:id" element={portal("admin", <AdminMove />)} />
      <Route
        path="/admin/applications"
        element={portal("admin", <Applications />)}
      />
      <Route path="/admin/providers" element={portal("admin", <Providers />)} />
      <Route path="/admin/incidents" element={portal("admin", <Incidents />)} />
      <Route
        path="/admin/settings"
        element={portal("admin", <AccessSettings />)}
      />
      <Route
        path="/admin/notifications"
        element={portal("admin", <Notifications />)}
      />
      <Route path="/admin/profile" element={portal("admin", <Profile />)} />
      <Route
        path="*"
        element={
          <main className="mm-state">
            <h1>Page not found</h1>
            <Link to="/">Go home</Link>
          </main>
        }
      />
    </Routes>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routing />
      </AuthProvider>
    </BrowserRouter>
  );
}
