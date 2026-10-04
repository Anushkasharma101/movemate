import { expect } from "@playwright/test";
const password = "BrowserTestPassword123!";
async function login(page, email) {
  await page.goto("/login");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
}
async function signup(page, name, email, role) {
  await page.goto("/register");
  await page.getByLabel("Full name").fill(name);
  await page.getByLabel("Account type").selectOption(role);
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByRole("checkbox").check();
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
}
export async function runWorkflow(browser) {
  const customer = await browser.newPage(),
    coord = await browser.newPage(),
    admin = await browser.newPage();
  const errors = [];
  for (const p of [customer, coord, admin])
    p.on("pageerror", (e) => errors.push(e.message));
  console.log("Coordinator signup and application");
  await signup(coord, "Coordinator Test", "coord@example.com", "coordinator");
  await expect(
    coord.getByRole("heading", {
      name: "Coordinator application",
      exact: true,
    }),
  ).toBeVisible();
  await coord.getByLabel("Primary city", { exact: true }).fill("Jaipur");
  await coord.getByLabel("Service areas (comma-separated)").fill("Mansarovar, Vaishali Nagar");
  await coord
    .getByLabel("Reference name", { exact: true })
    .fill("Reference Test");
  await coord.getByLabel("Reference phone", { exact: true }).fill("9876543210");
  await coord
    .getByLabel(/Identity document \(/)
    .setInputFiles({
      name: "demo.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\nDemo document, not real identity"),
    });
  for (const checkbox of await coord.getByRole("checkbox").all())
    await checkbox.check();
  await coord
    .getByRole("button", { name: "Submit application", exact: true })
    .click();
  await expect(
    coord.getByText("Application submitted for admin review"),
  ).toBeVisible();
  console.log("Admin verification");
  await login(admin, "admin@example.com");
  await expect(admin).toHaveURL(/admin\/dashboard/);
  await admin.getByRole("link", { name: "Coordinators", exact: true }).click();
  await admin.getByRole("button", { name: "Review", exact: true }).click();
  await admin.getByLabel("I completed the identity check.").check();
  await admin.getByLabel("I completed the reference check.").check();
  await admin
    .getByLabel("Review notes")
    .fill("Demo identity and reference checked");
  await admin.getByRole("button", { name: "approved", exact: true }).click();
  await expect(admin.getByText("Application approved")).toBeVisible();
  await login(coord, "coord@example.com");
  await expect(coord).toHaveURL(/coordinator\/dashboard/);
  await expect(coord.getByText(/No assigned jobs yet/)).toBeVisible();
  await coord.goto("/customer/dashboard");
  await expect(
    coord.getByRole("heading", { name: "Access denied" }),
  ).toBeVisible();
  console.log("Provider records");
  await admin.goto("/admin/providers");
  for (const [key, value] of Object.entries({
    label: "Demo Truck",
    registration: "DEMO001",
    type: "Van",
    "capacity Kg": "1000",
    "capacity M3": "12",
    "driver Name": "Driver Test",
    "driver Phone": "9876543210",
    city: "Jaipur",
    rate: "1000",
  }))
    await admin.getByLabel(key, { exact: true }).fill(value);
  await admin
    .getByRole("button", { name: "Add provider", exact: true })
    .click();
  await expect(admin.getByText("Provider added")).toBeVisible();
  await admin.getByRole("button", { name: "workers", exact: true }).click();
  for (const [key, value] of Object.entries({
    name: "Worker Test",
    phone: "9876543210",
    city: "Jaipur",
    skills: "packing, loading",
    rate: "500",
  }))
    await admin.getByLabel(key, { exact: true }).fill(value);
  await admin
    .getByRole("button", { name: "Add provider", exact: true })
    .click();
  await expect(admin.getByText("Worker Test", { exact: true })).toBeVisible();
  console.log("Customer booking");
  await signup(customer, "Customer Test", "customer@example.com", "customer");
  await expect(customer).toHaveURL(/customer\/dashboard/);
  await expect(customer.getByText(/No moves yet/)).toBeVisible();
  await customer.goto("/coordinator/dashboard");
  await expect(
    customer.getByRole("heading", { name: "Access denied" }),
  ).toBeVisible();
  await customer.goto("/admin/dashboard");
  await expect(
    customer.getByRole("heading", { name: "Access denied" }),
  ).toBeVisible();
  await customer.goto("/customer/dashboard");
  await customer
    .getByRole("link", { name: "Plan my move", exact: true })
    .click();
  for (const [key, value] of Object.entries({
    "Pickup address": "Mansarovar Jaipur",
    "Destination address": "Vaishali Nagar Jaipur",
    "Pickup floor": "3",
    "Destination floor": "1",
    "Moving date": "2030-10-04",
    "Person providing pickup access": "Friend One",
    "Person receiving at destination": "Friend Two",
  }))
    await customer.getByLabel(key, { exact: true }).fill(value);
  await customer.getByLabel(/I have arranged authorized access/).check();
  await customer.getByRole("button", { name: "Continue", exact: true }).click();
  await customer.getByLabel("Item", { exact: true }).fill("Monitor");
  await customer.getByLabel("Fragile", { exact: true }).check();
  await customer
    .getByLabel("Special instructions")
    .fill("Keep laptop unpacked");
  await customer.getByLabel("Unavailable hours").fill("11 AM-1 PM");
  await customer
    .getByRole("button", { name: "Save inventory & review" })
    .click();
  await customer
    .getByRole("button", { name: "Generate / regenerate with AI" })
    .click();
  await expect(customer.getByRole("alert")).toContainText("BACKBOARD_API_KEY"); // no fabricated AI
  await customer
    .getByRole("button", { name: "Confirm plan", exact: true })
    .click();
  await customer
    .getByRole("button", { name: "Submit request", exact: true })
    .click();
  await expect(
    customer.getByText(/Request submitted. Your team/),
  ).toBeVisible();
  const moveId = new URL(customer.url()).pathname.split("/").at(-1);
  await customer.reload();
  await expect(
    customer.getByRole("heading", { name: /Move [A-Z0-9]+/ }),
  ).toBeVisible();
  console.log("Assign and quote");
  await admin.goto(`/admin/moves/${moveId}`);
  await admin.getByLabel("Start (your local time)").fill("2030-10-04T08:00");
  await admin.getByLabel("End (your local time)").fill("2030-10-04T17:00");
  await admin
    .getByRole("button", { name: "Check availability", exact: true })
    .click();
  await admin
    .getByLabel("Coordinator", { exact: true })
    .selectOption({ label: "Coordinator Test" });
  await admin
    .getByLabel("Vehicle", { exact: true })
    .selectOption({ label: "Demo Truck — 1000 kg / 12 m³" });
  await admin.getByRole("checkbox", { name: /Worker Test/ }).check();
  await admin
    .getByRole("button", { name: "Confirm assignment", exact: true })
    .click();
  await expect(admin.getByText("Team assigned", { exact: true })).toBeVisible();
  for (const field of await admin
    .getByLabel("Amount (INR)", { exact: true })
    .all())
    await field.fill("1000");
  await admin.getByRole("button", { name: "Send quote", exact: true }).click();
  await expect(admin.getByText("Quote sent to customer")).toBeVisible();
  await customer.reload();
  await customer
    .getByRole("button", { name: "Accept quote", exact: true })
    .click();
  await expect(
    customer.getByText("Quote accepted", { exact: true }),
  ).toBeVisible();
  console.log("Coordinator execution");
  await coord.goto(`/coordinator/moves/${moveId}`);
  await coord.getByRole("button", { name: "progress", exact: true }).click();
  await coord.getByRole("button", { name: "Start job", exact: true }).click();
  await expect(
    coord.getByRole("status").filter({ hasText: "Job started" }),
  ).toBeVisible();
  await coord
    .getByLabel("Reason for additional cost")
    .fill("Extra protective material");
  await coord.getByLabel("Amount (INR)", { exact: true }).fill("300");
  await coord
    .getByRole("button", { name: "Request approval", exact: true })
    .click();
  await expect(coord.getByText("Sent for approval")).toBeVisible();
  await customer.reload();
  await customer.getByRole("button", { name: "progress", exact: true }).click();
  await customer.getByRole("button", { name: "approved", exact: true }).click();
  await expect(customer.getByText("Change approved")).toBeVisible();
  await coord.reload();
  await coord.getByRole("button", { name: "progress", exact: true }).click();
  await coord.getByLabel("Pack and check Monitor").click();
  await expect(coord.getByLabel("Pack and check Monitor")).toBeChecked();
  for (const status of ["loading", "in transit", "unloading"]) {
    await coord.getByLabel("Progress note").fill(`Now ${status}`);
    await coord
      .getByRole("button", { name: `Advance to ${status}`, exact: true })
      .click();
    await expect(
      coord.getByText("Progress advanced", { exact: true }),
    ).toBeVisible();
  }
  await coord
    .getByRole("button", { name: "Request delivery confirmation", exact: true })
    .click();
  await expect(
    coord.getByText("Customer confirmation requested"),
  ).toBeVisible();
  await customer.reload();
  await customer.getByLabel("I have checked the received belongings.").check();
  await customer
    .getByRole("button", { name: "Confirm delivery", exact: true })
    .click();
  await expect(
    customer.getByRole("heading", { name: "Move completed", exact: true }),
  ).toBeVisible();
  await customer
    .getByLabel("Feedback", { exact: true })
    .fill("Helpful coordination");
  await customer
    .getByRole("button", { name: "Submit review", exact: true })
    .click();
  await expect(customer.getByText("Thank you for your feedback")).toBeVisible();
  console.log("Messages, profile and incident reporting");
  await customer.getByRole("button", { name: "messages", exact: true }).click();
  await customer
    .getByLabel("Message", { exact: true })
    .fill("Thanks for handling my move");
  await customer
    .getByRole("button", { name: "Send message", exact: true })
    .click();
  await expect(customer.getByText("Thanks for handling my move")).toBeVisible();
  await coord.reload();
  await coord.getByRole("button", { name: "messages", exact: true }).click();
  await expect(coord.getByText("Thanks for handling my move")).toBeVisible();
  await customer.getByRole("button", { name: "issues", exact: true }).click();
  await customer
    .getByLabel("Description", { exact: true })
    .fill("Please review a monitor scratch");
  await customer
    .getByLabel("Evidence photo", { exact: true })
    .setInputFiles({
      name: "demo-evidence.png",
      mimeType: "image/png",
      buffer: Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a8K0AAAAASUVORK5CYII=",
        "base64",
      ),
    });
  await customer
    .getByRole("button", { name: "Upload evidence", exact: true })
    .click();
  await expect(customer.getByText("1 attachment(s)")).toBeVisible();
  await customer
    .getByRole("button", { name: "Submit incident", exact: true })
    .click();
  await expect(
    customer.getByText("Incident reported", { exact: true }),
  ).toBeVisible();
  await admin.goto("/admin/incidents");
  await admin
    .getByRole("button", { name: "Review incident", exact: true })
    .click();
  await admin
    .getByLabel("Resolution / investigation notes", { exact: true })
    .fill("Reviewing pickup and delivery evidence");
  await admin.getByRole("button", { name: "Save review", exact: true }).click();
  await expect(
    admin.getByText("Incident updated", { exact: true }),
  ).toBeVisible();
  await customer.goto("/customer/profile");
  await customer.getByLabel("Name", { exact: true }).fill("Customer Updated");
  await customer
    .getByRole("button", { name: "Save profile", exact: true })
    .click();
  await expect(
    customer.getByText("Profile saved", { exact: true }),
  ).toBeVisible();
  await customer.reload();
  await expect(customer.getByLabel("Name", { exact: true })).toHaveValue(
    "Customer Updated",
  );
  await admin.goto("/customer/dashboard");
  await expect(
    admin.getByRole("heading", { name: "Hello Test", exact: true }),
  ).toBeVisible();
  await admin.goto("/coordinator/dashboard");
  await expect(
    admin.getByRole("heading", { name: "Good day, Test", exact: true }),
  ).toBeVisible();
  await customer.goto("/customer/dashboard");
  await expect(customer.getByRole("heading", { name: "Hello Customer", exact: true })).toBeVisible();
  await customer.screenshot({ path: "test-results/customer-dashboard.png", fullPage: true });
  await coord.goto("/coordinator/dashboard");
  await expect(coord.getByRole("heading", { name: "Good day, Coordinator", exact: true })).toBeVisible();
  await coord.screenshot({ path: "test-results/coordinator-dashboard.png", fullPage: true });
  await customer.goto(`/customer/moves/${moveId}`);
  await expect(
    customer.getByRole("heading", { name: "Move completed", exact: true }),
  ).toBeVisible();
  await customer.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() =>
      customer.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
    )
    .toBeTruthy();
  await customer.screenshot({
    path: "test-results/customer-mobile.png",
    fullPage: true,
  });
  await admin.goto("/admin/dashboard");
  await expect(
    admin.getByRole("heading", { name: "Your operations, at a glance", exact: true }),
  ).toBeVisible();
  await admin.screenshot({
    path: "test-results/admin-dashboard.png",
    fullPage: true,
  });
  expect(errors).toEqual([]);
  await customer.close();
  await coord.close();
  await admin.close();
}
