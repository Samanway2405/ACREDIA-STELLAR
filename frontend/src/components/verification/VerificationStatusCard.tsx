import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AlertCircle, Award, CheckCircle, Lock, Shield } from 'lucide-react';

interface VerificationStatusCardProps {
  status: 'valid' | 'revoked' | null;
  title: string;
  message: string;
  revokedAt?: string | null;
}

export function VerificationStatusCard({
  status,
  title,
  message,
  revokedAt,
}: VerificationStatusCardProps) {
  if (!status) {
    return null;
  }

  if (status === 'valid') {
    return (
      <Card className="border-2 bg-white/90 p-8 shadow-xl backdrop-blur md:p-12">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="rounded-full bg-gradient-to-br from-green-100 to-emerald-100 p-8 shadow-lg">
            <CheckCircle className="h-24 w-24 text-green-600" />
          </div>
          <div className="space-y-3 text-center">
            <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
            <p className="max-w-2xl text-lg text-gray-600">{message}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-green-100 px-4 py-2 text-sm text-green-800 hover:bg-green-100">
              <Shield className="mr-2 h-4 w-4" />
              Blockchain Verified
            </Badge>
            <Badge className="bg-blue-100 px-4 py-2 text-sm text-blue-800 hover:bg-blue-100">
              <Lock className="mr-2 h-4 w-4" />
              Tamper-Proof
            </Badge>
            <Badge className="bg-teal-100 px-4 py-2 text-sm text-teal-800 hover:bg-teal-100">
              <Award className="mr-2 h-4 w-4" />
              Authentic
            </Badge>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-2 bg-white/90 p-8 shadow-xl backdrop-blur md:p-12">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="rounded-full bg-gradient-to-br from-orange-100 to-red-100 p-8 shadow-lg">
          <AlertCircle className="h-24 w-24 text-orange-600" />
        </div>
        <div className="space-y-3 text-center">
          <h2 className="text-4xl font-bold text-gray-900">{title}</h2>
          <p className="max-w-2xl text-lg text-gray-600">{message}</p>
          {revokedAt ? (
            <p className="text-sm font-medium text-gray-500">Revoked on: {revokedAt}</p>
          ) : null}
        </div>
        <Badge className="bg-orange-100 px-4 py-2 text-base text-orange-800 hover:bg-orange-100">
          ⚠️ Revoked
        </Badge>
      </div>
    </Card>
  );
}
