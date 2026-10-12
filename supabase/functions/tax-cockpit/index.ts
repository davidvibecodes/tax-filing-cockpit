import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type CreateReturnRequest = {
  tenantId: string;
  assessmentYear: string;
  actorId: string;
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}

function isCreateReturnRequest(value: unknown): value is CreateReturnRequest {
  if (!value || typeof value !== "object") return false;
  const request = value as Record<string, unknown>;
  return (
    typeof request.tenantId === "string" &&
    request.tenantId.length > 0 &&
    typeof request.assessmentYear === "string" &&
    /^[0-9]{4}-[0-9]{2}$/.test(request.assessmentYear) &&
    typeof request.actorId === "string" &&
    request.actorId.length > 0
  );
}

Deno.serve(async (request) => {
  if (request.method === "GET") {
    return json({ service: "tax-cockpit", status: "ok", version: "0.1.0" });
  }

  if (request.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (!isCreateReturnRequest(payload)) {
    return json({ error: "invalid_create_return_request" }, 422);
  }

  const { data: filing, error: filingError } = await supabase
    .from("filing_returns")
    .insert({
      tenant_id: payload.tenantId,
      assessment_year: payload.assessmentYear,
    })
    .select()
    .single();

  if (filingError) {
    console.error("filing_return_insert_failed", filingError.message);
    return json({ error: "filing_return_insert_failed" }, 500);
  }

  const { error: auditError } = await supabase
    .from("filing_audit_events")
    .insert({
      tenant_id: payload.tenantId,
      return_id: filing.id,
      actor_kind: "user",
      actor_id: payload.actorId,
      action: "filing.created",
      version: filing.version,
    });

  if (auditError) {
    console.error("filing_audit_insert_failed", auditError.message);
    await supabase.from("filing_returns").delete().eq("id", filing.id);
    return json({ error: "filing_audit_insert_failed" }, 500);
  }

  return json({ filing }, 201);
});
