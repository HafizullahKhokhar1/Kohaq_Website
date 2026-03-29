export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto w-full max-w-md px-6 py-14">
      <h1 className="font-heading text-3xl text-primary">Forgot password</h1>
      <p className="mt-2 text-sm text-text-muted">
        Password reset email flow will be connected in the Resend phase. For now, contact support.
      </p>
      <form className="mt-8 space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <div>
          <label className="font-label text-xs uppercase tracking-[0.15em] text-text-muted">Email</label>
          <input type="email" required className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2" />
        </div>
        <button type="button" className="w-full rounded-full bg-accent px-4 py-2 font-label text-xs uppercase tracking-[0.15em] text-[#111]">
          Request reset link
        </button>
      </form>
    </main>
  );
}

