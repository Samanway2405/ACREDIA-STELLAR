import { useCallback, useEffect, useRef, useState } from 'react';
import { extractTokenFromQrPayload } from '@/lib/verification';

export interface CredentialData {
  token_id: string;
  ipfs_hash?: string | null;
  blockchain_hash?: string | null;
  metadata?: {
    credentialData?: {
      studentName?: string;
      credentialType?: string;
      degree?: string;
      major?: string;
      gpa?: string;
      issueDate?: string;
      institutionName?: string;
      subjects?: Array<{
        name?: string;
        marks?: string;
        maxMarks?: string;
        grade?: string;
      }>;
    };
  };
  issued_at: string;
  revoked: boolean;
  revoked_at: string | null;
  student_wallet_address?: string;
  issuer_wallet_address?: string;
  institution: {
    name: string;
  } | null;
}

export type ScanState = 'idle' | 'requesting' | 'scanning' | 'success' | 'permission-denied' | 'no-camera' | 'invalid' | 'unsupported' | 'error';

export const QR_READER_ID = 'credential-qr-reader';

export function useCredentialVerification() {
  const scannerRef = useRef<any>(null);

  const [loading, setLoading] = useState(true);
  const [credential, setCredential] = useState<CredentialData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'valid' | 'invalid' | 'revoked' | null>(null);
  const [manualToken, setManualToken] = useState('');
  const [scanMode, setScanMode] = useState(false);
  const [scanState, setScanState] = useState<ScanState>('idle');
  const [scanMessage, setScanMessage] = useState('Scan the credential QR code to verify it instantly.');

  const stopScanner = useCallback(async () => {
    const scanner = scannerRef.current;

    if (!scanner) {
      return;
    }

    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch (err) {
      console.warn('Unable to stop QR scanner:', err);
    }

    try {
      await scanner.clear();
    } catch (err) {
      console.warn('Unable to clear QR scanner:', err);
    }

    scannerRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      void stopScanner();
    };
  }, [stopScanner]);

  useEffect(() => {
    if (!scanMode) {
      void stopScanner();
      setScanState('idle');
      setScanMessage('Scan the credential QR code to verify it instantly.');
    }
  }, [scanMode, stopScanner]);

  const verifyCredential = useCallback(async (token: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/verify/${encodeURIComponent(token)}`);
      const payload = await response.json();

      if (!response.ok || !payload?.success || !payload?.credential) {
        throw new Error(payload?.error || 'Credential not found. The token ID may be invalid.');
      }

      const safe = payload.credential;
      const transformedData: CredentialData = {
        token_id: safe.tokenId,
        issued_at: safe.issuedAt,
        revoked: Boolean(safe.revoked),
        revoked_at: safe.revokedAt || null,
        institution: safe.institutionName ? { name: safe.institutionName } : null,
        metadata: {
          credentialData: {
            credentialType: safe.credentialType || undefined,
            degree: safe.degree || undefined,
            major: safe.major || undefined,
            issueDate: safe.issueDate || undefined,
            institutionName: safe.institutionName || undefined,
          },
        },
      };

      setCredential(transformedData);
      setVerificationStatus(safe.revoked ? 'revoked' : 'valid');
    } catch (err: any) {
      setError(err.message || 'Failed to verify credential');
      setVerificationStatus('invalid');
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyToken = useCallback((token: string) => {
    const cleanedToken = token.trim();

    if (!cleanedToken) {
      return;
    }

    window.history.pushState({}, '', `/verify?token=${encodeURIComponent(cleanedToken)}`);
    void verifyCredential(cleanedToken);
  }, [verifyCredential]);

  const startScanner = useCallback(async () => {
    if (!scanMode) {
      setScanMode(true);
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setScanState('unsupported');
      setScanMessage('This browser does not support camera scanning. Enter the token ID manually.');
      return;
    }

    setScanState('requesting');
    setScanMessage('Waiting for camera permission...');
    await stopScanner();

    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      const cameras = await Html5Qrcode.getCameras();

      if (!cameras.length) {
        setScanState('no-camera');
        setScanMessage('No camera was found on this device. Enter the token ID manually.');
        return;
      }

      const readerElement = document.getElementById(QR_READER_ID);

      if (!readerElement) {
        setScanState('error');
        setScanMessage('The scanner could not be initialized. Please try again.');
        return;
      }

      const preferredCamera = cameras.find((camera) => /back|rear|environment/i.test(camera.label)) || cameras[0];
      const scanner = new Html5Qrcode(QR_READER_ID, false);
      scannerRef.current = scanner;
      setScanState('scanning');
      setScanMessage('Point your camera at the credential QR code.');

      await scanner.start(
        preferredCamera.id,
        {
          fps: 10,
          qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdge * 0.72);
            return { width: qrboxSize, height: qrboxSize };
          },
          aspectRatio: 1,
        },
        async (decodedText: string) => {
          const scannedToken = extractTokenFromQrPayload(decodedText);

          if (!scannedToken) {
            setScanState('invalid');
            setScanMessage('This QR code does not contain a valid Acredia verification URL or token ID.');
            return;
          }

          setScanState('success');
          setScanMessage('QR code found. Loading the verification report...');
          await stopScanner();
          verifyToken(scannedToken);
        },
        () => undefined
      );
    } catch (err: any) {
      const errorName = err?.name || '';
      const errorMessage = String(err?.message || err || '');

      if (errorName === 'NotAllowedError' || errorMessage.toLowerCase().includes('permission')) {
        setScanState('permission-denied');
        setScanMessage('Camera permission was denied. Allow camera access in your browser settings or enter the token ID manually.');
        return;
      }

      if (errorName === 'NotFoundError' || errorMessage.toLowerCase().includes('not found')) {
        setScanState('no-camera');
        setScanMessage('No camera was found on this device. Enter the token ID manually.');
        return;
      }

      setScanState('error');
      setScanMessage('The camera scanner could not start. Check browser permissions and try again.');
    }
  }, [scanMode, stopScanner, verifyToken]);

  return {
    credential,
    error,
    loading,
    manualToken,
    scanMessage,
    scanMode,
    scanState,
    setManualToken,
    setScanMode,
    setScanState,
    setScanMessage,
    startScanner,
    stopScanner,
    verifyCredential,
    verifyToken,
    verificationStatus,
  };
}
