from functools import wraps
from .models import ToolLog
from .utils import get_client_ip
import json

def log_tool_usage(tool_name: str):
    def decorator(view_method):

        @wraps(view_method)
        def wrapper(self, request, *args, **kwargs):
            try:
                # Ejecutar la vista normalmente
                response = view_method(self, request, *args, **kwargs)

                # Crear registro en BD
                ToolLog.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    ip_address=get_client_ip(request),
                    endpoint=request.path,
                    tool_name=tool_name,
                    request_body=json.dumps(request.data, default=str),
                    response_body=response.data if hasattr(response, "data") else str(response),
                    status_code=response.status_code if hasattr(response, "status_code") else 200,
                )
                return response

            except Exception as e:
                # Log de errores también
                ToolLog.objects.create(
                    user=request.user if request.user.is_authenticated else None,
                    ip_address=get_client_ip(request),
                    endpoint=request.path,
                    tool_name=tool_name,
                    request_body=json.dumps(request.data, default=str),
                    response_body=str(e),
                    status_code=500,
                )
                raise e

        return wrapper

    return decorator
