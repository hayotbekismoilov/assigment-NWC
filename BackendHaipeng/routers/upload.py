import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from fastapi.responses import FileResponse
from models import User
from auth import admin_required

router = APIRouter(prefix="/api/upload", tags=["Upload"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"}
MAX_SIZE = 10 * 1024 * 1024  # 10 MB


@router.post("")
async def upload_image(
    file: UploadFile = File(...),
    _: User = Depends(admin_required),
):
    # Validate extension
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"Faqat rasm fayllari ruxsat etilgan: {', '.join(ALLOWED_EXTENSIONS)}")

    # Read file
    content = await file.read()
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="Fayl hajmi 10 MB dan oshmasligi kerak")

    # Save with unique name
    filename = f"{uuid.uuid4().hex[:12]}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(content)

    return {
        "filename": filename,
        "url": f"/api/upload/files/{filename}",
        "size": len(content),
    }


@router.post("/multiple")
async def upload_multiple(
    files: list[UploadFile] = File(...),
    _: User = Depends(admin_required),
):
    results = []
    for file in files:
        ext = os.path.splitext(file.filename or "")[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            continue

        content = await file.read()
        if len(content) > MAX_SIZE:
            continue

        filename = f"{uuid.uuid4().hex[:12]}{ext}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(content)

        results.append({
            "filename": filename,
            "url": f"/api/upload/files/{filename}",
            "size": len(content),
        })

    return {"files": results}


@router.get("/files/{filename}")
async def get_file(filename: str):
    filepath = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="Fayl topilmadi")
    return FileResponse(filepath)
