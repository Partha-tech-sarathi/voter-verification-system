from rest_framework import serializers
from .models import Voter, Verification, BlockchainAudit


class VoterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voter
        fields = "__all__"


class VerificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Verification
        fields = "__all__"


class BlockchainAuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlockchainAudit
        fields = "__all__"