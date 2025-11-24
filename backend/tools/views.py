from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework import serializers
from .models import ToolLog

from django.http import HttpResponse

import csv
import io
import json
import hashlib
import bcrypt
import jwt
import ssl
import socket

from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
import yaml

import ssl
import socket
import urllib.parse
from datetime import datetime, timedelta

import csv
import io
import requests

from tools.decorators import log_tool_usage



# ==========
# 1. WEB SCRAPING DE ETIQUETAS
# ==========

def fetch_html(url):
    """Descarga HTML igual que en el script."""
    try:
        response = requests.get(url, timeout=8)
        if response.status_code == 200:
            return response.text, ""
        else:
            return None, f"HTTP {response.status_code}"
    except Exception as e:
        return None, str(e)


def count_html_tags(html, tag=None, class_name=None, element_ids=None):
    """Contador de etiquetas basado en tu script."""
    soup = BeautifulSoup(html, "html.parser")
    total = 0

    if element_ids:
        # Buscar por ID
        for eid in element_ids:
            if tag:
                elements = soup.find_all(tag, {"id": eid})
            else:
                elements = soup.find_all(id=eid)

            total += len(elements)

            if class_name and tag:
                elements = soup.find_all(tag, {"id": eid, "class": class_name})
                total += len(elements)

    elif class_name and tag:
        elements = soup.find_all(tag, {"class": class_name})
        total += len(elements)

    elif tag:
        elements = soup.find_all(tag)
        total += len(elements)

    return total

class TagScraperView(APIView):
    """
    POST:
      - urls: lista JSON
      - csv_file: archivo CSV con columna url
      - tag, class_name, ids (lista json)
      - output=json → retorna JSON
      - output=csv → retorna CSV
    """

    parser_classes = [MultiPartParser, FormParser]

    @log_tool_usage("WebScraper")
    def post(self, request):
        urls = []

        # Leer URLs desde JSON
        urls_json = request.data.get("urls")
        if urls_json:
            try:
                if isinstance(urls_json, str):
                    urls = json.loads(urls_json)
                elif isinstance(urls_json, list):
                    urls = urls_json
            except Exception:
                return Response({"detail": "El campo 'urls' no es JSON válido."}, status=400)

        # Leer URLs desde CSV
        csv_file = request.FILES.get("csv_file")
        if csv_file:
            decoded = csv_file.read().decode("utf-8")
            reader = csv.reader(io.StringIO(decoded))
            for row in reader:
                if row and row[0]:
                    urls.append(row[0].strip())

        if not urls:
            return Response({"detail": "Debes enviar URLs por JSON o CSV"}, status=400)

        # Parámetros del scraping
        tag = request.data.get("tag") or None
        class_name = request.data.get("class_name") or None

        ids_raw = request.data.get("ids")
        if ids_raw:
            try:
                element_ids = json.loads(ids_raw)
            except:
                element_ids = None
        else:
            element_ids = None

        resultados = []

        for url in urls:
            html, error = fetch_html(url)

            if html:
                count = count_html_tags(html, tag, class_name, element_ids)
                multiples = "Si" if count > 1 else "No"
            else:
                count = 0
                multiples = "No"

            resultados.append({
                "sitio": url,
                "criterio": f"tag={tag or '-'}, class={class_name or '-'}, ids={', '.join(element_ids) if element_ids else '-'}",
                "ocurrencias": count,
                "multiples": multiples,
                "error": error,
            })

        # ---- RETORNO JSON ----
        if request.data.get("output") == "json":
            return Response(resultados)

        # ---- RETORNO CSV ----
        output = io.StringIO()
        fieldnames = ["sitio", "criterio", "ocurrencias", "multiples", "error"]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        for r in resultados:
            writer.writerow(r)

        csv_data = output.getvalue()
        response = HttpResponse(csv_data, content_type="text/csv")
        response["Content-Disposition"] = 'attachment; filename="webscraper_results.csv"'

        return response


# ==========
# 2. FORMATEADOR JSON / XML / YAML
# ==========
class FormatterView(APIView):
    """
    POST:
    - input: string de entrada
    - input_type: 'json', 'xml' o 'yaml'
    Retorna el contenido formateado.
    """
    @log_tool_usage("Formatter")
    def post(self, request):
        data = request.data.get("input")
        input_type = request.data.get("input_type")

        if not data or input_type not in ["json", "xml", "yaml"]:
            return Response(
                {"detail": "Debes enviar 'input' y 'input_type' en ['json','xml','yaml']."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if input_type == "json":
                parsed = json.loads(data)
                pretty = json.dumps(parsed, indent=2, ensure_ascii=False)

            elif input_type == "xml":
                import xml.dom.minidom as minidom
                dom = minidom.parseString(data.encode("utf-8"))
                pretty = dom.toprettyxml(indent="  ")

            elif input_type == "yaml":
                parsed = yaml.safe_load(data)
                pretty = yaml.dump(parsed, sort_keys=False, allow_unicode=True)

            return Response({"formatted": pretty})

        except Exception as e:
            return Response(
                {"detail": f"Error al formatear: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


# ==========
# 3. CONVERTIDOR DE HASH (MD5, SHA256, bcrypt)
# ==========
class HashConverterView(APIView):
    """
    POST:
    - text: texto a hashear
    - bcrypt_rounds (opcional, por defecto 12)
    """
    @log_tool_usage("Hash Tool")
    def post(self, request):
        text = request.data.get("text", "")
        if not text:
            return Response(
                {"detail": "El campo 'text' es obligatorio."},
                status=status.HTTP_400_BAD_REQUEST
            )

        rounds = int(request.data.get("bcrypt_rounds", 12))
        md5_hash = hashlib.md5(text.encode()).hexdigest()
        sha256_hash = hashlib.sha256(text.encode()).hexdigest()
        bcrypt_hash = bcrypt.hashpw(text.encode(), bcrypt.gensalt(rounds)).decode()

        return Response({
            "md5": md5_hash,
            "sha256": sha256_hash,
            "bcrypt": bcrypt_hash,
        })


# ==========
# 4. GENERADOR DE TOKENS JWT
# ==========
class JwtGeneratorView(APIView):
    """
    POST:
    - payload: objeto JSON (dict) como string o como body JSON
    - secret: clave secreta
    - algorithm: 'HS256' (default) u otro soportado por PyJWT
    - expires_in: segundos hasta exp (opcional)
    """
    @log_tool_usage("JWT Generator")
    def post(self, request):
        try:
            payload = request.data.get("payload", {})
            secret = request.data.get("secret", "defaultsecret")
            expires_in = int(request.data.get("expires_in", 3600))

            # Expiración correcta
            payload["exp"] = datetime.utcnow() + timedelta(seconds=expires_in)

            token = jwt.encode(payload, secret, algorithm="HS256")

            return Response({"token": token})
        except Exception as e:
            return Response({"detail": str(e)}, status=400)


# ==========
# 5. GENERADOR DINÁMICO DE MATRICES DE PRUEBAS
# ==========
class TestMatrixGeneratorView(APIView):
    """
    Genera una matriz de pruebas combinando dimensiones.

    POST:
    {
      "dimensions": [
        { "name": "Navegador", "values": ["Chrome","Firefox"] },
        { "name": "SO", "values": ["Windows","Linux"] }
      ]
    }

    Retorna CSV:
    Caso, Navegador, SO
    """
    @log_tool_usage("Test Matrix")
    def post(self, request):
        dims = request.data.get("dimensions")
        if not dims or not isinstance(dims, list):
            return Response(
                {"detail": "Debes enviar 'dimensions' como lista."},
                status=status.HTTP_400_BAD_REQUEST
            )

        for d in dims:
            if "name" not in d or "values" not in d or not d["values"]:
                return Response(
                    {"detail": "Cada dimensión debe tener 'name' y 'values'."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Generar producto cartesiano
        from itertools import product

        names = [d["name"] for d in dims]
        values_lists = [d["values"] for d in dims]

        combinations = list(product(*values_lists))

        output = io.StringIO()
        fieldnames = ["Caso"] + names
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()

        for idx, combo in enumerate(combinations, start=1):
            row = {"Caso": idx}
            row.update(dict(zip(names, combo)))
            writer.writerow(row)

        csv_content = output.getvalue()
        response = HttpResponse(csv_content, content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="test_matrix.csv"'
        return response


# ==========
# 6. VERIFICADOR DE SITIOS (HTTP + CERTIFICADO)
# ==========


def extract_hostname(url):
    """
    Extrae el hostname del dominio (ej. https://www.google.com → www.google.com)
    """
    parsed = urllib.parse.urlparse(url)
    return parsed.hostname


def check_ssl_certificate(hostname, port=443):
    """
    Verifica el certificado SSL igual que en el script original de Arturo.
    """
    try:
        context = ssl.create_default_context()
        conn = context.wrap_socket(
            socket.socket(socket.AF_INET),
            server_hostname=hostname,
        )
        conn.settimeout(5.0)
        conn.connect((hostname, port))

        cert = conn.getpeercert()
        conn.close()

        exp_date_str = cert["notAfter"]
        exp_date = datetime.strptime(exp_date_str, "%b %d %H:%M:%S %Y %Z")
        now = datetime.utcnow()

        if exp_date < now:
            status = "VENCIDO"
        else:
            status = "VÁLIDO"

        return {
            "estado_certificado": status,
            "fecha_vencimiento": exp_date.strftime("%d-%m-%Y %H:%M:%S"),
            "error": "",
        }

    except ssl.SSLError:
        return {
            "estado_certificado": "NO VÁLIDO",
            "fecha_vencimiento": "",
            "error": "No tiene un certificado SSL válido",
        }
    except socket.gaierror:
        return {
            "estado_certificado": "ERROR",
            "fecha_vencimiento": "",
            "error": "Error DNS",
        }
    except socket.timeout:
        return {
            "estado_certificado": "ERROR",
            "fecha_vencimiento": "",
            "error": "Tiempo de conexión agotado",
        }
    except Exception as e:
        return {
            "estado_certificado": "ERROR",
            "fecha_vencimiento": "",
            "error": str(e),
        }


def check_site_accessibility(url):
    """
    Verifica si el sitio responde con código 200 (OK).
    """
    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            return "Accesible"
        else:
            return f"No accesible (HTTP {response.status_code})"
    except Exception:
        return "No accesible"

class SiteCheckerView(APIView):
    """
    POST:
    - urls: lista JSON
    - csv_file: archivo CSV con columna 'url'
    - output: "json" → regresa resultados en pantalla

    Retorna:
    - JSON si output=json
    - CSV si no se especifica
    """

    parser_classes = [MultiPartParser, FormParser]

    @log_tool_usage("Site Checker")
    def post(self, request):
        urls = []

        # ---- Leer JSON ----
        urls_json = request.data.get("urls")
        if urls_json:
            try:
                if isinstance(urls_json, str):
                    urls = json.loads(urls_json)
                elif isinstance(urls_json, list):
                    urls = urls_json
            except Exception:
                return Response(
                    {"detail": "El campo 'urls' no contiene una lista JSON válida."},
                    status=400,
                )

        # ---- Leer CSV ----
        csv_file = request.FILES.get("csv_file")
        if csv_file:
            decoded = csv_file.read().decode("utf-8")
            reader = csv.reader(io.StringIO(decoded))
            for row in reader:
                if row and row[0]:
                    urls.append(row[0].strip())

        # ---- Validación ----
        if not urls:
            return Response(
                {"detail": "Debes enviar URLs en lista o CSV."},
                status=400,
            )

        resultados = []

        for url in urls:
            hostname = extract_hostname(url)
            if not hostname:
                resultados.append(
                    {
                        "sitio": url,
                        "estado_certificado": "ERROR",
                        "fecha_vencimiento": "",
                        "accesibilidad": "URL inválida",
                        "error": "No fue posible extraer el hostname",
                    }
                )
                continue

            cert_info = check_ssl_certificate(hostname)
            accesibilidad = check_site_accessibility(url)

            resultados.append(
                {
                    "sitio": url,
                    "estado_certificado": cert_info["estado_certificado"],
                    "fecha_vencimiento": cert_info["fecha_vencimiento"],
                    "accesibilidad": accesibilidad,
                    "error": cert_info["error"],
                }
            )

        # --- RETORNO JSON si se pide ---
        if request.data.get("output") == "json":
            return Response(resultados)

        # --- RETORNO CSV por defecto ---
        output = io.StringIO()
        fieldnames = [
            "sitio",
            "estado_certificado",
            "fecha_vencimiento",
            "accesibilidad",
            "error",
        ]
        writer = csv.DictWriter(output, fieldnames=fieldnames)
        writer.writeheader()
        for r in resultados:
            writer.writerow(r)

        csv_content = output.getvalue()
        response = HttpResponse(csv_content, content_type="text/csv")
        response[
            "Content-Disposition"
        ] = 'attachment; filename="site_check_results.csv"'
        return response

# ==========
# 6. MODULO DE AUDITORIA 
# ==========

# --------- SERIALIZER --------- #
class ToolLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToolLog
        fields = "__all__"


# --------- PAGINACIÓN --------- #
class ToolLogPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


# --------- LIST VIEW --------- #
class ToolLogListView(APIView):

    def get(self, request):
        logs = ToolLog.objects.all().order_by("-created_at")

        # filtros
        tool_name = request.GET.get("tool")
        endpoint = request.GET.get("endpoint")
        user_id = request.GET.get("user")
        ip = request.GET.get("ip")

        if tool_name:
            logs = logs.filter(tool_name__icontains=tool_name)
        if endpoint:
            logs = logs.filter(endpoint__icontains=endpoint)
        if user_id:
            logs = logs.filter(user_id=user_id)
        if ip:
            logs = logs.filter(ip_address__icontains=ip)

        paginator = ToolLogPagination()
        result_page = paginator.paginate_queryset(logs, request)
        serializer = ToolLogSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)

class ToolLogDeleteView(APIView):
    def delete(self, request, log_id):
        try:
            log = ToolLog.objects.get(pk=log_id)
            log.soft_delete()
            return Response({"detail": "Registro eliminado (soft delete)."})
        except ToolLog.DoesNotExist:
            return Response({"detail": "Log no encontrado."}, status=404)