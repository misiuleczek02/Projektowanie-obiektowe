import os
import time
import uuid
import pytest
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions


FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000").rstrip("/")
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:5000").rstrip("/")
HEADLESS = os.environ.get("HEADLESS", "1").lower() in ("1", "true", "yes")
BROWSER = os.environ.get("BROWSER", "chrome").lower()


def _wait_for(url, timeout=30):
    end = time.time() + timeout
    last = None
    while time.time() < end:
        try:
            r = requests.get(url, timeout=2)
            if r.status_code < 500:
                return
        except Exception as e:
            last = e
        time.sleep(0.5)
    raise RuntimeError("nie udalo sie polaczyc z " + url + ": " + str(last))


@pytest.fixture(scope="session", autouse=True)
def require_app():
    try:
        _wait_for(BACKEND_URL + "/api/health", timeout=5)
    except Exception as e:
        pytest.skip("backend nie chodzi: " + str(e))
    try:
        _wait_for(FRONTEND_URL, timeout=5)
    except Exception as e:
        pytest.skip("frontend nie chodzi: " + str(e))


def _make_driver():
    if BROWSER == "firefox":
        opts = FirefoxOptions()
        if HEADLESS:
            opts.add_argument("-headless")
        return webdriver.Firefox(options=opts)

    opts = ChromeOptions()
    if HEADLESS:
        opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=1280,900")
    opts.set_capability("goog:loggingPrefs", {"browser": "ALL"})
    return webdriver.Chrome(options=opts)


@pytest.fixture
def driver():
    d = _make_driver()
    try:
        yield d
    finally:
        try:
            d.quit()
        except Exception:
            pass


@pytest.fixture
def reset_backend():
    try:
        requests.post(BACKEND_URL + "/api/_test/reset", timeout=3)
    except Exception:
        pass


@pytest.fixture
def unique_user(reset_backend):
    s = uuid.uuid4().hex[:10]
    return {
        "email": "user_" + s + "@example.com",
        "password": "SuperSecret123",
        "fullName": "User " + s,
    }


@pytest.fixture
def registered_user(unique_user):
    r = requests.post(
        BACKEND_URL + "/api/register",
        json={
            "email": unique_user["email"],
            "password": unique_user["password"],
            "fullName": unique_user["fullName"],
        },
        timeout=5,
    )
    assert r.status_code == 201, r.text
    return unique_user
