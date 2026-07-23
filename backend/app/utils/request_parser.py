from fastapi import Request, HTTPException
from typing import Dict, Any


class RequestData:
    def __init__(self, body: Dict[str, Any], files: Dict[str, Any] = {}):
        self.body = body
        self.files = files


async def parse_request(
    request: Request,
) -> RequestData:
    content_type = request.headers.get("Content-Type", "")

    if "multipart/form-data" in content_type:
        try:
            form = await request.form()

            fields: dict[str, Any] = {}
            files: dict[str, Any] = {}

            for key, value in form.multi_items():
                if hasattr(value, "filename"):
                    files[key] = value
                else:
                    fields[key] = value
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid multipart/form-data")

        return RequestData(body=fields, files=files)

    elif "application/json" in content_type:
        try:
            json_data = await request.json()
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid JSON body")
        return RequestData(body=json_data, files={})

    elif "application/x-www-form-urlencoded" in content_type:
        form = await request.form()
        return RequestData(body=dict(form), files={})
    else:
        raise HTTPException(status_code=415, detail="Unsupported Content-Type")
