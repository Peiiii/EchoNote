import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Badge } from "@/common/components/ui/badge";
import { Checkbox } from "@/common/components/ui/checkbox";
import { AuthStatus } from "@/common/components/firebase/auth-status";
import { useFirebaseAuth } from "@/common/hooks/use-firebase-auth";
import { useCommonPresenterContext } from "@/common/hooks/use-common-presenter-context";
import { apiBase, buildAgentHandoffText } from "@/common/services/api-access-manager.service";
import type { PatMeta, PatScope } from "@/common/services/api-access-manager.service";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

function toExpiresAt(days: number | null): string | null {
  if (days === null) return null;
  const ms = Date.now() + days * 24 * 60 * 60 * 1000;
  return new Date(ms).toISOString();
}

export function ApiAccessPanel() {
  const { t } = useTranslation();
  const presenter = useCommonPresenterContext();
  const { user } = useFirebaseAuth();

  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<PatMeta[]>([]);
  const [createName, setCreateName] = useState("");
  const [scopeRead, setScopeRead] = useState(true);
  const [scopeWrite, setScopeWrite] = useState(true);
  const [expiryDays, setExpiryDays] = useState<number | null>(30);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [createdTokenMeta, setCreatedTokenMeta] = useState<PatMeta | null>(null);

  const createScopes = useMemo(() => {
    const scopes: PatScope[] = [];
    if (scopeRead) scopes.push("notes:read");
    if (scopeWrite) scopes.push("notes:write");
    return scopes;
  }, [scopeRead, scopeWrite]);

  const reload = async () => {
    setLoading(true);
    try {
      const res = await presenter.apiAccessManager.listPats();
      setItems(res.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.unknownError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !user.emailVerified) return;
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, user?.emailVerified]);

  const onCreate = async () => {
    if (!user) {
      toast.error(t("apiAccess.errors.signInRequired"));
      return;
    }
    if (!user.emailVerified) {
      toast.error(t("apiAccess.errors.emailNotVerified"));
      return;
    }
    if (!createName.trim()) {
      toast.error(t("apiAccess.errors.nameRequired"));
      return;
    }
    if (createScopes.length === 0) {
      toast.error(t("apiAccess.errors.scopeRequired"));
      return;
    }

    setLoading(true);
    try {
      const result = await presenter.apiAccessManager.createPat({
        name: createName.trim(),
        scopes: createScopes,
        expiresAt: toExpiresAt(expiryDays),
      });
      setCreatedToken(result.token);
      setCreatedTokenMeta(result.pat);
      setCreateName("");
      await reload();
      toast.success(t("apiAccess.created"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.unknownError"));
    } finally {
      setLoading(false);
    }
  };

  const onRevoke = async (patId: string) => {
    if (!user) {
      toast.error(t("apiAccess.errors.signInRequired"));
      return;
    }
    if (!user.emailVerified) {
      toast.error(t("apiAccess.errors.emailNotVerified"));
      return;
    }
    setLoading(true);
    try {
      await presenter.apiAccessManager.revokePat(patId);
      await reload();
      toast.success(t("apiAccess.revoked"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("common.unknownError"));
    } finally {
      setLoading(false);
    }
  };

  const onCopyToken = async () => {
    if (!createdToken) return;
    try {
      await navigator.clipboard.writeText(createdToken);
      toast.success(t("common.copied"));
    } catch {
      toast.error(t("apiAccess.errors.copyFailed"));
    }
  };

  const onCopyForAgent = async () => {
    if (!createdToken || !createdTokenMeta) return;
    const baseUrl = apiBase();
    const openapiUrl = `${baseUrl}/openapi.json`;
    const text = buildAgentHandoffText({
      baseUrl,
      openapiUrl,
      token: createdToken,
      scopes: createdTokenMeta.scopes,
      expiresAt: createdTokenMeta.expiresAt,
    });
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t("common.copied"));
    } catch {
      toast.error(t("apiAccess.errors.copyFailed"));
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium">{t("apiAccess.title")}</div>
        <div className="text-xs text-muted-foreground">{t("apiAccess.description")}</div>
      </div>

      {!user ? (
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
          <div className="text-sm font-medium">{t("apiAccess.signIn.title")}</div>
          <div className="text-xs text-muted-foreground">{t("apiAccess.signIn.description")}</div>
          <AuthStatus />
        </div>
      ) : !user.emailVerified ? (
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
          <div className="text-sm font-medium">{t("apiAccess.verifyEmail.title")}</div>
          <div className="text-xs text-muted-foreground">{t("apiAccess.verifyEmail.description")}</div>
        </div>
      ) : null}

      <div className="rounded-lg border border-border p-3 space-y-3">
        <div className="text-sm font-medium">{t("apiAccess.create.title")}</div>
        <div className="space-y-2">
          <Input
            value={createName}
            onChange={e => setCreateName(e.target.value)}
            placeholder={t("apiAccess.create.namePlaceholder")}
            disabled={loading}
          />
          <div className="flex flex-wrap gap-3 items-center">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={scopeRead} onCheckedChange={v => setScopeRead(v === true)} />
              <span>{t("apiAccess.scopes.read")}</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={scopeWrite} onCheckedChange={v => setScopeWrite(v === true)} />
              <span>{t("apiAccess.scopes.write")}</span>
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={expiryDays === 30 ? "default" : "outline"}
              size="sm"
              onClick={() => setExpiryDays(30)}
              disabled={loading}
            >
              {t("apiAccess.expiry.days30")}
            </Button>
            <Button
              variant={expiryDays === 90 ? "default" : "outline"}
              size="sm"
              onClick={() => setExpiryDays(90)}
              disabled={loading}
            >
              {t("apiAccess.expiry.days90")}
            </Button>
            <Button
              variant={expiryDays === null ? "default" : "outline"}
              size="sm"
              onClick={() => setExpiryDays(null)}
              disabled={loading}
            >
              {t("apiAccess.expiry.never")}
            </Button>
          </div>

          <Button onClick={onCreate} disabled={loading}>
            {loading ? t("common.loading") : t("apiAccess.create.cta")}
          </Button>
        </div>
      </div>

      {createdToken && createdTokenMeta && (
        <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-2">
          <div className="text-sm font-medium">{t("apiAccess.createdToken.title")}</div>
          <div className="text-xs text-muted-foreground">{t("apiAccess.createdToken.note")}</div>
          <div className="flex gap-2">
            <Input readOnly value={createdToken} />
            <Button variant="outline" onClick={onCopyToken}>
              {t("apiAccess.createdToken.copyToken")}
            </Button>
            <Button variant="outline" onClick={onCopyForAgent}>
              {t("apiAccess.createdToken.copyForAgent")}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setCreatedToken(null);
                setCreatedTokenMeta(null);
              }}
            >
              {t("common.dismiss")}
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">{t("apiAccess.tokens.title")}</div>
          <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
            {t("apiAccess.tokens.refresh")}
          </Button>
        </div>
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">{t("apiAccess.tokens.empty")}</div>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border/60 p-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{item.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {item.prefix} •{" "}
                    {item.scopes.map(s => (
                      <Badge key={s} variant="secondary" className="mr-1">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {item.expiresAt ? `${t("apiAccess.tokens.expiresAt")}: ${new Date(item.expiresAt).toLocaleString()}` : t("apiAccess.tokens.noExpiry")}
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={() => onRevoke(item.id)} disabled={loading}>
                  {t("apiAccess.tokens.revoke")}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
