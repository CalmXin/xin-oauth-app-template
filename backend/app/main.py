from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.controllers.auth_controller import auth_router
from app.core.settings import env_getter

app = FastAPI(
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[env_getter.auth_frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)


def main():
    import uvicorn

    uvicorn.run(app, host='0.0.0.0', port=28001)


if __name__ == '__main__':
    main()
