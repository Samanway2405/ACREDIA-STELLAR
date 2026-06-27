import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { VerificationStatusCard } from '../src/components/verification/VerificationStatusCard';

describe('VerificationStatusCard', () => {
  it('renders the primary verification state for valid credentials', () => {
    const html = renderToStaticMarkup(
      <VerificationStatusCard
        status="valid"
        title="Credential Verified ✓"
        message="This credential is authentic, valid, and secured on the blockchain"
      />
    );

    expect(html).toContain('Credential Verified');
    expect(html).toContain('Blockchain Verified');
    expect(html).toContain('Tamper-Proof');
  });

  it('renders revoked state details for revoked credentials', () => {
    const html = renderToStaticMarkup(
      <VerificationStatusCard
        status="revoked"
        title="Credential Revoked"
        message="This credential has been revoked by the issuing institution"
        revokedAt="2024-03-17"
      />
    );

    expect(html).toContain('Credential Revoked');
    expect(html).toContain('Revoked');
    expect(html).toContain('2024-03-17');
  });
});
