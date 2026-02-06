from pydantic import Field
from pydantic_settings import BaseSettings


class EnvGetter(BaseSettings):
    """读取环境变量"""

    # 关于 Casdoor 的配置
    auth_endpoint: str = Field(...)
    auth_client_id: str = Field(...)
    auth_client_secret: str = Field(...)
    auth_redirect_uri: str = Field(...)
    auth_frontend_url: str = Field(...)
    auth_scope: str = 'openid profile email'
    auth_state_key_name: str = 'oauth_state'

    # 关于项目的配置
    app_secret_key: str = Field(...)


env_getter = EnvGetter()
