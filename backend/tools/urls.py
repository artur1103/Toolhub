from django.urls import path
from .views import (
    TagScraperView,
    FormatterView,
    HashConverterView,
    JwtGeneratorView,
    TestMatrixGeneratorView,
    SiteCheckerView,
    ToolLogListView,
    ToolLogDeleteView
)

urlpatterns = [
    path('scrape-tags/', TagScraperView.as_view(), name='scrape-tags'),
    path('format/', FormatterView.as_view(), name='formatter'),
    path('hash/', HashConverterView.as_view(), name='hash-converter'),
    path('jwt/', JwtGeneratorView.as_view(), name='jwt-generator'),
    path('test-matrix/', TestMatrixGeneratorView.as_view(), name='test-matrix'),
    path('site-checker/', SiteCheckerView.as_view(), name='site-checker'),
    path("logs/", ToolLogListView.as_view(), name="logs"),
    path("logs/<int:log_id>/", ToolLogDeleteView.as_view(), name="logs-delete"),
]
