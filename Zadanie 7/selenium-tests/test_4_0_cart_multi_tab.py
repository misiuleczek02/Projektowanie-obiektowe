from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from conftest import FRONTEND_URL


def nav_count(driver):
    el = driver.find_element(By.CSS_SELECTOR, "[data-testid='nav-cart-count']")
    return int(el.text)


def wait_count(driver, expected, timeout=6):
    WebDriverWait(driver, timeout).until(lambda d: nav_count(d) == expected)


def add_product(driver, pid):
    driver.find_element(By.CSS_SELECTOR, "[data-testid='product-" + str(pid) + "-add']").click()


def open_products_tab(driver):
    driver.execute_script("window.open(arguments[0], '_blank');", FRONTEND_URL + "/")
    driver.switch_to.window(driver.window_handles[-1])
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='products-grid']"))
    )
    return driver.current_window_handle


def reset_app(driver):
    driver.get(FRONTEND_URL + "/")
    driver.execute_script("window.localStorage.clear();")
    driver.get(FRONTEND_URL + "/")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='products-grid']"))
    )


def test_licznik_propaguje_sie_miedzy_dwie_karty(driver, reset_backend):
    reset_app(driver)
    t1 = driver.current_window_handle
    t2 = open_products_tab(driver)

    driver.switch_to.window(t1)
    add_product(driver, 1)
    wait_count(driver, 1)

    driver.switch_to.window(t2)
    wait_count(driver, 1)

    add_product(driver, 2)
    wait_count(driver, 2)

    driver.switch_to.window(t1)
    wait_count(driver, 2)


def test_zmiana_ilosci_w_jednej_karcie_widoczna_w_drugiej(driver, reset_backend):
    reset_app(driver)
    add_product(driver, 3)
    wait_count(driver, 1)

    t1 = driver.current_window_handle
    driver.execute_script("window.open(arguments[0], '_blank');", FRONTEND_URL + "/cart")
    t2 = driver.window_handles[-1]
    driver.switch_to.window(t2)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='cart-table']"))
    )

    qty = driver.find_element(By.CSS_SELECTOR, "[data-testid='cart-qty-3']")
    qty.clear()
    qty.send_keys("5")
    qty.send_keys("\t")
    wait_count(driver, 5)

    driver.switch_to.window(t1)
    wait_count(driver, 5)


def test_usuniecie_w_jednej_karcie_zeruje_druga(driver, reset_backend):
    reset_app(driver)
    add_product(driver, 1)
    add_product(driver, 2)
    wait_count(driver, 2)

    t1 = driver.current_window_handle
    driver.execute_script("window.open(arguments[0], '_blank');", FRONTEND_URL + "/cart")
    t2 = driver.window_handles[-1]
    driver.switch_to.window(t2)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='cart-table']"))
    )

    driver.find_element(By.CSS_SELECTOR, "[data-testid='cart-clear']").click()
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='cart-empty']"))
    )

    driver.switch_to.window(t1)
    wait_count(driver, 0)


def test_trzy_karty_spojne(driver, reset_backend):
    reset_app(driver)
    t1 = driver.current_window_handle
    t2 = open_products_tab(driver)
    t3 = open_products_tab(driver)

    driver.switch_to.window(t1)
    add_product(driver, 1)
    wait_count(driver, 1)

    for h in (t2, t3):
        driver.switch_to.window(h)
        wait_count(driver, 1)

    driver.switch_to.window(t2)
    add_product(driver, 2)
    add_product(driver, 3)
    wait_count(driver, 3)

    for h in (t1, t3):
        driver.switch_to.window(h)
        wait_count(driver, 3)

    driver.switch_to.window(t3)
    add_product(driver, 1)
    wait_count(driver, 4)

    for h in (t1, t2):
        driver.switch_to.window(h)
        wait_count(driver, 4)


def test_suma_zgadza_sie_po_zmianach_z_innej_karty(driver, reset_backend):
    reset_app(driver)
    add_product(driver, 1)
    add_product(driver, 2)
    wait_count(driver, 2)

    t1 = driver.current_window_handle
    driver.execute_script("window.open(arguments[0], '_blank');", FRONTEND_URL + "/cart")
    t2 = driver.window_handles[-1]
    driver.switch_to.window(t2)
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='cart-table']"))
    )

    suma = 999.99 + 29.99
    text = driver.find_element(By.CSS_SELECTOR, "[data-testid='cart-grand-total']").text
    assert text.endswith("{:.2f}".format(suma))

    qty = driver.find_element(By.CSS_SELECTOR, "[data-testid='cart-qty-2']")
    qty.clear()
    qty.send_keys("3")
    qty.send_keys("\t")
    suma = 999.99 + 29.99 * 3
    WebDriverWait(driver, 5).until(
        lambda d: d.find_element(
            By.CSS_SELECTOR, "[data-testid='cart-grand-total']"
        ).text.endswith("{:.2f}".format(suma))
    )

    driver.switch_to.window(t1)
    wait_count(driver, 4)
    driver.get(FRONTEND_URL + "/cart")
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='cart-table']"))
    )
    text = driver.find_element(By.CSS_SELECTOR, "[data-testid='cart-grand-total']").text
    assert text.endswith("{:.2f}".format(suma))
