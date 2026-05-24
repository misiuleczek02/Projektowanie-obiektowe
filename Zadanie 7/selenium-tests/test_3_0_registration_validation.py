import uuid
import pytest
import requests
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import FRONTEND_URL, BACKEND_URL


def open_register(driver):
    driver.get(FRONTEND_URL + "/register")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='register-form']"))
    )


def fill(driver, field, value):
    el = driver.find_element(By.CSS_SELECTOR, "[data-testid='register-" + field + "']")
    el.clear()
    el.send_keys(value)


def submit(driver):
    driver.find_element(By.CSS_SELECTOR, "[data-testid='register-submit']").click()


def get_error(driver):
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='register-error']"))
    )
    return driver.find_element(By.CSS_SELECTOR, "[data-testid='register-error']").text


def test_puste_pola_dajacy_blad(driver, reset_backend):
    open_register(driver)
    submit(driver)
    assert "required" in get_error(driver).lower()
    assert driver.current_url.rstrip("/").endswith("/register")


@pytest.mark.parametrize("missing", ["fullName", "email", "password", "confirmPassword"])
def test_brakujace_pole(driver, reset_backend, missing):
    open_register(driver)
    values = {
        "fullName": "Jan Kowalski",
        "email": "ok_" + uuid.uuid4().hex[:6] + "@example.com",
        "password": "StrongPass1",
        "confirmPassword": "StrongPass1",
    }
    values[missing] = ""
    for k, v in values.items():
        fill(driver, k, v)
    submit(driver)

    assert "required" in get_error(driver).lower()
    assert "/register" in driver.current_url


@pytest.mark.parametrize("bad_email", [
    "plainstring",
    "noatsymbol.example.com",
    "missingdomain@",
    "@missinglocal.com",
    "spaces in@example.com",
    "two@@example.com",
    "trailingdot@example.",
    "user@.com",
])
def test_zly_email(driver, reset_backend, bad_email):
    open_register(driver)
    fill(driver, "fullName", "Jan Kowalski")
    fill(driver, "email", bad_email)
    fill(driver, "password", "StrongPass1")
    fill(driver, "confirmPassword", "StrongPass1")
    submit(driver)

    assert "email" in get_error(driver).lower()
    assert "/register" in driver.current_url

    r = requests.post(
        BACKEND_URL + "/api/register",
        json={"email": bad_email, "password": "StrongPass1", "fullName": "Jan"},
        timeout=5,
    )
    assert r.status_code == 400, r.text


def test_hasla_sie_nie_zgadzaja(driver, reset_backend):
    open_register(driver)
    fill(driver, "fullName", "Jan Kowalski")
    fill(driver, "email", "jan_" + uuid.uuid4().hex[:6] + "@example.com")
    fill(driver, "password", "StrongPass1")
    fill(driver, "confirmPassword", "WrongPass1")
    submit(driver)
    assert "match" in get_error(driver).lower()


def test_za_krotkie_haslo(driver, reset_backend):
    open_register(driver)
    fill(driver, "fullName", "Jan Kowalski")
    fill(driver, "email", "krotkie_" + uuid.uuid4().hex[:6] + "@example.com")
    fill(driver, "password", "12345")
    fill(driver, "confirmPassword", "12345")
    submit(driver)
    txt = get_error(driver).lower()
    assert "6 characters" in txt or "password" in txt


def test_poprawna_rejestracja(driver, reset_backend):
    open_register(driver)
    email = "ok_" + uuid.uuid4().hex[:8] + "@example.com"
    fill(driver, "fullName", "Jan Kowalski")
    fill(driver, "email", email)
    fill(driver, "password", "StrongPass1")
    fill(driver, "confirmPassword", "StrongPass1")
    submit(driver)

    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='register-success']"))
    )
    WebDriverWait(driver, 5).until(lambda d: d.current_url.rstrip("/").endswith("/login"))

    r = requests.post(
        BACKEND_URL + "/api/login",
        json={"email": email, "password": "StrongPass1"},
        timeout=5,
    )
    assert r.status_code == 200, r.text
