import sys, json
sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright

BASE = "http://localhost:8080"
ADMIN_EMAIL = "jake@therealty-network.com"
ADMIN_PASS = "TRNn8npass"
TEST_PASS = "TRN-Test-2024!"
all_results = {}

def R(persona, status, section, detail):
    icons = {"PASS":"[PASS]","FAIL":"[FAIL]","PARTIAL":"[PART]"}
    msg = "  " + persona.upper() + ": " + icons[status] + " [" + section + "] " + detail
    print(msg, flush=True)
    all_results.setdefault(persona,[]).append({"status":status,"section":section,"detail":detail})

def login(pg, email, pw, persona):
    try:
        pg.goto(BASE+"/login")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(1500)
        pg.fill("input[type=email]", email)
        pg.fill("input[type=password]", pw)
        pg.keyboard.press("Enter")
        pg.wait_for_url(BASE+"/dashboard**", timeout=20000)
        R(persona,"PASS","Login","OK -> "+pg.url)
        return True
    except Exception as e:
        R(persona,"FAIL","Login",str(e)[:120])
        pg.screenshot(path="/tmp/fail_"+persona+"_login.png")
        return False

def visit(pg, persona, route, label):
    try:
        pg.goto(BASE+route)
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(1500)
        if "/login" in pg.url:
            R(persona,"FAIL",label,"Redirected to login")
            return False
        if "Something went wrong" in pg.content():
            R(persona,"FAIL",label,"Error boundary triggered")
            return False
        R(persona,"PASS",label,"Loaded OK")
        pg.screenshot(path="/tmp/"+persona+"_"+label.replace(" ","_").lower()[:22]+".png")
        return True
    except Exception as e:
        R(persona,"FAIL",label,str(e)[:100])
        return False

def check_gating(pg, persona):
    pg.goto(BASE+"/dashboard/admin")
    pg.wait_for_load_state("networkidle")
    pg.wait_for_timeout(2000)
    blocked = "Create Member" not in pg.content()
    R(persona,"PASS" if blocked else "FAIL","Admin Gate","Blocked="+str(blocked)+" url="+pg.url)
    pg.goto(BASE+"/dashboard")
    pg.wait_for_load_state("networkidle")
    sop_visible = pg.locator("a[href*='/sop']").count() > 0
    R(persona,"FAIL" if sop_visible else "PASS","SOP Sidebar","visible="+str(sop_visible))

def try_post_opportunity(pg, persona):
    try:
        pg.goto(BASE+"/dashboard/opportunities")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(2000)
        pg.screenshot(path="/tmp/"+persona+"_opps.png")
        btn = pg.locator("button").filter(has_text="Post")
        if btn.count()==0:
            btn = pg.locator("button").filter(has_text="Add")
        if btn.count()==0:
            btn = pg.locator("button").filter(has_text="New")
        if btn.count()==0:
            R(persona,"PARTIAL","Post Opportunity","No post/add/new button found")
            return
        btn.first.click()
        pg.wait_for_timeout(1500)
        dlg = pg.locator("[role=dialog]")
        if dlg.count()==0:
            R(persona,"PARTIAL","Post Opportunity","No dialog appeared")
            return
        inp = dlg.locator("input").first
        if inp.count()>0:
            inp.fill("QA "+persona.title()+" Opportunity")
        ta = dlg.locator("textarea").first
        if ta.count()>0:
            ta.fill("Test opportunity from "+persona)
        pg.locator("button[type=submit]").last.click()
        pg.wait_for_timeout(2500)
        R(persona,"PASS","Post Opportunity","Submitted")
    except Exception as e:
        R(persona,"FAIL","Post Opportunity",str(e)[:100])
        pg.screenshot(path="/tmp/fail_"+persona+"_opp.png")

def try_post_investment(pg, persona):
    try:
        pg.goto(BASE+"/dashboard/investments")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(2000)
        pg.screenshot(path="/tmp/"+persona+"_invs.png")
        btn = pg.locator("button").filter(has_text="Post")
        if btn.count()==0:
            btn = pg.locator("button").filter(has_text="List")
        if btn.count()==0:
            btn = pg.locator("button").filter(has_text="Add")
        if btn.count()==0:
            R(persona,"PARTIAL","Post Investment","No post button found")
            return
        btn.first.click()
        pg.wait_for_timeout(1500)
        dlg = pg.locator("[role=dialog]")
        if dlg.count()==0:
            R(persona,"PARTIAL","Post Investment","No dialog appeared")
            return
        inp = dlg.locator("input").first
        if inp.count()>0:
            inp.fill("QA "+persona.title()+" Listing")
        ta = dlg.locator("textarea").first
        if ta.count()>0:
            ta.fill("Test investment from "+persona)
        pg.locator("button[type=submit]").last.click()
        pg.wait_for_timeout(2500)
        R(persona,"PASS","Post Investment","Submitted")
    except Exception as e:
        R(persona,"FAIL","Post Investment",str(e)[:100])
        pg.screenshot(path="/tmp/fail_"+persona+"_inv.png")

def try_collab(pg, persona):
    try:
        pg.goto(BASE+"/dashboard/investments")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(3000)
        # Scroll down to load all listings, then look for Collaborate button
        pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        pg.wait_for_timeout(1500)
        collab_btns = pg.locator("button").filter(has_text="Collaborate")
        if collab_btns.count()==0:
            collab_btns = pg.locator("button").filter(has_text="Request Collaboration")
        if collab_btns.count()==0:
            # Listings from other users are present — try clearing type filter
            all_btns = pg.locator("button").all()
            for btn in all_btns:
                try:
                    t = btn.inner_text().strip()
                    if "All" in t or "Reset" in t:
                        btn.click()
                        pg.wait_for_timeout(1500)
                        break
                except: pass
            collab_btns = pg.locator("button").filter(has_text="Collaborate")
        if collab_btns.count()==0:
            R(persona,"PARTIAL","Collaboration Request","No Collaborate button (own listings only or no listings)")
            return
        collab_btns.first.click()
        pg.wait_for_timeout(1500)
        dlg = pg.locator("[role=dialog]")
        ta = dlg.locator("textarea").first
        if ta.count()>0:
            ta.fill("Strong network, qualified buyers ready")
        pg.locator("button[type=submit]").last.click()
        pg.wait_for_timeout(2000)
        R(persona,"PASS","Collaboration Request","Submitted")
    except Exception as e:
        R(persona,"FAIL","Collaboration Request",str(e)[:100])

def try_create_deal(pg, persona):
    try:
        pg.goto(BASE+"/dashboard/deals")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(2000)
        pg.screenshot(path="/tmp/"+persona+"_deals.png")
        btn = pg.locator("button").filter(has_text="Add")
        if btn.count()==0:
            btn = pg.locator("button").filter(has_text="New")
        if btn.count()==0:
            btn = pg.locator("button").filter(has_text="Create")
        if btn.count()==0:
            R(persona,"PARTIAL","Create Deal","No create button found")
            return
        btn.first.click()
        pg.wait_for_timeout(1500)
        dlg = pg.locator("[role=dialog]")
        if dlg.count()==0:
            R(persona,"PARTIAL","Create Deal","No dialog appeared")
            return
        inp = dlg.locator("input").first
        if inp.count()>0:
            inp.fill("QA "+persona.title()+" Deal")
        pg.locator("button[type=submit]").last.click()
        pg.wait_for_timeout(2500)
        R(persona,"PASS","Create Deal","Submitted")
        # Stage combobox lives on each deal row — wait for dialog to fully close then find it
        try:
            pg.wait_for_selector("[role=dialog]", state="hidden", timeout=5000)
            pg.wait_for_timeout(2000)
            # shadcn Select trigger has role=combobox
            stages = pg.locator("button[role='combobox']").all()
            if not stages:
                stages = pg.locator("[role=combobox]").all()
            if stages:
                stages[0].click()
                pg.wait_for_timeout(600)
                opts = pg.locator("[role=option]")
                if opts.count()>1:
                    opts.nth(1).click()
                    pg.wait_for_timeout(1000)
                    R(persona,"PASS","Update Deal Stage","Stage changed")
                else:
                    R(persona,"PARTIAL","Update Deal Stage","No stage options visible")
            else:
                R(persona,"PARTIAL","Update Deal Stage","No combobox found on deals page")
        except Exception as se:
            R(persona,"PARTIAL","Update Deal Stage",str(se)[:80])
    except Exception as e:
        R(persona,"FAIL","Create Deal",str(e)[:100])
        pg.screenshot(path="/tmp/fail_"+persona+"_deal.png")

def try_rsvp(pg, persona):
    try:
        pg.goto(BASE+"/dashboard/events")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(2000)
        pg.screenshot(path="/tmp/"+persona+"_events.png")
        going = pg.locator("button").filter(has_text="Going")
        if going.count()==0:
            going = pg.locator("button").filter(has_text="RSVP")
        if going.count()==0:
            R(persona,"PARTIAL","RSVP","No RSVP/Going button (no upcoming events)")
            return
        going.first.click()
        pg.wait_for_timeout(1500)
        R(persona,"PASS","RSVP","Submitted")
    except Exception as e:
        R(persona,"FAIL","RSVP",str(e)[:100])

def try_edit_profile(pg, persona):
    try:
        pg.goto(BASE+"/dashboard/profile")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(2000)
        pg.screenshot(path="/tmp/"+persona+"_profile.png")
        ta = pg.locator("textarea").first
        if ta.count()==0:
            R(persona,"PARTIAL","Profile Edit","No textarea found")
            return
        ta.fill("QA bio for "+persona+" automated test")
        save = pg.locator("button").filter(has_text="Save").first
        if save.count()==0:
            R(persona,"PARTIAL","Profile Edit","No Save button")
            return
        save.click()
        pg.wait_for_timeout(2000)
        R(persona,"PASS","Profile Edit","Saved")
    except Exception as e:
        R(persona,"FAIL","Profile Edit",str(e)[:100])

def try_directory(pg, persona):
    try:
        pg.goto(BASE+"/dashboard/directory")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(2000)
        pg.screenshot(path="/tmp/"+persona+"_directory.png")
        R(persona,"PASS","Directory Load","Loaded")
        search = pg.locator("input[placeholder*='earch' i]").first
        if search.count()>0:
            search.fill("a")
            pg.wait_for_timeout(1500)
            R(persona,"PASS","Directory Search","Filter applied")
            search.clear()
        else:
            R(persona,"PARTIAL","Directory Search","No search input found")
        link = pg.locator("a[href*='/dashboard/member/']").first
        if link.count()>0:
            link.click()
            pg.wait_for_timeout(2000)
            R(persona,"PASS" if "/member/" in pg.url else "PARTIAL","Member Profile View","URL="+pg.url)
        else:
            R(persona,"PARTIAL","Member Profile View","No member links in directory")
    except Exception as e:
        R(persona,"FAIL","Directory",str(e)[:100])

def click_admin_tab(pg, text):
    pg.goto(BASE+"/dashboard/admin")
    pg.wait_for_load_state("networkidle")
    pg.wait_for_timeout(1000)
    pg.locator("button").filter(has_text=text).first.click()
    pg.wait_for_timeout(2000)

# ======================================================
# PHASE 1: ADMIN (JAKE)
# ======================================================
print("\n"+"="*60)
print("PHASE 1: ADMIN (JAKE)")
print("="*60, flush=True)

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_context(viewport={"width":1280,"height":900}).new_page()
    pg.set_default_timeout(25000)

    if login(pg, ADMIN_EMAIL, ADMIN_PASS, "admin"):
        visit(pg,"admin","/dashboard","Dashboard")

        # Admin panel check
        pg.goto(BASE+"/dashboard/admin")
        pg.wait_for_load_state("networkidle")
        pg.wait_for_timeout(2000)
        pg.screenshot(path="/tmp/admin_panel.png")
        has_create = "Create Member" in pg.content()
        R("admin","PASS" if has_create else "FAIL","Admin Panel Access","Create Member button present="+str(has_create))

        # Create 3 test accounts
        test_accounts = [
            ("Test Agent","tunmark25@gmail.com"),
            ("Test Investor","tunmarkx@gmail.com"),
            ("Test Ambassador","tunmarky@gmail.com"),
        ]
        for name,email in test_accounts:
            try:
                pg.goto(BASE+"/dashboard/admin")
                pg.wait_for_load_state("networkidle")
                pg.wait_for_timeout(1000)
                pg.locator("button").filter(has_text="Create Member").click()
                pg.wait_for_timeout(1000)
                dlg = pg.locator("[role=dialog]")
                inputs = dlg.locator("input").all()
                if len(inputs)>=3:
                    inputs[0].fill(name)
                    inputs[1].fill(email)
                    inputs[2].fill(TEST_PASS)
                    pg.locator("button").filter(has_text="Create Member Account").click()
                    pg.wait_for_timeout(3000)
                    R("admin","PASS","Create "+name,"Submitted")
                else:
                    R("admin","PARTIAL","Create "+name,"Only "+str(len(inputs))+" inputs in dialog")
                    pg.keyboard.press("Escape")
            except Exception as e:
                R("admin","FAIL","Create "+name,str(e)[:100])
                try:
                    pg.keyboard.press("Escape")
                except:
                    pass

        # Approve test accounts
        for name,email in test_accounts:
            try:
                pg.goto(BASE+"/dashboard/admin")
                pg.wait_for_load_state("networkidle")
                pg.wait_for_timeout(1000)
                pg.locator("input[placeholder='Search members...']").fill(name.split()[-1])
                pg.wait_for_timeout(1500)
                # Edit button is a ghost icon-only button (Pencil icon) — last small button in each row
                edit_btns = pg.locator("button[class*='h-8'][class*='w-8']").all()
                if not edit_btns:
                    edit_btns = pg.locator("button svg[class*='lucide-pencil']").locator("..").all()
                if not edit_btns:
                    # fallback: last button in the member card
                    edit_btns = pg.locator(".bg-card.border.border-border.rounded-xl button").all()
                if edit_btns:
                    edit_btns[-1].click()
                    pg.wait_for_timeout(1000)
                    pg.locator("[role=combobox]").first.click()
                    pg.wait_for_timeout(500)
                    pg.locator("[role=option]").filter(has_text="approved").click()
                    pg.wait_for_timeout(500)
                    pg.locator("button").filter(has_text="Save").click()
                    pg.wait_for_timeout(2000)
                    R("admin","PASS","Approve "+name,"-> Approved")
                else:
                    R("admin","PARTIAL","Approve "+name,"No edit button in search results")
                try:
                    pg.keyboard.press("Escape")
                except:
                    pass
            except Exception as e:
                R("admin","FAIL","Approve "+name,str(e)[:100])
                try:
                    pg.keyboard.press("Escape")
                except:
                    pass

        # Members search
        try:
            pg.goto(BASE+"/dashboard/admin")
            pg.wait_for_load_state("networkidle")
            pg.wait_for_timeout(1000)
            pg.locator("input[placeholder='Search members...']").fill("Jake")
            pg.wait_for_timeout(1500)
            count = pg.locator(".bg-card.border.border-border.rounded-xl").count()
            R("admin","PASS" if count>0 else "PARTIAL","Members Search",str(count)+" results for Jake")
        except Exception as e:
            R("admin","FAIL","Members Search",str(e)[:100])

        # Standard tabs
        for tab_text,label in [
            ("Opportunities","Opportunities Tab"),
            ("Investments","Investments Tab"),
            ("Collaborations","Collaborations Tab"),
            ("Deals","Deals Tab"),
            ("Updates","Updates Tab"),
            ("Community","Community Tab"),
        ]:
            try:
                click_admin_tab(pg, tab_text)
                pg.screenshot(path="/tmp/admin_tab_"+tab_text.lower()[:8]+".png")
                R("admin","PASS",label,"Loaded")
            except Exception as e:
                R("admin","FAIL",label,str(e)[:100])

        # Introductions tab
        try:
            pg.goto(BASE+"/dashboard/admin")
            pg.wait_for_load_state("networkidle")
            pg.wait_for_timeout(1000)
            pg.locator("button").filter(has_text="Intro").first.click()
            pg.wait_for_timeout(2000)
            R("admin","PASS","Introductions Tab","Loaded")
        except Exception as e:
            R("admin","FAIL","Introductions Tab",str(e)[:100])

        # Events tab + create event
        try:
            pg.goto(BASE+"/dashboard/admin")
            pg.wait_for_load_state("networkidle")
            pg.wait_for_timeout(1000)
            tab = pg.locator("button").filter(has_text="Call")
            if tab.count()==0:
                tab = pg.locator("button").filter(has_text="Event")
            tab.first.click()
            pg.wait_for_timeout(2000)
            R("admin","PASS","Events Tab","Loaded")
            add = pg.locator("button").filter(has_text="Create Event")
            pg.wait_for_timeout(1000)
            if add.count()==0:
                add = pg.locator("button").filter(has_text="Add")
            if add.count()==0:
                add = pg.locator("button").filter(has_text="New")
            if add.count()>0:
                add.first.click()
                pg.wait_for_timeout(1000)
                dlg = pg.locator("[role=dialog]")
                if dlg.count()>0:
                    inputs = dlg.locator("input").all()
                    if inputs:
                        inputs[0].fill("TRN QA Test Call")
                    di = dlg.locator("input[type=date], input[type=datetime-local]").first
                    if di.count()>0:
                        di.fill("2026-05-01")
                    ta = dlg.locator("textarea").first
                    if ta.count()>0:
                        ta.fill("QA test event")
                    pg.locator("button[type=submit]").last.click()
                    pg.wait_for_timeout(2000)
                    R("admin","PASS","Create Event","Submitted")
                else:
                    R("admin","PARTIAL","Create Event","No dialog after clicking Add")
            else:
                R("admin","PARTIAL","Create Event","No Add/New/Create button in Events tab")
        except Exception as e:
            R("admin","FAIL","Events Tab",str(e)[:100])

        # Partners tab + create partner
        try:
            click_admin_tab(pg, "Partners")
            R("admin","PASS","Partners Tab","Loaded")
            add = pg.locator("button").filter(has_text="Add")
            if add.count()==0:
                add = pg.locator("button").filter(has_text="New")
            if add.count()==0:
                add = pg.locator("button").filter(has_text="Create")
            if add.count()>0:
                add.first.click()
                pg.wait_for_timeout(1000)
                dlg = pg.locator("[role=dialog]")
                if dlg.count()>0:
                    inputs = dlg.locator("input").all()
                    if inputs:
                        inputs[0].fill("QA Test Legal Firm")
                    ta = dlg.locator("textarea").first
                    if ta.count()>0:
                        ta.fill("QA test partner")
                    pg.locator("button[type=submit]").last.click()
                    pg.wait_for_timeout(2000)
                    R("admin","PASS","Create Partner","Submitted")
                else:
                    R("admin","PARTIAL","Create Partner","No dialog")
            else:
                R("admin","PARTIAL","Create Partner","No Add button in Partners tab")
        except Exception as e:
            R("admin","FAIL","Partners/Create",str(e)[:100])

        # Feature toggle on opportunities
        try:
            click_admin_tab(pg,"Opportunities")
            feat = pg.locator("button").filter(has_text="Feature").first
            if feat.count()>0:
                feat.click()
                pg.wait_for_timeout(1000)
                R("admin","PASS","Feature Toggle","Toggled")
            else:
                R("admin","PARTIAL","Feature Toggle","No Feature button visible (no data or different UI)")
        except Exception as e:
            R("admin","FAIL","Feature Toggle",str(e)[:100])

        # All member routes as admin
        visit(pg,"admin","/dashboard/sop","SOP Library")
        for route,label in [
            ("/dashboard/directory","Directory"),
            ("/dashboard/map","Network Map"),
            ("/dashboard/opportunities","Opportunities"),
            ("/dashboard/investments","Investments"),
            ("/dashboard/introductions","Introductions"),
            ("/dashboard/deals","Deals"),
            ("/dashboard/events","Events"),
            ("/dashboard/partners","Partners"),
            ("/dashboard/videos","Video Library"),
            ("/dashboard/referral-templates","Referral Templates"),
            ("/dashboard/education","Education Hub"),
            ("/dashboard/profile","Profile"),
        ]:
            visit(pg,"admin",route,label)

        try_edit_profile(pg,"admin")

    b.close()

# ======================================================
# PHASE 2: MEMBER (AGENT)
# ======================================================
print("\n"+"="*60)
print("PHASE 2: MEMBER (AGENT)")
print("="*60, flush=True)

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_context(viewport={"width":1280,"height":900}).new_page()
    pg.set_default_timeout(25000)
    if login(pg,"tunmark25@gmail.com",TEST_PASS,"agent"):
        check_gating(pg,"agent")
        visit(pg,"agent","/dashboard","Dashboard")
        try_directory(pg,"agent")
        visit(pg,"agent","/dashboard/map","Network Map")
        try_post_opportunity(pg,"agent")
        try_post_investment(pg,"agent")
        visit(pg,"agent","/dashboard/introductions","Introductions")
        try_create_deal(pg,"agent")
        try_rsvp(pg,"agent")
        visit(pg,"agent","/dashboard/partners","Partners")
        try_edit_profile(pg,"agent")
        visit(pg,"agent","/dashboard/videos","Video Library")
        visit(pg,"agent","/dashboard/referral-templates","Referral Templates")
        visit(pg,"agent","/dashboard/education","Education Hub")
    b.close()

# ======================================================
# PHASE 3: INVESTOR
# ======================================================
print("\n"+"="*60)
print("PHASE 3: INVESTOR")
print("="*60, flush=True)

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_context(viewport={"width":1280,"height":900}).new_page()
    pg.set_default_timeout(25000)
    if login(pg,"tunmarkx@gmail.com",TEST_PASS,"investor"):
        check_gating(pg,"investor")
        visit(pg,"investor","/dashboard","Dashboard")
        try_edit_profile(pg,"investor")
        try_post_investment(pg,"investor")
        try_collab(pg,"investor")
        try_post_opportunity(pg,"investor")
        try_create_deal(pg,"investor")
        try_directory(pg,"investor")
    b.close()

# ======================================================
# PHASE 4: AMBASSADOR
# ======================================================
print("\n"+"="*60)
print("PHASE 4: AMBASSADOR")
print("="*60, flush=True)

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    pg = b.new_context(viewport={"width":1280,"height":900}).new_page()
    pg.set_default_timeout(25000)
    if login(pg,"tunmarky@gmail.com",TEST_PASS,"ambassador"):
        check_gating(pg,"ambassador")
        visit(pg,"ambassador","/dashboard","Dashboard")
        # Referral templates - check all 4 types present
        try:
            pg.goto(BASE+"/dashboard/referral-templates")
            pg.wait_for_load_state("networkidle")
            pg.wait_for_timeout(2000)
            pg.screenshot(path="/tmp/ambassador_templates.png")
            c = pg.content()
            found = [t for t in ["Residential","Commercial","Ambassador","Off-Plan"] if t in c]
            R("ambassador","PASS" if len(found)>=3 else "PARTIAL","Referral Templates","Types found: "+str(found))
        except Exception as e:
            R("ambassador","FAIL","Referral Templates",str(e)[:100])
        # Introductions page
        try:
            pg.goto(BASE+"/dashboard/introductions")
            pg.wait_for_load_state("networkidle")
            pg.wait_for_timeout(2000)
            pg.screenshot(path="/tmp/ambassador_intros.png")
            tabs = pg.locator("[role=tab]").count()
            R("ambassador","PASS","Introductions Page","Loaded, tab count="+str(tabs))
        except Exception as e:
            R("ambassador","FAIL","Introductions",str(e)[:100])
        try_post_opportunity(pg,"ambassador")
        try_create_deal(pg,"ambassador")
        visit(pg,"ambassador","/dashboard/education","Education Hub")
        try_rsvp(pg,"ambassador")
    b.close()

# ======================================================
# FINAL REPORT
# ======================================================
print("\n\n"+"="*60)
print("FINAL QA REPORT - TRN PORTAL")
print("="*60, flush=True)

gp=gf=gx=0
for persona,res in all_results.items():
    pp=[r for r in res if r["status"]=="PASS"]
    ff=[r for r in res if r["status"]=="FAIL"]
    xx=[r for r in res if r["status"]=="PARTIAL"]
    gp+=len(pp); gf+=len(ff); gx+=len(xx)
    print("\n--- "+persona.upper()+" --- "+str(len(pp))+" PASS / "+str(len(ff))+" FAIL / "+str(len(xx))+" PARTIAL")
    for r in res:
        m={"PASS":"[PASS]","FAIL":"[FAIL]","PARTIAL":"[PART]"}[r["status"]]
        print("  "+m+" "+r["section"]+": "+r["detail"])

print("\nGRAND TOTAL: "+str(gp)+" PASS | "+str(gf)+" FAIL | "+str(gx)+" PARTIAL")

with open("/tmp/trn_full_results.json","w",encoding="utf-8") as f:
    json.dump(all_results,f,indent=2,ensure_ascii=False)
print("Results saved to /tmp/trn_full_results.json")
