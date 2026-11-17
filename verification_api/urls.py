from django.urls import path
from . import views

urlpatterns = [
    path(
        "status/",
        views.api_status
    ),

    path(
        "voters/",
        views.voters_list
    ),

    path(
        "verifications/",
        views.verification_list
    ),

    path(
        "blockchain/",
        views.blockchain_list
    ),

    path(
        "verify/",
        views.verify_voter
    ),

    path(
        "fallback/request-otp/",
        views.request_fallback_otp
    ),

    path(
        "fallback/verify-otp/",
        views.verify_fallback_otp
    ),
    path(
    "dashboard/summary/",
    views.dashboard_summary
),
path(
    "verifications/<str:verification_id>/",
    views.verification_detail
),
path(
    "blockchain/validate/",
    views.validate_blockchain
),
]