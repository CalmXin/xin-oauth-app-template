from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, HTTPException
from fastapi.params import Query
from starlette.responses import RedirectResponse, JSONResponse

from app.core.constants import HttpCodeEnum
from app.core.settings import env_getter
from app.utils.auth_util import make_state, set_state_cache, verify_state
from app.utils.jwt_util import JwtUtil

auth_router = APIRouter(prefix='/auth')


@auth_router.get('/login')
async def login():
    """跳转到 Casdoor 授权页面"""

    state = make_state()
    await set_state_cache(state)

    params = urlencode({
        'client_id': env_getter.auth_client_id,
        'response_type': 'code',
        'redirect_uri': env_getter.auth_redirect_uri,
        'scope': env_getter.auth_scope,
        'state': state,  # 可用于防 CSRF，实际项目应随机生成并校验
    })

    auth_url = f"{env_getter.auth_endpoint}/login/oauth/authorize?{params}"

    return RedirectResponse(auth_url)


@auth_router.get('/callback')
async def callback(
        code: str = Query(...),
        state: str = Query(...),
):
    """处理 Casdoor 回调，换取 access_token 和 id_token"""

    if not await verify_state(state):
        raise HTTPException(status_code=HttpCodeEnum.BAD_REQUEST.value, detail="Invalid or missing state")

    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{env_getter.auth_endpoint}/api/login/oauth/access_token", data={
            "grant_type": "authorization_code",
            "client_id": env_getter.auth_client_id,
            "client_secret": env_getter.auth_client_secret,
            "code": code,
            "redirect_uri": env_getter.auth_redirect_uri,
        })

    if resp.status_code != 200:
        raise HTTPException(status_code=HttpCodeEnum.BAD_REQUEST.value, detail="Failed to fetch token")

    token_data = resp.json()
    access_token = token_data.get("access_token")
    id_token = token_data.get("id_token")  # JWT 格式，包含用户信息

    # 可选：验证并解析 id_token
    try:
        decoded = await JwtUtil().verify_jwt_token(id_token)
        user_info = {
            "sub": decoded.get("sub"),
            "name": decoded.get("name"),
            "email": decoded.get("email"),
            "avatar": decoded.get("avatar")
        }
    except Exception as e:
        raise HTTPException(status_code=HttpCodeEnum.UNAUTHORIZED.value, detail=f"Invalid ID token: {e}")

    # 这里你可以设置 session、JWT cookie、或返回前端 token
    return JSONResponse({
        "user": user_info,
        "access_token": access_token,
        "id_token": id_token
    })
