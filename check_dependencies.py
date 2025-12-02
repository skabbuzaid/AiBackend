import sys

def check_import(module_name):
    try:
        __import__(module_name)
        print(f"[OK] {module_name} is available.")
        return True
    except ImportError as e:
        print(f"[MISSING] {module_name} is MISSING. ({e})")
        return False

required_modules = [
    "fastapi",
    "uvicorn",
    "sqlalchemy",
    "pymysql",
    "dotenv",
    "langchain_groq",
    "duckduckgo_search"
]

print("Checking dependencies...")
missing = []
for mod in required_modules:
    if not check_import(mod):
        missing.append(mod)

if missing:
    print(f"\n[WARNING] Missing modules: {', '.join(missing)}")
    sys.exit(1)
else:
    print("\n[SUCCESS] All dependencies are installed!")
    sys.exit(0)
