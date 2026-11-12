import sys
import os

# Add project root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import uvicorn

if __name__ == "__main__":
    print("Starting WCD Protection Intelligence Backend on http://127.0.0.1:8000...")
    print("OpenAPI Docs available at http://127.0.0.1:8000/api/v1/docs")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
