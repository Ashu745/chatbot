import re

def extract_product_name(user_input):
    """
    Extract a product name from the user input using basic regex.
    """
    # Simple pattern to match phrases like "compare iPhone 13" or "show me Samsung Galaxy S21"
    match = re.search(r"(?:compare|vs|show|between|of|on|for)?\s*(\b(?:[A-Z][a-z]+\s?)+\d*\b)", user_input, re.IGNORECASE)
    
    if match:
        product_name = match.group(1).strip()
        return product_name
    return None
