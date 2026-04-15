"""
Sets up all test fixtures for trn_full_test.py:
1. Creates 3 test auth users (Agent, Investor, Ambassador)
2. Seeds a future QA event so RSVP tests can pass
"""
import sys, os, json, urllib.request, urllib.error

sys.stdout.reconfigure(encoding="utf-8")

SUPABASE_URL = "https://qebihjqqcbovmdwzhwrj.supabase.co"
SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")  # set env var or paste temporarily
TEST_PASS = "TRN-Test-2024!"

TEST_USERS = [
    {"email": "tunmark25@gmail.com", "full_name": "Test Agent"},
    {"email": "tunmarkx@gmail.com", "full_name": "Test Investor"},
    {"email": "tunmarky@gmail.com", "full_name": "Test Ambassador"},
]

def admin_req(path, method="GET", data=None):
    body = json.dumps(data).encode() if data else None
    headers = {
        "Content-Type": "application/json",
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
        "Prefer": "return=representation",
    }
    r = urllib.request.Request(SUPABASE_URL + path, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(r, timeout=30) as resp:
            raw = resp.read()
            return (json.loads(raw) if raw else {}), resp.status
    except urllib.error.HTTPError as e:
        raw = e.read()
        return (json.loads(raw) if raw else {}), e.code

# ── 1. Create test users ──────────────────────────────────────────────────────
print("Creating test users...\n", flush=True)
for u in TEST_USERS:
    print(f"  {u['full_name']} ({u['email']})...", flush=True)
    resp, status = admin_req(
        "/auth/v1/admin/users",
        method="POST",
        data={"email": u["email"], "password": TEST_PASS, "email_confirm": True,
              "user_metadata": {"full_name": u["full_name"]}},
    )
    if status in (200, 201):
        print(f"    [PASS] Created (id={resp.get('id')})")
    elif status == 422 or "already" in str(resp).lower() or "exists" in str(resp).lower():
        print(f"    [SKIP] Already exists")
    else:
        print(f"    [FAIL] HTTP {status}: {resp}")

# ── 2. Verify logins ──────────────────────────────────────────────────────────
print("\nVerifying logins...", flush=True)
for u in TEST_USERS:
    resp, status = admin_req(
        "/auth/v1/token?grant_type=password",
        method="POST",
        data={"email": u["email"], "password": TEST_PASS},
    )
    if status == 200 and "access_token" in resp:
        print(f"  [PASS] {u['email']}")
    else:
        print(f"  [FAIL] {u['email']}: {resp.get('error_description', resp.get('msg', str(resp)))}")

# ── 3. Seed a future QA event so RSVP tests pass ─────────────────────────────
print("\nSeeding QA test event...", flush=True)

# Check if QA event already exists
check, _ = admin_req("/rest/v1/events?title=eq.TRN+QA+Test+Call&select=id")
existing = check if isinstance(check, list) else []

if existing:
    print(f"  [SKIP] QA event already exists (id={existing[0]['id']})")
else:
    resp, status = admin_req(
        "/rest/v1/events",
        method="POST",
        data={
            "title": "TRN QA Test Call",
            "event_date": "2027-01-15T18:00:00+00:00",
            "event_type": "Members Huddle",
            "speaker": "QA Test",
            "description": "Automated QA test event — safe to delete",
            "join_link": "https://zoom.us/j/00000000000",
            "timezone": "UTC",
            "target_audience": "all",
        },
    )
    if status in (200, 201):
        created = resp[0] if isinstance(resp, list) else resp
        print(f"  [PASS] Event created (id={created.get('id')})")
    else:
        print(f"  [FAIL] HTTP {status}: {resp}")

print("\nSetup complete. Run trn_full_test.py next.", flush=True)
