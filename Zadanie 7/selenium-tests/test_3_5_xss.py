import json
import time
import uuid
import pytest
from selenium.common.exceptions import NoAlertPresentException, UnexpectedAlertPresentException
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import FRONTEND_URL


PAYLOADS = [
    "<script>window.__xss=true;alert('xss1')</script>",
    "<img src=x onerror=\"window.__xss=true;alert('xss2')\">",
    "\"'><svg/onload=\"window.__xss=true;alert('xss3')\">",
    "<iframe src=\"javascript:window.__xss=true;alert('xss4')\"></iframe>",
    "</script><script>window.__xss=true</script>",
    "<body onload=\"window.__xss=true\">",
    "<a href=\"javascript:window.__xss=true\">click</a>",
    "{{constructor.constructor('window.__xss=true')()}}",
]


def no_alert(driver):
    try:
        a = driver.switch_to.alert
        txt = a.text
        a.dismiss()
        pytest.fail("wyskoczyl alert: " + repr(txt))
    except NoAlertPresentException:
        pass


def no_xss_flag(driver):
    return driver.execute_script(
        "return typeof window.__xss === 'undefined' || window.__xss !== true;"
    )


def go(driver, path):
    try:
        driver.get(FRONTEND_URL + path)
    except UnexpectedAlertPresentException as e:
        pytest.fail("alert na " + path + ": " + str(e.msg))


@pytest.mark.parametrize("payload", PAYLOADS)
def test_xss_w_fullname(driver, reset_backend, payload):
    go(driver, "/register")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='register-form']"))
    )
    email = "xss_" + uuid.uuid4().hex[:8] + "@example.com"
    driver.find_element(By.CSS_SELECTOR, "[data-testid='register-fullName']").send_keys(payload)
    driver.find_element(By.CSS_SELECTOR, "[data-testid='register-email']").send_keys(email)
    driver.find_element(By.CSS_SELECTOR, "[data-testid='register-password']").send_keys("StrongPass1")
    driver.find_element(By.CSS_SELECTOR, "[data-testid='register-confirmPassword']").send_keys("StrongPass1")
    driver.find_element(By.CSS_SELECTOR, "[data-testid='register-submit']").click()

    time.sleep(1)
    no_alert(driver)
    assert no_xss_flag(driver), "payload zostal wykonany: " + repr(payload)

    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-email']").send_keys(email)
    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-password']").send_keys("StrongPass1")
    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-submit']").click()

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='account-form']"))
    )
    time.sleep(0.5)
    no_alert(driver)
    assert no_xss_flag(driver)

    value = driver.find_element(
        By.CSS_SELECTOR, "[data-testid='account-fullName']"
    ).get_attribute("value")
    assert value == payload

    scripts = driver.execute_script(
        "return Array.from(document.querySelectorAll('script'))"
        ".filter(s => s.textContent.indexOf(arguments[0]) !== -1).length;",
        payload,
    )
    assert scripts == 0


@pytest.mark.parametrize("payload", PAYLOADS)
def test_xss_w_adresie(driver, registered_user, payload):
    go(driver, "/login")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='login-form']"))
    )
    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-email']").send_keys(registered_user["email"])
    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-password']").send_keys(registered_user["password"])
    driver.find_element(By.CSS_SELECTOR, "[data-testid='login-submit']").click()

    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='account-form']"))
    )

    addr = driver.find_element(By.CSS_SELECTOR, "[data-testid='account-address']")
    addr.clear()
    addr.send_keys(payload)
    driver.find_element(By.CSS_SELECTOR, "[data-testid='account-submit']").click()

    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='account-saved']"))
    )
    time.sleep(0.4)
    no_alert(driver)
    assert no_xss_flag(driver)

    value = driver.find_element(
        By.CSS_SELECTOR, "[data-testid='account-address']"
    ).get_attribute("value")
    assert value == payload


def test_xss_w_query_string(driver, reset_backend):
    payload = "<script>window.__xss=true;alert('qs')</script>"
    go(driver, "/?" + payload)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='products-grid']"))
    )
    time.sleep(0.5)
    no_alert(driver)
    assert no_xss_flag(driver)


def test_xss_w_nazwie_produktu(driver, reset_backend):
    payload = "<img src=x onerror=\"window.__xss=true\">"
    fake = [{"id": 9999, "name": payload, "price": 1.5, "quantity": 2}]
    go(driver, "/")
    driver.execute_script(
        "window.localStorage.setItem('z7_cart_v1', arguments[0]);",
        json.dumps(fake),
    )
    go(driver, "/cart")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='cart-table']"))
    )
    time.sleep(0.4)
    no_alert(driver)
    assert no_xss_flag(driver)

    rendered = driver.find_element(By.CSS_SELECTOR, "[data-testid='cart-name-9999']").text
    assert rendered == payload
