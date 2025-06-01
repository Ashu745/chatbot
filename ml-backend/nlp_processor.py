import re

def extract_product_name(user_input):
    """
    Extract a single product name from the user input using regex.
    This is designed for comparing one product across websites.
    """
    # Basic pattern: capture brand + model (e.g., Samsung Galaxy S21, iPhone 14, etc.)
    pattern = r"\b(?:Apple|Samsung|OnePlus|Vivo|Oppo|Realme|Redmi|Motorola|Nokia|Mi|Google|Asus|Lenovo|Infinix|Lava|boat)\s(?:[A-Za-z0-9]+(?:\s)?)+"

    match = re.search(pattern, user_input, re.IGNORECASE)
    if match:
        return match.group().strip()
    
    return None
