from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import hashlib

class HashGenerator(APIView):
    def post(self, request):
        text = request.data.get('text', '')
        result = {
            'md5': hashlib.md5(text.encode()).hexdigest(),
            'sha256': hashlib.sha256(text.encode()).hexdigest(),
        }
        return Response(result)

