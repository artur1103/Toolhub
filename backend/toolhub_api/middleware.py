import json
from tools.models import ToolLog
from tools.utils import get_client_ip

class GlobalRequestLoggerMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # Solo logueamos las rutas /api/
        should_log = request.path.startswith("/api/")

        # Guardamos el body RAW del request ANTES de consumirlo
        raw_body = request.body.decode("utf-8", errors="ignore")

        response = self.get_response(request)

        if should_log:
            # Serializar body de forma segura
            try:
                body_json = json.loads(raw_body) if raw_body else {}
            except:
                body_json = raw_body  # texto plano si no es JSON

            # Serializar response de forma segura
            try:
                response_body = response.data
            except:
                try:
                    response_body = response.content.decode("utf-8")
                except:
                    response_body = str(response)

            ToolLog.objects.create(
                user=request.user if request.user.is_authenticated else None,
                ip_address=get_client_ip(request),
                endpoint=request.path,
                tool_name="__GLOBAL__",
                request_body=json.dumps(body_json, default=str),
                response_body=json.dumps(response_body, default=str),
                status_code=response.status_code,
            )

        return response
